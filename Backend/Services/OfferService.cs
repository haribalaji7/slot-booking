using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Services;

public class OfferService
{
    private readonly AppDbContext _db;

    public OfferService(AppDbContext db) => _db = db;

    public async Task<List<OfferResponse>> GetAllAsync(
        string? category = null,
        string? status = null,
        string? businessType = null,
        DateOnly? date = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        bool? availableOnly = null)
    {
        var query = _db.Offers.Include(o => o.Business).Include(o => o.Slots).AsQueryable();

        if (!string.IsNullOrEmpty(category)) query = query.Where(o => o.Category == category);
        if (!string.IsNullOrEmpty(status)) query = query.Where(o => o.Status == status);
        if (!string.IsNullOrEmpty(businessType)) query = query.Where(o => o.Business.BusinessType == businessType);
        if (date.HasValue) query = query.Where(o => o.StartDate <= date.Value && o.EndDate >= date.Value);
        if (minPrice.HasValue) query = query.Where(o => o.OfferPrice >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(o => o.OfferPrice <= maxPrice.Value);
        if (availableOnly == true) query = query.Where(o => o.Slots.Any(s => s.Status == "Available" && s.SlotDate >= DateOnly.FromDateTime(DateTime.UtcNow)));

        return await query.OrderByDescending(o => o.CreatedAt).Select(o => MapOffer(o)).ToListAsync();
    }

    public async Task<OfferResponse?> GetByIdAsync(Guid id)
    {
        var offer = await _db.Offers.Include(o => o.Business).Include(o => o.Slots).FirstOrDefaultAsync(o => o.Id == id);
        return offer == null ? null : MapOffer(offer);
    }

    public async Task<OfferResponse> CreateAsync(CreateOfferRequest request)
    {
        var offer = new Offer
        {
            BusinessId = request.BusinessId,
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            OriginalPrice = request.OriginalPrice,
            OfferPrice = request.OfferPrice,
            ImageUrl = request.ImageUrl,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            TermsAndConditions = request.TermsAndConditions,
            Status = request.Status ?? "Draft"
        };
        _db.Offers.Add(offer);
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(offer.Id))!;
    }

    public async Task<OfferResponse?> UpdateAsync(Guid id, UpdateOfferRequest request)
    {
        var offer = await _db.Offers.Include(o => o.Slots).FirstOrDefaultAsync(o => o.Id == id);
        if (offer == null) return null;

        if (request.Title != null) offer.Title = request.Title;
        if (request.Description != null) offer.Description = request.Description;
        if (request.Category != null) offer.Category = request.Category;
        if (request.OriginalPrice.HasValue) offer.OriginalPrice = request.OriginalPrice.Value;
        if (request.OfferPrice.HasValue) offer.OfferPrice = request.OfferPrice.Value;
        if (request.ImageUrl != null) offer.ImageUrl = request.ImageUrl;
        if (request.StartDate.HasValue) offer.StartDate = request.StartDate.Value;
        if (request.EndDate.HasValue) offer.EndDate = request.EndDate.Value;
        if (request.TermsAndConditions != null) offer.TermsAndConditions = request.TermsAndConditions;
        if (request.Status != null) offer.Status = request.Status;
        offer.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var offer = await _db.Offers.FindAsync(id);
        if (offer == null) return false;
        _db.Offers.Remove(offer);
        await _db.SaveChangesAsync();
        return true;
    }

    private static OfferResponse MapOffer(Offer o) => new()
    {
        Id = o.Id,
        BusinessId = o.BusinessId,
        BusinessName = o.Business?.Name ?? "",
        Title = o.Title,
        Description = o.Description,
        Category = o.Category,
        OriginalPrice = o.OriginalPrice,
        OfferPrice = o.OfferPrice,
        DiscountPercentage = o.DiscountPercentage,
        ImageUrl = o.ImageUrl,
        StartDate = o.StartDate,
        EndDate = o.EndDate,
        TermsAndConditions = o.TermsAndConditions,
        Status = o.Status,
        TotalSlots = o.Slots?.Count ?? 0,
        AvailableSlots = o.Slots?.Count(s => s.Status == "Available") ?? 0,
        CreatedAt = o.CreatedAt
    };
}

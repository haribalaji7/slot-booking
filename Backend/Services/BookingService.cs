using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Services;

public class BookingService
{
    private readonly AppDbContext _db;

    public BookingService(AppDbContext db) => _db = db;

    public async Task<BookingResponse?> CreateAsync(CreateBookingRequest request)
    {
        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            var slot = await _db.OfferSlots.Include(s => s.Offer).FirstOrDefaultAsync(s => s.Id == request.SlotId);
            if (slot == null) throw new InvalidOperationException("Slot not found.");
            if (slot.Status != "Available") throw new InvalidOperationException("Slot is not available.");
            if (slot.SlotDate < DateOnly.FromDateTime(DateTime.UtcNow)) throw new InvalidOperationException("Slot date has passed.");
            if (slot.Offer.Status != "Active") throw new InvalidOperationException("Offer is not active.");
            if (slot.Offer.StartDate > slot.SlotDate || slot.Offer.EndDate < slot.SlotDate)
                throw new InvalidOperationException("Offer is not within valid date range.");
            if (slot.BookedCount + request.PeopleCount > slot.Capacity)
                throw new InvalidOperationException("Not enough capacity.");

            var reference = $"SOB-{Random.Shared.Next(100000, 999999)}";

            var booking = new Booking
            {
                BookingReference = reference,
                OfferId = request.OfferId,
                SlotId = request.SlotId,
                CustomerName = request.CustomerName,
                CustomerPhone = request.CustomerPhone,
                CustomerEmail = request.CustomerEmail,
                PeopleCount = request.PeopleCount,
                SpecialNote = request.SpecialNote,
                Status = "Confirmed"
            };

            _db.Bookings.Add(booking);
            slot.BookedCount += request.PeopleCount;
            if (slot.BookedCount >= slot.Capacity) slot.Status = "Full";

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            return await GetByReferenceAsync(reference);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<BookingResponse?> GetByReferenceAsync(string reference)
    {
        return await _db.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .Where(b => b.BookingReference == reference)
            .Select(b => MapBooking(b))
            .FirstOrDefaultAsync();
    }

    public async Task<List<BookingResponse>> GetByOfferIdAsync(Guid offerId)
    {
        return await _db.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .Where(b => b.OfferId == offerId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => MapBooking(b))
            .ToListAsync();
    }

    public async Task<List<BookingResponse>> GetAllAsync()
    {
        return await _db.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => MapBooking(b))
            .ToListAsync();
    }

    public async Task<BookingResponse?> UpdateStatusAsync(Guid id, string status)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null) return null;
        booking.Status = status;
        await _db.SaveChangesAsync();
        return await GetByReferenceAsync(booking.BookingReference);
    }

    public async Task<DashboardResponse> GetDashboardAsync()
    {
        var now = DateOnly.FromDateTime(DateTime.UtcNow);
        var todayStart = DateTime.UtcNow.Date;
        var todayEnd = todayStart.AddDays(1);

        var totalOffers = await _db.Offers.CountAsync();
        var activeOffers = await _db.Offers.CountAsync(o => o.Status == "Active");
        var totalBookings = await _db.Bookings.CountAsync();
        var todayBookings = await _db.Bookings.CountAsync(b => b.CreatedAt >= todayStart && b.CreatedAt < todayEnd);
        var totalSlots = await _db.OfferSlots.CountAsync();
        var totalCapacity = await _db.OfferSlots.SumAsync(s => s.Capacity);
        var totalBooked = await _db.OfferSlots.SumAsync(s => s.BookedCount);

        return new DashboardResponse
        {
            TotalOffers = totalOffers,
            ActiveOffers = activeOffers,
            TotalBookings = totalBookings,
            TodayBookings = todayBookings,
            TotalSlots = totalSlots,
            ConversionRate = totalCapacity > 0 ? Math.Round((decimal)totalBooked / totalCapacity * 100, 1) : 0
        };
    }

    private static BookingResponse MapBooking(Booking b) => new()
    {
        Id = b.Id,
        BookingReference = b.BookingReference,
        OfferId = b.OfferId,
        OfferTitle = b.Offer?.Title ?? "",
        SlotId = b.SlotId,
        SlotDate = b.Slot.SlotDate,
        SlotStartTime = b.Slot.StartTime,
        SlotEndTime = b.Slot.EndTime,
        CustomerName = b.CustomerName,
        CustomerPhone = b.CustomerPhone,
        CustomerEmail = b.CustomerEmail,
        PeopleCount = b.PeopleCount,
        SpecialNote = b.SpecialNote,
        Status = b.Status,
        CreatedAt = b.CreatedAt
    };
}

using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Services;

public class SlotService
{
    private readonly AppDbContext _db;

    public SlotService(AppDbContext db) => _db = db;

    public async Task<List<SlotResponse>> GetByOfferIdAsync(Guid offerId)
    {
        return (await _db.OfferSlots
            .Where(s => s.OfferId == offerId)
            .Select(s => MapSlot(s))
            .ToListAsync())
            .OrderBy(s => s.SlotDate).ThenBy(s => s.StartTime)
            .ToList();
    }

    public async Task<List<SlotResponse>> GetAvailableByOfferIdAsync(Guid offerId)
    {
        return (await _db.OfferSlots
            .Where(s => s.OfferId == offerId && s.Status == "Available" && s.SlotDate >= DateOnly.FromDateTime(DateTime.UtcNow))
            .Select(s => MapSlot(s))
            .ToListAsync())
            .OrderBy(s => s.SlotDate).ThenBy(s => s.StartTime)
            .ToList();
    }

    public async Task<List<SlotResponse>> CreateSlotsAsync(CreateSlotsRequest request)
    {
        var slots = new List<OfferSlot>();
        var current = request.StartDate;

        while (current <= request.EndDate)
        {
            var start = request.StartTime;
            while (start < request.EndTime)
            {
                var end = start.Add(TimeSpan.FromMinutes(request.SlotDurationMinutes));
                if (end > request.EndTime) break;

                slots.Add(new OfferSlot
                {
                    OfferId = request.OfferId,
                    SlotDate = current,
                    StartTime = start,
                    EndTime = end,
                    Capacity = request.Capacity
                });
                start = end;
            }
            current = current.AddDays(1);
        }

        _db.OfferSlots.AddRange(slots);
        await _db.SaveChangesAsync();
        return slots.Select(MapSlot).ToList();
    }

    public async Task<bool> DeleteSlotAsync(Guid slotId)
    {
        var slot = await _db.OfferSlots.FindAsync(slotId);
        if (slot == null) return false;
        _db.OfferSlots.Remove(slot);
        await _db.SaveChangesAsync();
        return true;
    }

    private static SlotResponse MapSlot(OfferSlot s) => new()
    {
        Id = s.Id,
        OfferId = s.OfferId,
        SlotDate = s.SlotDate,
        StartTime = s.StartTime,
        EndTime = s.EndTime,
        Capacity = s.Capacity,
        BookedCount = s.BookedCount,
        Status = s.Status
    };
}

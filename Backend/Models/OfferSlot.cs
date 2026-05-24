namespace Backend.Models;

public class OfferSlot
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OfferId { get; set; }
    public Offer Offer { get; set; } = null!;
    public DateOnly SlotDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int Capacity { get; set; }
    public int BookedCount { get; set; }
    public string Status { get; set; } = "Available";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}

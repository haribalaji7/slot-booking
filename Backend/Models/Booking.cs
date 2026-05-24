namespace Backend.Models;

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string BookingReference { get; set; } = string.Empty;
    public Guid OfferId { get; set; }
    public Offer Offer { get; set; } = null!;
    public Guid SlotId { get; set; }
    public OfferSlot Slot { get; set; } = null!;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public int PeopleCount { get; set; } = 1;
    public string? SpecialNote { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

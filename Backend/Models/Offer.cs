namespace Backend.Models;

public class Offer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BusinessId { get; set; }
    public Business Business { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal OfferPrice { get; set; }
    public string? ImageUrl { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? TermsAndConditions { get; set; }
    public string Status { get; set; } = "Draft";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<OfferSlot> Slots { get; set; } = new List<OfferSlot>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public decimal DiscountPercentage =>
        OriginalPrice > 0 ? Math.Round((OriginalPrice - OfferPrice) / OriginalPrice * 100, 1) : 0;
}

namespace Backend.DTOs;

public class CreateBookingRequest
{
    public Guid OfferId { get; set; }
    public Guid SlotId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public int PeopleCount { get; set; } = 1;
    public string? SpecialNote { get; set; }
}

public class BookingResponse
{
    public Guid Id { get; set; }
    public string BookingReference { get; set; } = string.Empty;
    public Guid OfferId { get; set; }
    public string OfferTitle { get; set; } = string.Empty;
    public Guid SlotId { get; set; }
    public DateOnly SlotDate { get; set; }
    public TimeSpan SlotStartTime { get; set; }
    public TimeSpan SlotEndTime { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public int PeopleCount { get; set; }
    public string? SpecialNote { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class DashboardResponse
{
    public int TotalOffers { get; set; }
    public int ActiveOffers { get; set; }
    public int TotalBookings { get; set; }
    public int TodayBookings { get; set; }
    public int TotalSlots { get; set; }
    public decimal ConversionRate { get; set; }
}

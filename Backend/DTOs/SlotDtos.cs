namespace Backend.DTOs;

public class CreateSlotsRequest
{
    public Guid OfferId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int Capacity { get; set; }
    public int SlotDurationMinutes { get; set; } = 60;
}

public class SlotResponse
{
    public Guid Id { get; set; }
    public Guid OfferId { get; set; }
    public DateOnly SlotDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int Capacity { get; set; }
    public int BookedCount { get; set; }
    public int AvailableCount => Capacity - BookedCount;
    public string Status { get; set; } = string.Empty;
}

namespace Backend.DTOs;

public class CreateOfferRequest
{
    public Guid BusinessId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal OfferPrice { get; set; }
    public string? ImageUrl { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? TermsAndConditions { get; set; }
    public string? Status { get; set; }
}

public class UpdateOfferRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public decimal? OriginalPrice { get; set; }
    public decimal? OfferPrice { get; set; }
    public string? ImageUrl { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? TermsAndConditions { get; set; }
    public string? Status { get; set; }
}

public class OfferResponse
{
    public Guid Id { get; set; }
    public Guid BusinessId { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal OfferPrice { get; set; }
    public decimal DiscountPercentage { get; set; }
    public string? ImageUrl { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? TermsAndConditions { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalSlots { get; set; }
    public int AvailableSlots { get; set; }
    public DateTime CreatedAt { get; set; }
}

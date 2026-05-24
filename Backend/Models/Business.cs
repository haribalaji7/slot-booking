namespace Backend.Models;

public class Business
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string BusinessType { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public TimeSpan OpeningTime { get; set; }
    public TimeSpan ClosingTime { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}

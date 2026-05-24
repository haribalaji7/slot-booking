using Backend.Models;

namespace Backend.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Users.Any()) return;

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Name = "Admin",
            Email = "admin@slotbooking.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin"
        };
        db.Users.Add(admin);

        var business = new Business
        {
            Id = Guid.NewGuid(),
            Name = "Grand Restaurant",
            BusinessType = "Restaurant",
            OwnerName = "John Doe",
            Phone = "9876543210",
            Email = "contact@grandrestaurant.com",
            Address = "123 Main Street",
            City = "Mumbai",
            OpeningTime = new TimeSpan(9, 0, 0),
            ClosingTime = new TimeSpan(22, 0, 0)
        };
        db.Businesses.Add(business);
        db.SaveChanges();
    }
}

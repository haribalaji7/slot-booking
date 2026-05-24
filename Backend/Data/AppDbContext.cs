using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<OfferSlot> OfferSlots => Set<OfferSlot>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Role).HasDefaultValue("Admin");
        });

        modelBuilder.Entity<Business>(e =>
        {
            e.HasKey(x => x.Id);
        });

        modelBuilder.Entity<Offer>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Business).WithMany(x => x.Offers).HasForeignKey(x => x.BusinessId).OnDelete(DeleteBehavior.Cascade);
            e.Property(x => x.Status).HasDefaultValue("Draft");
            e.Ignore(x => x.DiscountPercentage);
        });

        modelBuilder.Entity<OfferSlot>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Offer).WithMany(x => x.Slots).HasForeignKey(x => x.OfferId).OnDelete(DeleteBehavior.Cascade);
            e.Property(x => x.Status).HasDefaultValue("Available");
        });

        modelBuilder.Entity<Booking>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.BookingReference).IsUnique();
            e.HasOne(x => x.Offer).WithMany(x => x.Bookings).HasForeignKey(x => x.OfferId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Slot).WithMany(x => x.Bookings).HasForeignKey(x => x.SlotId).OnDelete(DeleteBehavior.NoAction);
            e.Property(x => x.Status).HasDefaultValue("Pending");
        });
    }
}

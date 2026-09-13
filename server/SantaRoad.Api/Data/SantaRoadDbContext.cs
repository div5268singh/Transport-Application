using Microsoft.EntityFrameworkCore;
using SantaRoad.Api.Models;

namespace SantaRoad.Api.Data;

public class SantaRoadDbContext : DbContext
{
    public SantaRoadDbContext(DbContextOptions<SantaRoadDbContext> options) : base(options) { }

    public DbSet<Consignment> Consignments => Set<Consignment>();
    public DbSet<PartyDetail> PartyDetails => Set<PartyDetail>();
    public DbSet<BillingDetail> BillingDetails => Set<BillingDetail>();
    public DbSet<DriverAssignment> DriverAssignments => Set<DriverAssignment>();
    public DbSet<TrackingUpdate> TrackingUpdates => Set<TrackingUpdate>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<SiteContent> SiteContents => Set<SiteContent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BillingDetail>()
            .Ignore(b => b.BalanceAmount);

        modelBuilder.Entity<BillingDetail>()
            .Property(b => b.OrderPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<BillingDetail>()
            .Property(b => b.ReceivedAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Consignment>()
            .HasIndex(c => c.ConsignmentNumber)
            .IsUnique();

        modelBuilder.Entity<Consignment>()
            .HasOne(c => c.Sender)
            .WithMany()
            .HasForeignKey(c => c.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Consignment>()
            .HasOne(c => c.Receiver)
            .WithMany()
            .HasForeignKey(c => c.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Consignment>()
            .HasOne(c => c.Billing)
            .WithOne()
            .HasForeignKey<BillingDetail>(b => b.ConsignmentId);

        modelBuilder.Entity<Consignment>()
            .HasOne(c => c.DriverAssignment)
            .WithOne()
            .HasForeignKey<DriverAssignment>(d => d.ConsignmentId);

        modelBuilder.Entity<Consignment>()
            .HasMany(c => c.TrackingUpdates)
            .WithOne()
            .HasForeignKey(t => t.ConsignmentId);

        modelBuilder.Entity<DriverAssignment>()
            .HasIndex(d => d.Username)
            .IsUnique();

        modelBuilder.Entity<AdminUser>()
            .HasIndex(a => a.Username)
            .IsUnique();
    }
}

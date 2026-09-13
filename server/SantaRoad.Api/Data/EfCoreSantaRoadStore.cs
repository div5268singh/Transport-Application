using Microsoft.EntityFrameworkCore;
using SantaRoad.Api.Models;

namespace SantaRoad.Api.Data;

public sealed class EfCoreSantaRoadStore : ISantaRoadStore
{
    private readonly SantaRoadDbContext _db;

    public EfCoreSantaRoadStore(SantaRoadDbContext db) => _db = db;

    public Task<AdminUser?> GetAdminAsync(string username) =>
        _db.AdminUsers.FirstOrDefaultAsync(admin => admin.Username == username);

    public async Task SaveAdminAsync(AdminUser admin)
    {
        if (admin.Id == 0)
        {
            _db.AdminUsers.Add(admin);
        }
        await _db.SaveChangesAsync();
    }

    public Task<bool> ConsignmentNumberExistsAsync(string consignmentNumber) =>
        _db.Consignments.AnyAsync(consignment => consignment.ConsignmentNumber == consignmentNumber);

    public async Task<Consignment> CreateConsignmentAsync(Consignment consignment)
    {
        _db.Consignments.Add(consignment);
        await _db.SaveChangesAsync();
        return consignment;
    }

    public async Task<IReadOnlyList<Consignment>> ListConsignmentsAsync(ConsignmentStatus? status = null)
    {
        var query = _db.Consignments
            .Include(consignment => consignment.Sender)
            .Include(consignment => consignment.Receiver)
            .AsQueryable();

        if (status is not null)
        {
            query = query.Where(consignment => consignment.Status == status);
        }

        return await query.OrderByDescending(consignment => consignment.CreatedAt).ToListAsync();
    }

    public Task<Consignment?> GetConsignmentByIdAsync(int id) =>
        ConsignmentsWithDetails().FirstOrDefaultAsync(consignment => consignment.Id == id);

    public Task<Consignment?> GetConsignmentByNumberAsync(string consignmentNumber) =>
        ConsignmentsWithDetails().FirstOrDefaultAsync(consignment => consignment.ConsignmentNumber == consignmentNumber);

    public Task<Consignment?> GetConsignmentByDriverUsernameAsync(string username) =>
        ConsignmentsWithDetails().FirstOrDefaultAsync(consignment => consignment.DriverAssignment.Username == username);

    public async Task SaveConsignmentAsync(Consignment consignment) => await _db.SaveChangesAsync();

    public Task<SiteContent?> GetSiteContentAsync() =>
        _db.SiteContents.OrderByDescending(content => content.UpdatedAt).FirstOrDefaultAsync();

    public async Task SaveSiteContentAsync(SiteContent content)
    {
        if (content.Id == 0)
        {
            _db.SiteContents.Add(content);
        }
        await _db.SaveChangesAsync();
    }

    private IQueryable<Consignment> ConsignmentsWithDetails() => _db.Consignments
        .Include(consignment => consignment.Sender)
        .Include(consignment => consignment.Receiver)
        .Include(consignment => consignment.Billing)
        .Include(consignment => consignment.DriverAssignment)
        .Include(consignment => consignment.TrackingUpdates);
}

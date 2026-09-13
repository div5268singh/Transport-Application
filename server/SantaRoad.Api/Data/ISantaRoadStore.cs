using SantaRoad.Api.Models;

namespace SantaRoad.Api.Data;

public interface ISantaRoadStore
{
    Task<AdminUser?> GetAdminAsync(string username);
    Task SaveAdminAsync(AdminUser admin);
    Task<bool> ConsignmentNumberExistsAsync(string consignmentNumber);
    Task<Consignment> CreateConsignmentAsync(Consignment consignment);
    Task<IReadOnlyList<Consignment>> ListConsignmentsAsync(ConsignmentStatus? status = null);
    Task<Consignment?> GetConsignmentByIdAsync(int id);
    Task<Consignment?> GetConsignmentByNumberAsync(string consignmentNumber);
    Task<Consignment?> GetConsignmentByDriverUsernameAsync(string username);
    Task SaveConsignmentAsync(Consignment consignment);
    Task<SiteContent?> GetSiteContentAsync();
    Task SaveSiteContentAsync(SiteContent content);
}

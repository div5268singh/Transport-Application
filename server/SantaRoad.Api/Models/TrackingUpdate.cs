
namespace SantaRoad.Api.Models;

public class TrackingUpdate
{
    public int Id { get; set; }
    public int ConsignmentId { get; set; }
    public string CityName { get; set; } = string.Empty;
    public string AreaName { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

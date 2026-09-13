namespace SantaRoad.Api.Models;

public class Consignment
{
    public int Id { get; set; }
    public string ConsignmentNumber { get; set; } = string.Empty;
    public ConsignmentStatus Status { get; set; } = ConsignmentStatus.Created;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeliveredAt { get; set; }

    public int SenderId { get; set; }
    public PartyDetail Sender { get; set; } = null!;

    public int ReceiverId { get; set; }
    public PartyDetail Receiver { get; set; } = null!;
    public BillingDetail Billing { get; set; } = null!;
    public DriverAssignment DriverAssignment { get; set; } = null!;
    public ICollection<TrackingUpdate> TrackingUpdates { get; set; } = new List<TrackingUpdate>();
}

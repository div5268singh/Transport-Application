using Google.Cloud.Firestore;
using SantaRoad.Api.Data;

namespace SantaRoad.Api.Models;

[FirestoreData]
public class Consignment
{
    [FirestoreProperty]
    public int Id { get; set; }
    [FirestoreProperty]
    public string ConsignmentNumber { get; set; } = string.Empty;
    [FirestoreProperty(ConverterType = typeof(ConsignmentStatusFirestoreConverter))]
    public ConsignmentStatus Status { get; set; } = ConsignmentStatus.Created;
    [FirestoreProperty]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [FirestoreProperty]
    public DateTime? DeliveredAt { get; set; }

    public int SenderId { get; set; }
    [FirestoreProperty]
    public PartyDetail Sender { get; set; } = null!;

    public int ReceiverId { get; set; }
    [FirestoreProperty]
    public PartyDetail Receiver { get; set; } = null!;
    [FirestoreProperty]
    public BillingDetail Billing { get; set; } = null!;
    [FirestoreProperty]
    public DriverAssignment DriverAssignment { get; set; } = null!;

    [FirestoreProperty]
    public ICollection<TrackingUpdate> TrackingUpdates { get; set; } = new List<TrackingUpdate>();
}

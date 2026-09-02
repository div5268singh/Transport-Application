using Google.Cloud.Firestore;
using SantaRoad.Api.Data;

namespace SantaRoad.Api.Models;

[FirestoreData]
public class BillingDetail
{
    public int Id { get; set; }
    public int ConsignmentId { get; set; }

    [FirestoreProperty(ConverterType = typeof(DecimalFirestoreConverter))]
    public decimal OrderPrice { get; set; }
    [FirestoreProperty(ConverterType = typeof(DecimalFirestoreConverter))]
    public decimal ReceivedAmount { get; set; }

    // Computed, not stored — EF Core will map this as a NotMapped-style property
    // because it has no setter; ignore it explicitly in DbContext if your EF
    // version complains, or mark it [NotMapped].
    public decimal BalanceAmount => OrderPrice - ReceivedAmount;

    [FirestoreProperty]
    public string BalancePaymentMode { get; set; } = string.Empty; // e.g. "Cash on delivery", "Bank transfer"
    [FirestoreProperty]
    public string BalancePaymentNotes { get; set; } = string.Empty;
}

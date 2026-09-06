namespace SantaRoad.Api.Models;

public class BillingDetail
{
    public int Id { get; set; }
    public int ConsignmentId { get; set; }
    public decimal OrderPrice { get; set; }
    public decimal ReceivedAmount { get; set; }

    // Computed, not stored — EF Core will map this as a NotMapped-style property
    // because it has no setter; ignore it explicitly in DbContext if your EF
    // version complains, or mark it [NotMapped].
    public decimal BalanceAmount => OrderPrice - ReceivedAmount;
    public string BalancePaymentMode { get; set; } = string.Empty; // e.g. "Cash on delivery", "Bank transfer"
    public string BalancePaymentNotes { get; set; } = string.Empty;
}

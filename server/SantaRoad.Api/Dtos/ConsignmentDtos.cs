using SantaRoad.Api.Models;

namespace SantaRoad.Api.Dtos;

public record PartyDto(
    string CompanyName,
    string ContactPerson1Name,
    string ContactPerson1Phone,
    string ContactPerson2Name,
    string ContactPerson2Phone,
    string Email,
    string Address
);

public record BillingDto(
    decimal OrderPrice,
    decimal ReceivedAmount,
    string BalancePaymentMode,
    string BalancePaymentNotes
);

public record DriverDetailsDto(
    string VehicleNumber,
    string DriverName,
    string DriverContactNo,
    string SecondContactNo,
    string OwnerContactNo
);

// Admin -> POST /api/consignments
public record CreateConsignmentRequest(
    PartyDto Sender,
    PartyDto Receiver,
    BillingDto Billing,
    DriverDetailsDto Driver
);

// Returned once, right after creation — the only time the plaintext
// driver password is ever shown.
public record CreateConsignmentResponse(
    int Id,
    string ConsignmentNumber,
    string TrackingLink,
    string DriverUsername,
    string DriverPasswordPlaintext
);

// Admin -> GET /api/consignments (list)
public record ConsignmentSummaryDto(
    int Id,
    string ConsignmentNumber,
    ConsignmentStatus Status,
    string SenderCompanyName,
    string ReceiverCompanyName,
    DateTime CreatedAt
);

// Admin -> GET /api/consignments/{id} (full detail, billing included)
public record ConsignmentDetailDto(
    int Id,
    string ConsignmentNumber,
    ConsignmentStatus Status,
    DateTime CreatedAt,
    DateTime? DeliveredAt,
    PartyDto Sender,
    PartyDto Receiver,
    BillingDto Billing,
    DriverDetailsDto Driver,
    List<TrackingUpdateDto> TrackingUpdates
);

public record UpdateStatusRequest(ConsignmentStatus Status);

// Driver -> GET /api/driver/consignment (no billing)
public record DriverConsignmentDto(
    string ConsignmentNumber,
    ConsignmentStatus Status,
    PartyDto Sender,
    PartyDto Receiver,
    DriverDetailsDto Driver
);

public record DriverLocationRequest(string CityName, string AreaName);

public record TrackingUpdateDto(string CityName, string AreaName, DateTime UpdatedAt);

// Public -> GET /api/tracking/{number} (no billing, no credentials)
public record PublicTrackingDto(
    string ConsignmentNumber,
    ConsignmentStatus Status,
    string SenderCompanyName,
    string ReceiverCompanyName,
    string VehicleNumber,
    string DriverName,
    List<TrackingUpdateDto> History
);

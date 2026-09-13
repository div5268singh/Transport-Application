using System.ComponentModel.DataAnnotations;
using SantaRoad.Api.Models;

namespace SantaRoad.Api.Dtos;

public record PartyDto(
    [property: Required, StringLength(120, MinimumLength = 2)] string CompanyName,
    [property: Required, StringLength(100, MinimumLength = 2)] string ContactPerson1Name,
    [property: Required, RegularExpression(@"^[0-9+\-()\s]{7,20}$")] string ContactPerson1Phone,
    [property: Required, StringLength(100, MinimumLength = 2)] string ContactPerson2Name,
    [property: Required, RegularExpression(@"^[0-9+\-()\s]{7,20}$")] string ContactPerson2Phone,
    [property: Required, EmailAddress, StringLength(256)] string Email,
    [property: Required, StringLength(300, MinimumLength = 5)] string Address
);

public record BillingDto(
    [property: Range(0, 999999999)] decimal OrderPrice,
    [property: Range(0, 999999999)] decimal ReceivedAmount,
    [property: Required, StringLength(60, MinimumLength = 2)] string BalancePaymentMode,
    [property: Required, StringLength(500, MinimumLength = 2)] string BalancePaymentNotes
);

public record DriverDetailsDto(
    [property: Required, StringLength(40, MinimumLength = 3)] string VehicleNumber,
    [property: Required, StringLength(100, MinimumLength = 2)] string DriverName,
    [property: Required, RegularExpression(@"^[0-9+\-()\s]{7,20}$")] string DriverContactNo,
    [property: Required, RegularExpression(@"^[0-9+\-()\s]{7,20}$")] string SecondContactNo,
    [property: Required, RegularExpression(@"^[0-9+\-()\s]{7,20}$")] string OwnerContactNo,
    [property: Required, EmailAddress, StringLength(256)] string DriverEmail
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

public record DriverLocationRequest(
    [property: Required, StringLength(120, MinimumLength = 2)] string CityName,
    [property: Required, StringLength(120, MinimumLength = 2)] string StateName
);

public record TrackingUpdateDto(string CityName, string StateName, DateTime UpdatedAt);

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

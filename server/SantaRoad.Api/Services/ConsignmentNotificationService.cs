using SantaRoad.Api.Models;

namespace SantaRoad.Api.Services;

public class ConsignmentNotificationService
{
    private readonly IEmailSender _emailSender;
    private readonly IConfiguration _config;
    private readonly ILogger<ConsignmentNotificationService> _logger;

    public ConsignmentNotificationService(
        IEmailSender emailSender,
        IConfiguration config,
        ILogger<ConsignmentNotificationService> logger)
    {
        _emailSender = emailSender;
        _config = config;
        _logger = logger;
    }

    public async Task SendCreatedAsync(Consignment consignment, string trackingLink, string driverUsername, string driverPassword)
    {
        var senderSubject = $"Consignment {consignment.ConsignmentNumber} created";
        var receiverSubject = $"Incoming consignment {consignment.ConsignmentNumber}";
        var driverSubject = $"Driver login for consignment {consignment.ConsignmentNumber}";

        var senderBody = BuildSenderBody(consignment, trackingLink);
        var receiverBody = BuildReceiverBody(consignment, trackingLink);
        var driverBody = BuildDriverBody(consignment, driverUsername, driverPassword);

        await SendIfPresent(consignment.Sender.Email, senderSubject, senderBody);
        await SendIfPresent(consignment.Receiver.Email, receiverSubject, receiverBody);
        await SendIfPresent(consignment.DriverAssignment.DriverEmail, driverSubject, driverBody);
    }

    public async Task SendDeliveredAsync(Consignment consignment)
    {
        var subject = $"Consignment {consignment.ConsignmentNumber} delivered";

        var senderBody = BuildDeliveredBody(
            "Sender",
            consignment,
            "Your consignment has been delivered successfully.");

        var receiverBody = BuildDeliveredBody(
            "Receiver",
            consignment,
            "The consignment for your location has been marked delivered.");

        var driverBody = BuildDeliveredBody(
            "Driver",
            consignment,
            "This trip is complete. Your login credentials will expire after delivery day.");

        await SendIfPresent(consignment.Sender.Email, subject, senderBody);
        await SendIfPresent(consignment.Receiver.Email, subject, receiverBody);
        await SendIfPresent(consignment.DriverAssignment.DriverEmail, subject, driverBody);
    }

    private async Task SendIfPresent(string email, string subject, string body)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return;
        }

        var sent = await _emailSender.SendAsync(email.Trim(), subject, body);
        if (!sent)
        {
            _logger.LogWarning("Email not sent to {Email} for subject {Subject}", email, subject);
        }
    }

    private string BuildSenderBody(Consignment c, string trackingLink) =>
        $"""
        <p>Hello Sender Team,</p>
        <p>Your consignment has been created with number <strong>{c.ConsignmentNumber}</strong>.</p>
        <p><strong>Track shipment:</strong> <a href=\"{trackingLink}\">{trackingLink}</a></p>
        <p><strong>Receiver:</strong> {c.Receiver.CompanyName}</p>
        <p><strong>Vehicle:</strong> {c.DriverAssignment.VehicleNumber}</p>
        <p>Thank you for choosing us.</p>
        """;

    private string BuildReceiverBody(Consignment c, string trackingLink) =>
        $"""
        <p>Hello Receiver Team,</p>
        <p>A consignment is on the way for your organization.</p>
        <p><strong>Consignment number:</strong> {c.ConsignmentNumber}</p>
        <p><strong>Track shipment:</strong> <a href=\"{trackingLink}\">{trackingLink}</a></p>
        <p><strong>Sender:</strong> {c.Sender.CompanyName}</p>
        <p>We will keep this shipment updated until delivery.</p>
        """;

    private string BuildDriverBody(Consignment c, string username, string password)
    {
        var frontendBase = (_config["Frontend:BaseUrl"] ?? "http://localhost:4200").TrimEnd('/');
        var driverLoginUrl = _config["Frontend:DriverLoginUrl"] ?? $"{frontendBase}/driver/login";

        return
            $"""
            <p>Hello {c.DriverAssignment.DriverName},</p>
            <p>You have been assigned to consignment <strong>{c.ConsignmentNumber}</strong>.</p>
            <p><strong>Login URL:</strong> <a href=\"{driverLoginUrl}\">{driverLoginUrl}</a></p>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Password:</strong> {password}</p>
            <p>After delivery day, these credentials will no longer work.</p>
            """;
    }

    private static string BuildDeliveredBody(string audience, Consignment c, string message) =>
        $"""
        <p>Hello {audience},</p>
        <p>{message}</p>
        <p><strong>Consignment number:</strong> {c.ConsignmentNumber}</p>
        <p><strong>Delivered at (UTC):</strong> {c.DeliveredAt:yyyy-MM-dd HH:mm}</p>
        <p>Regards,<br/>Santa Road Logistics</p>
        """;
}

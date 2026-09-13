using System.Net;
using System.Net.Mail;

namespace SantaRoad.Api.Services;

public class SmtpEmailSender : IEmailSender
{
    private readonly IConfiguration _config;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(IConfiguration config, ILogger<SmtpEmailSender> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task<bool> SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        var smtpHost = (_config["Email:SmtpHost"] ?? string.Empty).Trim();
        var fromEmail = (_config["Email:FromEmail"] ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(smtpHost) || string.IsNullOrWhiteSpace(fromEmail))
        {
            _logger.LogWarning("Email settings missing. Configure Email:SmtpHost and Email:FromEmail to enable notifications.");
            return false;
        }

        var port = int.TryParse(_config["Email:SmtpPort"], out var configuredPort) ? configuredPort : 587;
        var enableSsl = !bool.TryParse(_config["Email:EnableSsl"], out var configuredSsl) || configuredSsl;
        var smtpUser = (_config["Email:SmtpUser"] ?? string.Empty).Trim();
        var smtpPassword = _config["Email:SmtpPassword"] ?? string.Empty;
        var fromName = (_config["Email:FromName"] ?? "Santa Road Logistics").Trim();

        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true,
            };

            message.To.Add(toEmail);

            using var client = new SmtpClient(smtpHost, port)
            {
                EnableSsl = enableSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
            };

            if (!string.IsNullOrWhiteSpace(smtpUser))
            {
                client.Credentials = new NetworkCredential(smtpUser, smtpPassword);
            }

            await client.SendMailAsync(message, cancellationToken);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            return false;
        }
    }
}

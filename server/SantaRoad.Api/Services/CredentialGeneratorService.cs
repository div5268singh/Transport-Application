using System.Security.Cryptography;

namespace SantaRoad.Api.Services;

public class CredentialGeneratorService
{
    private static readonly char[] UsernameChars = "abcdefghjkmnpqrstuvwxyz23456789".ToCharArray();
    private static readonly char[] PasswordChars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%".ToCharArray();

    public string GenerateConsignmentNumber()
    {
        var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
        var randomPart = RandomNumberGenerator.GetInt32(0, 10000).ToString("D4");
        return $"SR-{datePart}-{randomPart}";
    }

    public string GenerateDriverUsername(string driverName)
    {
        var slug = new string((driverName ?? "driver")
            .ToLowerInvariant()
            .Where(char.IsLetter)
            .ToArray());
        if (slug.Length == 0) slug = "driver";
        if (slug.Length > 10) slug = slug[..10];

        var suffix = RandomString(UsernameChars, 4);
        return $"{slug}{suffix}";
    }

    public string GeneratePassword(int length = 10)
    {
        return RandomString(PasswordChars, length);
    }

    private static string RandomString(char[] alphabet, int length)
    {
        var chars = new char[length];
        for (var i = 0; i < length; i++)
        {
            chars[i] = alphabet[RandomNumberGenerator.GetInt32(0, alphabet.Length)];
        }
        return new string(chars);
    }
}

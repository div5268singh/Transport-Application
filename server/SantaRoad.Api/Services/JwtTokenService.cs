using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace SantaRoad.Api.Services;

public class JwtTokenService
{
    private readonly IConfiguration _config;

    public JwtTokenService(IConfiguration config)
    {
        _config = config;
    }

    public (string token, DateTime expiresAt) IssueAdminToken(string username)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, username),
            new(ClaimTypes.Role, "Admin"),
        };
        return Issue(claims, _config["Jwt:AudienceAdmin"]!);
    }

    public (string token, DateTime expiresAt) IssueDriverToken(int consignmentId, string consignmentNumber, string username)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, username),
            new(ClaimTypes.Role, "Driver"),
            new("consignmentId", consignmentId.ToString()),
            new("consignmentNumber", consignmentNumber),
        };
        return Issue(claims, _config["Jwt:AudienceDriver"]!);
    }

    private (string token, DateTime expiresAt) Issue(List<Claim> claims, string audience)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var minutes = int.Parse(_config["Jwt:AccessTokenMinutes"] ?? "480");
        var expires = DateTime.UtcNow.AddMinutes(minutes);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expires);
    }
}

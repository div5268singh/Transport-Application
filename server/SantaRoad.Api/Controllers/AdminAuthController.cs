using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SantaRoad.Api.Data;
using SantaRoad.Api.Dtos;
using SantaRoad.Api.Services;

namespace SantaRoad.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminAuthController : ControllerBase
{
    private readonly ISantaRoadStore _store;
    private readonly JwtTokenService _jwt;

    public AdminAuthController(ISantaRoadStore store, JwtTokenService jwt)
    {
        _store = store;
        _jwt = jwt;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AdminLoginResponse>> Login(AdminLoginRequest request)
    {
        var user = await _store.GetAdminAsync(request.Username);
        if (user is null || !user.IsActive || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var (token, expiresAt) = _jwt.IssueAdminToken(user.Username);
        return Ok(new AdminLoginResponse(
            token,
            expiresAt,
            user.Username,
            user.FullName,
            user.Email,
            user.ContactNumber,
            user.Designation));
    }

    [HttpGet("session")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AdminSessionResponse>> Session()
    {
        var username = User.Identity?.Name ?? string.Empty;
        var user = await _store.GetAdminAsync(username);
        if (user is null || !user.IsActive)
        {
            return Unauthorized(new { message = "Admin account is unavailable." });
        }

        return Ok(new AdminSessionResponse(
            true,
            user.Username,
            user.FullName,
            user.Email,
            user.ContactNumber,
            user.Designation));
    }

    [HttpPost("logout")]
    [Authorize(Roles = "Admin")]
    public IActionResult Logout()
    {
        // Stateless JWT: there is no server-side session to invalidate.
        // The frontend must discard its stored token on logout.
        return Ok(new { message = "Logged out. Discard the token client-side." });
    }
}

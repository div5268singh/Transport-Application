namespace SantaRoad.Api.Dtos;

// The frontend already has a well-defined JSON shape for site content
// (public/assets/config/app.config.json) — we pass it through as a raw
// JSON string rather than re-modeling every banner/service/client field
// as relational tables. Admin edits the same JSON shape it already knows.
public record SiteContentResponse(string JsonData, DateTime UpdatedAt);
public record UpdateSiteContentRequest(string JsonData);

public record MediaUploadResponse(string Url, string FileName);

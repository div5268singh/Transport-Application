using System.Text.Json.Nodes;

namespace SantaRoad.Api.Startup;

/// <summary>
/// Merge helpers that keep a stored site-content document in sync with the
/// bundled defaults without discarding admin edits.
/// </summary>
internal static class SiteContentMerger
{
    private static readonly (string Search, string Replacement)[] LegacyNames =
    [
        ("New New Satna Road Lines Lines", "New Satna Road Lines"),
        ("Satna Road Industrial Logistics", "New Satna Road Lines"),
        ("Santa Road Industrial Logistics", "New Satna Road Lines"),
        ("Santa Road", "New Satna Road Lines"),
        ("Satna Road", "New Satna Road Lines"),
    ];

    public static bool AddMissingContent(JsonObject target, JsonObject defaults)
    {
        var changed = false;

        foreach (var property in defaults)
        {
            if (!target.ContainsKey(property.Key))
            {
                target[property.Key] = property.Value?.DeepClone();
                changed = true;
                continue;
            }

            if (target[property.Key] is JsonObject targetObject && property.Value is JsonObject defaultObject)
            {
                changed |= AddMissingContent(targetObject, defaultObject);
            }
        }

        return changed;
    }

    public static bool ReplaceLegacyApplicationName(JsonNode node)
    {
        switch (node)
        {
            case JsonObject jsonObject:
            {
                var changed = false;
                foreach (var property in jsonObject.ToList())
                {
                    if (property.Value is JsonValue value && value.TryGetValue<string>(out var text))
                    {
                        var updated = Rename(text);
                        if (!string.Equals(text, updated, StringComparison.Ordinal))
                        {
                            jsonObject[property.Key] = updated;
                            changed = true;
                        }
                    }
                    else if (property.Value is not null)
                    {
                        changed |= ReplaceLegacyApplicationName(property.Value);
                    }
                }
                return changed;
            }

            case JsonArray jsonArray:
            {
                var changed = false;
                foreach (var item in jsonArray)
                {
                    if (item is not null)
                    {
                        changed |= ReplaceLegacyApplicationName(item);
                    }
                }
                return changed;
            }

            default:
                return false;
        }
    }

    private static string Rename(string text)
    {
        foreach (var (search, replacement) in LegacyNames)
        {
            if (!text.Contains(search, StringComparison.Ordinal))
            {
                continue;
            }

            // Already correct - the target name itself contains "Satna Road".
            return search == "Satna Road" && text.Contains("New Satna Road Lines", StringComparison.Ordinal)
                ? text
                : text.Replace(search, replacement, StringComparison.Ordinal);
        }

        return text;
    }
}

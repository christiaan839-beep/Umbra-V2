/**
 * Input validation utilities for SOVEREIGN tool forms.
 * Prevents garbage requests from reaching the API.
 */

export function isValidUrl(url: string): boolean {
  if (!url.trim()) return false;
  // Accept with or without protocol
  const withProtocol = url.startsWith("http") ? url : `https://${url}`;
  try {
    const u = new URL(withProtocol);
    // Must have at least a dot in hostname (e.g. "example.com", not "example")
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function getValidationError(fields: { name: string; value: string; type?: string }[]): string | null {
  for (const field of fields) {
    if (!isNotEmpty(field.value)) {
      return `Please fill in the "${field.name}" field`;
    }
    if (field.type === "url" && !isValidUrl(field.value)) {
      return `"${field.name}" must be a valid URL (e.g. example.com)`;
    }
  }
  return null;
}

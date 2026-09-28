import { translations } from "../../i18n/translations";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// The backend's rate limiter answers 429 + code RATE_LIMITED (see
// backend/src/middleware/rateLimit.js). Its message is English, so it's
// replaced here, once for every form, by the text in the page's language
// (LanguageContext keeps <html lang> in sync with the chosen language).
function rateLimitedMessage(minutes) {
  const lang = document.documentElement.lang;
  const text = (translations[lang] || translations.en)["common.tooManyAttempts"];
  return text.replace("{minutes}", String(minutes || 15));
}
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

async function request(
  path,
  { method = "GET", body, isFormData = false } = {},
) {
  const headers = {};
  if (body !== undefined && !isFormData)
    headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body:
      body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      payload?.message || `Request failed with status ${response.status}`,
    );
    error.status = response.status;
    error.code = payload?.code; // optional machine-readable reason, e.g. TEAM_UNAVAILABLE
    if (payload?.code === "RATE_LIMITED") {
      error.message = rateLimitedMessage(payload.retryAfterMinutes);
    }
    throw error;
  }

  return payload;
}

export const http = {
  get: (path) => request(path),
  post: (path, body, opts) => request(path, { method: "POST", body, ...opts }),
  patch: (path, body, opts) =>
    request(path, { method: "PATCH", body, ...opts }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export function resolveFileUrl(url) {
  if (!url) return url;
  return url.startsWith("/") ? `${API_ORIGIN}${url}` : url;
}

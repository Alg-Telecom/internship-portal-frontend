const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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

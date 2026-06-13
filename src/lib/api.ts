const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

/** Full URL for a v1 API path, e.g. `/waitlist` → `http://localhost:4000/api/v1/waitlist` */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}/api/v1${normalized}`;
}

export { API_BASE };

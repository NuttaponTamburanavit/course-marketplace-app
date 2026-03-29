const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) => request<T>(path, { method: 'GET', ...options }),
  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), ...options }),
};

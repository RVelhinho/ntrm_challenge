const API_URL = __NUTRIUM_API_URL__;

export type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly body: ApiErrorPayload | undefined;

  constructor(message: string, status: number, body: ApiErrorPayload | undefined) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === 'object' && value !== null;
}

export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const parsedBody: unknown = await response.json().catch(() => undefined);
    const body = isApiErrorPayload(parsedBody) ? parsedBody : undefined;
    const message = body?.error?.message ?? `API request failed with status ${response.status}`;
    throw new ApiError(message, response.status, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json();
  return { data, status: response.status, headers: response.headers } as T;
}

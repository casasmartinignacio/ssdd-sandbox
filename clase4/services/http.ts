type ErrorBody = {
  message?: string;
};

export async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const data = (await response.json()) as TResponse & ErrorBody;
  if (!response.ok) {
    throw new Error(data.message || "No se pudo completar la operación");
  }
  return data;
}

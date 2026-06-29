/**
 * Camada central de acesso à API real (pasta server/).
 *
 * Se VITE_API_URL não estiver definida (.env.local), o app continua funcionando
 * inteiramente com dados locais de demonstração — isBackendConfigured() permite
 * que as stores decidam entre chamar a API real ou usar o fallback local.
 */

export const API_URL = import.meta.env.VITE_API_URL as string | undefined;

export function isBackendConfigured(): boolean {
  return Boolean(API_URL && API_URL.trim().length > 0);
}

interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('VITE_API_URL não configurada.');
  }

  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Erro na requisição (${response.status})`);
  }

  return response.json() as Promise<T>;
}

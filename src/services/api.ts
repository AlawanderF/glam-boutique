/**
 * Camada central de acesso à API real (pasta server/).
 *
 * Se VITE_API_URL não estiver definida (.env.local), o app continua funcionando
 * inteiramente com dados locais de demonstração — isBackendConfigured() permite
 * que as stores decidam entre chamar a API real ou usar o fallback local.
 */

export const API_URL = import.meta.env.VITE_API_URL as string | undefined;

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertKeysToCamelCase<T>(obj: any): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(convertKeysToCamelCase) as any;
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = snakeToCamel(key);
    acc[camelKey] = convertKeysToCamelCase(obj[key]);
    return acc;
  }, {} as any);
}

export function isBackendConfigured(): boolean {
  return Boolean(API_URL && API_URL.trim().length > 0);
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('VITE_API_URL não configurada.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include HTTP-only cookies
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Erro na requisição (${response.status})`);
  }

  return convertKeysToCamelCase<T>(await response.json());
}

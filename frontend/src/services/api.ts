const BASE_URL = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (res.status === 401) {
    // Only redirect if not already on auth pages
    if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};

// Auth
export const auth = {
  login: (username: string, password: string) =>
    api.post<{ user: any; token: string }>('/auth/login', { username, password }),
  register: (data: { username: string; email: string; password: string; fullName: string }) =>
    api.post<{ user: any; token: string }>('/auth/register', data),
  me: () => api.get<any>('/auth/me'),
  logout: () => api.post<void>('/auth/logout', {}),
};

// Dashboard
export const dashboard = {
  getSummary: () => api.get<any>('/dashboard/summary'),
  getEarnings: () => api.get<any[]>('/dashboard/earnings'),
  getEarningsByCategory: () => api.get<any[]>('/dashboard/earnings-by-category'),
  getUtilization: () => api.get<any>('/dashboard/utilization'),
  getRecent: () => api.get<any>('/dashboard/recent'),
};

// Vehicles
export const vehicles = {
  getAll: (params?: Record<string, string | undefined>) => {
    const qs = params && Object.keys(params).length > 0
      ? '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1]) && entry[1] !== 'all'))
        ).toString()
      : '';
    return api.get<any[]>(`/vehicles${qs}`);
  },
  getOne: (id: number) => api.get<any>(`/vehicles/${id}`),
  getById: (id: number) => api.get<any>(`/vehicles/${id}`),
};

// Bookings
export const bookings = {
  getAll: (params?: Record<string, string | undefined>) => {
    const qs = params && Object.keys(params).length > 0
      ? '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1]) && entry[1] !== 'all'))
        ).toString()
      : '';
    return api.get<any[]>(`/bookings${qs}`);
  },
  getOne: (id: number) => api.get<any>(`/bookings/${id}`),
  getById: (id: number) => api.get<any>(`/bookings/${id}`),
  getTimeline: () => api.get<any[]>('/bookings/timeline'),
  create: (data: { vehicleId: number; customerId: number; startDate: string; endDate: string; notes?: string }) =>
    api.post<any>('/bookings', data),
};

// Customers
export const customers = {
  getAll: (params?: Record<string, string | undefined>) => {
    const qs = params && Object.keys(params).length > 0
      ? '?' + new URLSearchParams(
          Object.fromEntries(Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])))
        ).toString()
      : '';
    return api.get<any[]>(`/customers${qs}`);
  },
  getOne: (id: number) => api.get<any>(`/customers/${id}`),
  getById: (id: number) => api.get<any>(`/customers/${id}`),
};

// Availability
export const availability = {
  check: (vehicleId: number, startDate: string, endDate: string) =>
    api.get<any>(`/availability/check?vehicleId=${vehicleId}&startDate=${startDate}&endDate=${endDate}`),
};

// Categories
export const categoriesApi = {
  getAll: () => api.get<any[]>('/categories'),
};

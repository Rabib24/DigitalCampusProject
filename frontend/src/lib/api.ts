import { getAuthToken } from '@/lib/auth';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create an authenticated fetch wrapper
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  return fetch(`${API_BASE_URL}${url}`, config);
};

// Helper functions for common HTTP methods
export const apiGet = (url: string, options?: RequestInit) => {
  return authenticatedFetch(url, {
    method: 'GET',
    ...options,
  });
};

export const apiPost = <T>(url: string, data: T, options?: RequestInit) => {
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

export const apiPut = <T>(url: string, data: T, options?: RequestInit) => {
  return authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

export const apiDelete = (url: string, options?: RequestInit) => {
  return authenticatedFetch(url, {
    method: 'DELETE',
    ...options,
  });
};
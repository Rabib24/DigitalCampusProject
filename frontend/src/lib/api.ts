import { getAuthToken } from '@/lib/auth';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create an authenticated fetch wrapper
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  console.log(`Making authenticated request to ${url}`, { token: token ? 'present' : 'missing' });
  
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
  
  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    console.log(`Fetching ${fullUrl} with config:`, config);
    const response = await fetch(fullUrl, config);
    console.log(`Received response from ${fullUrl}:`, response.status, response.statusText);
    return response;
  } catch (error) {
    console.error(`Network error when fetching ${url}:`, error);
    // Re-throw network errors with more context
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to the server. Please check your connection and try again.');
    }
    throw error;
  }
};

// Helper functions for common HTTP methods
export const apiGet = (url: string, options?: RequestInit) => {
  console.log(`Making GET request to ${url}`);
  return authenticatedFetch(url, {
    method: 'GET',
    ...options,
  });
};

export const apiPost = <T>(url: string, data: T, options?: RequestInit) => {
  console.log(`Making POST request to ${url} with data:`, data);
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

export const apiPut = <T>(url: string, data: T, options?: RequestInit) => {
  console.log(`Making PUT request to ${url} with data:`, data);
  return authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

export const apiDelete = (url: string, options?: RequestInit) => {
  console.log(`Making DELETE request to ${url}`);
  return authenticatedFetch(url, {
    method: 'DELETE',
    ...options,
  });
};
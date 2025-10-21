import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Function to handle logout when token expires
function handleTokenExpired() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  // Reload the page to trigger re-authentication
  window.location.reload();
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Handle token expiration or invalid token
    if (res.status === 401 || res.status === 403) {
      handleTokenExpired();
      throw new Error('Token expirado ou inválido');
    }
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Add JWT token if available
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: Record<string, string> = {};
    
    // Add JWT token if available
    const token = localStorage.getItem('admin_token');
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(queryKey.join("/") as string, {
      headers,
      credentials: "include",
    });

    if (res.status === 401 || res.status === 403) {
      if (unauthorizedBehavior === "returnNull") {
        return null;
      } else {
        handleTokenExpired();
        return null; // Return null to prevent further processing
      }
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

/**
 * Baseline HTTP API client for Krishiva platform.
 * Supports authentication token headers and offline graceful fallback.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("krishiva_token");
    }
    return null;
  }

  private setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("krishiva_token", token);
    }
  }

  private getRole(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("krishiva_role");
    }
    return null;
  }

  private setRole(role: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("krishiva_role", role);
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    // Check network connectivity status
    if (typeof window !== "undefined" && !navigator.onLine) {
      logger.warning("Device is offline. Triggering local storage cache load.");
      const cached = localStorage.getItem(`cache_${endpoint}`);
      if (cached) {
        return JSON.parse(cached) as T;
      }
      throw new Error("You are currently offline and no cached details exist for this page.");
    }

    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    
    if (typeof window !== "undefined") {
      const selectedLang = localStorage.getItem("krishiva_language") || "en";
      headers.set("Accept-Language", selectedLang);
    }
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (!(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    // Build URL query parameters
    let url = `${BASE_URL}${endpoint}`;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, val]) => {
        searchParams.append(key, val);
      });
      url += `?${searchParams.toString()}`;
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token expired or unauthorized, clear storage
        if (typeof window !== "undefined") {
          localStorage.removeItem("krishiva_token");
          localStorage.removeItem("krishiva_role");
        }
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.detail || "HTTP API Request failed.");
      }

      const responseData = await response.json();
      
      // Cache successful GET requests for offline capabilities
      if (options.method === "GET" || !options.method) {
        localStorage.setItem(`cache_${endpoint}`, JSON.stringify(responseData));
      }

      return responseData as T;
    } catch (e: any) {
      console.error(`API Call failed on endpoint ${endpoint}:`, e);
      throw e;
    }
  }

  // Helper bindings
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const isForm = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: "POST",
      body: isForm ? body : JSON.stringify(body)
    });
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body)
    });
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

const logger = {
  warning: (msg: string) => console.warn(`[ApiClient] ${msg}`),
  error: (msg: string) => console.error(`[ApiClient] ${msg}`)
};

export const apiClient = new ApiClient();
export default apiClient;

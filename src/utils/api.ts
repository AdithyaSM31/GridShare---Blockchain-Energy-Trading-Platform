const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('gridshare_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `Request failed with status ${response.status}` 
      }));
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  }

  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error: any) {
      console.error('API GET Error:', error);
      throw new Error(error.message || 'Network error');
    }
  }

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (error: any) {
      console.error('API POST Error:', error);
      throw new Error(error.message || 'Network error');
    }
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const api = new ApiClient();

import api from '../utils/api';

export interface LoginData {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    is_staff: boolean;
    is_admin: boolean;
  };
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_admin: boolean;
}

class AuthService {
  // Login function
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('auth/login/', credentials);
      
      // Store tokens and user data
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        const errorMessage = error.response.data?.error || 'Invalid credentials';
        throw new Error(errorMessage);
      }
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.error || 'Invalid request data';
        throw new Error(errorMessage);
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  // Signup function
  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      const response = await api.post('auth/signup/', userData);
      
      // Store tokens and user data
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.error || 'Invalid signup data';
        throw new Error(errorMessage);
      }
      throw new Error('Signup failed. Please try again.');
    }
  }

  // Logout function
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      // Verify token with backend
      const response = await api.get('user/profile/');
      return response.status === 200;
    } catch (error) {
      // If API call fails, token might be invalid
      this.logout();
      return false;
    }
  }

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    try {
      const response = await api.get('user/profile/');
      return response.data.is_admin || false;
    } catch (error) {
      return false;
    }
  }

  // Refresh token function
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return null;
      }

      const response = await api.post('auth/refresh/', {
        refresh: refreshToken
      });

      const newAccessToken = response.data.access;
      localStorage.setItem('token', newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      // If refresh fails, logout the user
      this.logout();
      return null;
    }
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default new AuthService(); 
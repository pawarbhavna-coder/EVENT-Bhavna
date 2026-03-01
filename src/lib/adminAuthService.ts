// Simplified Admin Auth Service - No Backend Implementation
// This service now provides mock authentication for UI demonstration

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin';
  permissions: string[];
  last_login: string;
  created_at: string;
}

export interface AuthResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
  method?: 'bypass' | 'standard';
}

export interface SecurityLog {
  id: string;
  email: string;
  action: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'access_denied';
  method: 'bypass' | 'standard';
  ip_address: string;
  user_agent: string;
  timestamp: string;
  additional_info?: Record<string, any>;
}

class AdminAuthService {
  private static instance: AdminAuthService;

  static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  /**
   * Mock authentication - always returns success for demo
   */
  async authenticate(email: string, password: string): Promise<AuthResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: AdminUser = {
      id: 'admin_1',
      email: email,
      full_name: 'Admin User',
      role: 'admin',
      permissions: ['*'],
      last_login: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z'
    };

    return { 
      success: true, 
      user: mockUser, 
      method: 'standard' 
    };
  }

  /**
   * Mock session validation
   */
  async validateSession(): Promise<{ valid: boolean; user?: AdminUser; error?: string }> {
    // For demo purposes, always return valid session
    const mockUser: AdminUser = {
      id: 'admin_1',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'admin',
      permissions: ['*'],
      last_login: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z'
    };

    return { valid: true, user: mockUser };
  }

  /**
   * Mock logout
   */
  async logout(): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  /**
   * Mock security logs
   */
  getSecurityLogs(): SecurityLog[] {
    return [
      {
        id: 'log_1',
        email: 'admin@example.com',
        action: 'login_success',
        method: 'standard',
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        additional_info: { success: true }
      }
    ];
  }

  /**
   * Mock clear old logs
   */
  clearOldLogs(daysToKeep: number = 30): void {
    console.log(`Would clear logs older than ${daysToKeep} days`);
  }

  /**
   * Mock permission check
   */
  hasPermission(user: AdminUser, permission: string): boolean {
    return user.permissions.includes('*') || user.permissions.includes(permission);
  }

  /**
   * Mock get current user
   */
  getCurrentUser(): AdminUser | null {
    return {
      id: 'admin_1',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'admin',
      permissions: ['*'],
      last_login: new Date().toISOString(),
      created_at: '2024-01-01T00:00:00Z'
    };
  }
}

export const adminAuthService = AdminAuthService.getInstance();
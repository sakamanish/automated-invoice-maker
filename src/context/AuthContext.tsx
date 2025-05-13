
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  isEmployee: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // For demo purposes, we'll use localStorage to simulate an auth system
  // This should be replaced with Supabase Auth when integrated
  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Demo admin credentials (in production, this should be handled securely via Supabase)
      if (email === 'admin@example.com' && password === 'admin123') {
        const adminUser: User = {
          id: '1',
          email: 'admin@example.com',
          role: 'admin',
          created_at: new Date().toISOString(),
        };
        
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        toast({
          title: "Login successful",
          description: "Welcome back, Admin!",
        });
        navigate('/admin/dashboard');
        return;
      }
      
      // Demo employee login (in production, this should be handled by Supabase Auth)
      const storedEmployees = localStorage.getItem('employees');
      const employees = storedEmployees ? JSON.parse(storedEmployees) : [];
      
      const employee = employees.find((emp: User) => 
        emp.email === email && password === 'password123'
      );
      
      if (employee) {
        localStorage.setItem('user', JSON.stringify(employee));
        setUser(employee);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/employee/dashboard');
        return;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You've been logged out successfully",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      isAdmin: user?.role === 'admin',
      isEmployee: user?.role === 'employee',
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

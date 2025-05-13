
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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

  // Check for existing session and set up auth state listener
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              created_at: userData.created_at
            });
          } else if (error) {
            console.error('Error fetching user data:', error);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlocks
          setTimeout(async () => {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (userData) {
              setUser({
                id: userData.id,
                email: userData.email,
                role: userData.role,
                created_at: userData.created_at
              });
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For admin login with hardcoded credentials
      if (email === 'admin@gmail.com' && password === 'Alliswell') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          // If the admin user doesn't exist in Supabase yet, create it
          if (error.message.includes('Invalid login credentials')) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  role: 'admin'
                }
              }
            });
            
            if (signUpError) {
              throw signUpError;
            }
            
            // Now sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (signInError) throw signInError;
            
            // Manually insert into users table since the trigger might not catch it immediately
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: signUpData.user?.id,
                email: email,
                role: 'admin'
              });
              
            if (insertError) {
              console.error('Error creating admin user record:', insertError);
            }
          } else {
            throw error;
          }
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back, Admin!",
        });
        
        navigate('/admin/dashboard');
        return;
      }
      
      // Regular user login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigation will happen after auth state change sets the user
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
      await supabase.auth.signOut();
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

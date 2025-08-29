import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import apiService from '../services/api';
import { supabase } from '../src/config/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check for Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Handle Supabase OAuth user
          await handleSupabaseUser(session.user, session.access_token);
        } else {
          // Fallback to JWT token check for regular login
          const token = localStorage.getItem('auth_token');
          const userData = localStorage.getItem('user_data');
          
          if (token && userData) {
            try {
              // First restore user from localStorage immediately
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              apiService.setAuthToken(token);
              console.log('User restored from localStorage:', parsedUser);
              
              // Then validate token with server in background
              try {
                const response = await apiService.getCurrentUser();
                if (response.data) {
                  // Update user data if server returned updated info
                  setUser(response.data);
                  localStorage.setItem('user_data', JSON.stringify(response.data));
                  console.log('User data updated from server');
                }
              } catch (serverError) {
                console.log('Server validation failed, keeping cached user data:', serverError);
                // Keep using cached data even if server is down
              }
            } catch (parseError) {
              console.error('Failed to parse cached user data:', parseError);
              // If cached data is corrupted, clear everything
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              apiService.setAuthToken(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await handleSupabaseUser(session.user, session.access_token);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('auth_token');
        apiService.setAuthToken(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSupabaseUser = async (supabaseUser: any, accessToken: string) => {
    try {
      console.log('Handling Supabase user:', supabaseUser);
      
      // Check if user exists in our database
      let { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('email', supabaseUser.email)
        .single();

      console.log('Existing user query result:', { existingUser, selectError });

      // If user doesn't exist, create them
      if (!existingUser) {
        console.log('Creating new OAuth user...');
        
        const userData = {
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
          email: supabaseUser.email,
          password: null, // OAuth users don't have passwords
          avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.user_metadata?.full_name || supabaseUser.email)}&background=6366f1&color=fff`,
          is_verified: true, // OAuth users are automatically verified
          is_admin: false,
          oauth_provider: 'google',
          oauth_id: supabaseUser.id
        };

        console.log('User data to insert:', userData);

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([userData])
          .select()
          .single();

        console.log('User creation result:', { newUser, createError });

        if (createError) {
          console.error('Error creating OAuth user:', createError);
          // Try to handle the case where password is still required
          if (createError.message?.includes('password')) {
            console.log('Retrying with empty password string...');
            const retryData = { ...userData, password: '' };
            const { data: retryUser, error: retryError } = await supabase
              .from('users')
              .insert([retryData])
              .select()
              .single();
            
            if (retryError) {
              console.error('Retry failed:', retryError);
              return;
            }
            existingUser = retryUser;
          } else {
            return;
          }
        } else {
          existingUser = newUser;
        }
      }

      console.log('Final user data:', existingUser);

      // Set user in context
      setUser({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        avatarUrl: existingUser.avatar_url,
        isVerified: existingUser.is_verified,
        isAdmin: existingUser.is_admin
      });

      // Store access token and user data for persistence
      localStorage.setItem('supabase_token', accessToken);
      localStorage.setItem('user_data', JSON.stringify({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        avatarUrl: existingUser.avatar_url,
        isVerified: existingUser.is_verified,
        isAdmin: existingUser.is_admin
      }));
      
      console.log('User successfully set in context');
    } catch (error) {
      console.error('Error handling Supabase user:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.data && (response.data as any).token && (response.data as any).user) {
        // Store token and user data
        localStorage.setItem('auth_token', (response.data as any).token);
        localStorage.setItem('user_data', JSON.stringify((response.data as any).user));
        apiService.setAuthToken((response.data as any).token);
        
        // Set user
        setUser((response.data as any).user);
        
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google login error:', error);
        return { 
          success: false, 
          message: error.message || 'Google login failed. Please try again.' 
        };
      }

      return { success: true, message: 'Redirecting to Google...' };
    } catch (error: any) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        message: 'Google login failed. Please try again.' 
      };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.register(email, password, name);
      
      if (response.data && (response.data as any).token && (response.data as any).user) {
        // Store token and user data
        localStorage.setItem('auth_token', (response.data as any).token);
        localStorage.setItem('user_data', JSON.stringify((response.data as any).user));
        apiService.setAuthToken((response.data as any).token);
        
        // Set user
        setUser((response.data as any).user);
        
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    // Sign out from Supabase (for OAuth users)
    await supabase.auth.signOut();
    
    // Clear all authentication data from local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('supabase_token');
    localStorage.removeItem('user_data');
    apiService.setAuthToken(null);
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await apiService.updateUser(user.id, userData);
      if (response.data) {
        const updatedUser = { ...user, ...(response.data as any) };
        setUser(updatedUser);
        // Update stored user data
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update user:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
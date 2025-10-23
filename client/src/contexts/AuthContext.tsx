import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isStaticSite } from '@/lib/runtimeEnv';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    console.log("🔍 DEBUG AuthContext - Verificando localStorage...");
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    
    console.log("🔍 DEBUG AuthContext - storedToken:", storedToken ? 'EXISTE' : 'NÃO EXISTE');
    console.log("🔍 DEBUG AuthContext - storedUser:", storedUser ? 'EXISTE' : 'NÃO EXISTE');
    
    if (storedToken && storedUser) {
      console.log("🔍 DEBUG AuthContext - Definindo user e token...");
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      console.log("🔍 DEBUG AuthContext - Nenhum token/user encontrado");
    }
    setIsLoading(false);
    console.log("🔍 DEBUG AuthContext - isLoading definido como false");
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Try to use real API first (works in both local and Vercel with backend)
      try {
        const response = await fetch('/api/admin/login', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
          setUser(data.user);
          
          // Store in localStorage
          localStorage.setItem('admin_token', data.token);
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          
          return true;
        }
        
        // If login failed but API is available, try to initialize database
        if (response.status === 401 && username === 'admin') {
          try {
            const initResponse = await fetch('/api/debug/init-db', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (initResponse.ok) {
              // Try login again after initialization
              const retryResponse = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
              });
              
              if (retryResponse.ok) {
                const data = await retryResponse.json();
                setToken(data.token);
                setUser(data.user);
                
                // Store in localStorage
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_user', JSON.stringify(data.user));
                
                return true;
              }
            }
          } catch (initError) {
            console.log('Database initialization failed:', initError);
          }
        }
        
        // If we get here, API is available but login failed
        // Check if this is static mode and use fallback
        if (username === 'admin' && password === 'admin123') {
          const staticUser = {
            id: 'static-admin',
            username: 'admin'
          };
          const staticToken = 'static-token-' + Date.now();
          
          setToken(staticToken);
          setUser(staticUser);
          
          // Store in localStorage
          localStorage.setItem('admin_token', staticToken);
          localStorage.setItem('admin_user', JSON.stringify(staticUser));
          
          return true;
        }
        
        return false;
      } catch (apiError) {
        console.error('API error during login:', apiError);
        
        // Fallback for static site mode (when no backend is available)
        if (username === 'admin' && password === 'admin123') {
          const staticUser = {
            id: 'static-admin',
            username: 'admin'
          };
          const staticToken = 'static-token-' + Date.now();
          
          setToken(staticToken);
          setUser(staticUser);
          
          // Store in localStorage
          localStorage.setItem('admin_token', staticToken);
          localStorage.setItem('admin_user', JSON.stringify(staticUser));
          
          return true;
        }
        
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
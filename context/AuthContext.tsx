import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string, email: string, metadata: any) => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

        if (!mounted) return;

        if (data) {
          // Normalize role
          const rawRole = data.role || 'CUSTOMER';
          const roleString = String(rawRole).trim().toUpperCase();
          const finalRole = (roleString === 'ADMIN' ? UserRole.ADMIN : UserRole.CUSTOMER);

          const user: User = {
            id: userId,
            email: email,
            name: data.name,
            role: finalRole,
            isBlocked: data.is_blocked
          };

          setState({ user, isAuthenticated: true, isLoading: false });
        } else {
          // Profile doesn't exist in 'profiles' table yet (race condition), use metadata
          const user: User = {
            id: userId,
            email: email,
            name: metadata?.name || email.split('@')[0],
            role: UserRole.CUSTOMER,
            isBlocked: false
          };
          setState({ user, isAuthenticated: true, isLoading: false });
        }
      } catch (e) {
        console.error("Error fetching profile", e);
        if (mounted) setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    const initializeAuth = async () => {
      try {
        // 1. Check for existing session immediately
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session && session.user) {
          await fetchProfile(session.user.id, session.user.email!, session.user.user_metadata);
        } else {
          if (mounted) setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error: any) {
        // Suppress abort errors that happen frequently in development/strict mode
        if (error.message && (error.message.includes('aborted') || error.name === 'AbortError')) {
           return;
        }
        console.error("Auth initialization error:", error);
        if (mounted) setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Force refresh profile on sign in
        await fetchProfile(session.user.id, session.user.email!, session.user.user_metadata);
      } else if (event === 'SIGNED_OUT') {
        if (mounted) setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (user: User) => {
    setState({ user, isAuthenticated: true, isLoading: false });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
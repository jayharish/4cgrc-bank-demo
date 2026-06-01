import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseAuth } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId, authUser) => {
    // supabase (service key) bypasses RLS — no infinite recursion possible
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.warn('Profile fetch error:', error.message);
      if (authUser) {
        const role = authUser.app_metadata?.role || 'viewer';
        setProfile({ id: authUser.id, email: authUser.email, full_name: authUser.user_metadata?.full_name || '', role, is_active: true });
      }
      return;
    }
    const role = authUser?.app_metadata?.role || data.role || 'viewer';
    setProfile({ ...data, role });
  };

  useEffect(() => {
    // Auth state comes from supabaseAuth (anon key, persists session in localStorage)
    supabaseAuth.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id, session.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id, session.user);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);
    return data;
  };

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabaseAuth.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabaseAuth.auth.signOut();
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
    if (error) throw error;
    setProfile(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

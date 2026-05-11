// ═══════════════════════════════════════════════════════════════
// AuthProvider — wraps the app, exposes session/profile/loading
// and a signOut() helper. No-ops gracefully when Supabase is not
// configured (lets the preview build keep working).
// ═══════════════════════════════════════════════════════════════

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../utils/supabase.js";
import { signOut as signOutImpl } from "../utils/auth.js";

const AuthContext = createContext({
  configured: false,
  loading: true,
  session: null,
  user: null,
  profile: null,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, email, invited_by, invite_code_used, created_at")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data || null);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let unsub = () => {};

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setLoading(false);
      if (data.session?.user?.id) refreshProfile(data.session.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      if (nextSession?.user?.id) {
        refreshProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    unsub = () => sub.subscription.unsubscribe();
    return unsub;
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    try {
      await signOutImpl();
    } finally {
      setSession(null);
      setProfile(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        configured: isSupabaseConfigured,
        loading,
        session,
        user: session?.user || null,
        profile,
        refreshProfile: () => refreshProfile(session?.user?.id),
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

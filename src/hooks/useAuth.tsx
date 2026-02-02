import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

type UserRole = "worker" | "agency" | "admin";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  emailVerified: boolean;
  signUp: (
    email: string,
    password: string,
    role: UserRole,
    profileData: WorkerProfileData | AgencyProfileData
  ) => Promise<{ error: Error | null; needsVerification: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; needsVerification: boolean }>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<{ error: Error | null }>;
}

interface WorkerProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  primarySkill: string;
}

interface AgencyProfileData {
  companyName: string;
  contactPerson: string;
  position: string;
  phone: string;
  country: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  const checkUserRole = async (userId: string) => {
    try {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      
      return roleData?.role as UserRole | null;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener BEFORE getting initial session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setEmailVerified(!!currentSession?.user?.email_confirmed_at);

        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlocks with Supabase
          setTimeout(async () => {
            if (!isMounted) return;
            const userRole = await checkUserRole(currentSession.user.id);
            if (isMounted) setRole(userRole);
          }, 0);
        } else {
          setRole(null);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setEmailVerified(!!initialSession?.user?.email_confirmed_at);

        if (initialSession?.user) {
          const userRole = await checkUserRole(initialSession.user.id);
          if (isMounted) setRole(userRole);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userRole: UserRole,
    profileData: WorkerProfileData | AgencyProfileData
  ): Promise<{ error: Error | null; needsVerification: boolean }> => {
    try {
      // Sign up the user with email redirect
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login/${userRole}`,
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("User creation failed");

      const userId = authData.user.id;

      // Create base profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        email,
        full_name: userRole === "worker" 
          ? `${(profileData as WorkerProfileData).firstName} ${(profileData as WorkerProfileData).lastName}`
          : (profileData as AgencyProfileData).contactPerson,
        phone: profileData.phone,
      });

      if (profileError) throw profileError;

      // Create user role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: userRole,
      });

      if (roleError) throw roleError;

      // Create role-specific profile
      if (userRole === "worker") {
        const workerData = profileData as WorkerProfileData;
        const { error: workerError } = await supabase.from("worker_profiles").insert({
          user_id: userId,
          first_name: workerData.firstName,
          last_name: workerData.lastName,
          primary_skill: workerData.primarySkill,
        });
        if (workerError) throw workerError;
      } else if (userRole === "agency") {
        const agencyData = profileData as AgencyProfileData;
        const { error: agencyError } = await supabase.from("agency_profiles").insert({
          user_id: userId,
          company_name: agencyData.companyName,
          contact_person: agencyData.contactPerson,
          position: agencyData.position,
          country: agencyData.country,
          business_phone: agencyData.phone,
        });
        if (agencyError) throw agencyError;
      }

      // Check if email confirmation is required
      const needsVerification = !authData.user.email_confirmed_at;

      return { error: null, needsVerification };
    } catch (error) {
      return { error: error as Error, needsVerification: false };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null; needsVerification: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if email is verified
      const needsVerification = !data.user?.email_confirmed_at;
      
      if (needsVerification) {
        // Sign out if email not verified
        await supabase.auth.signOut();
        return { error: null, needsVerification: true };
      }

      return { error: null, needsVerification: false };
    } catch (error) {
      return { error: error as Error, needsVerification: false };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setEmailVerified(false);
  };

  const resendVerificationEmail = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login/worker`,
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session, 
        role, 
        loading, 
        emailVerified,
        signUp, 
        signIn, 
        signOut,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

type UserRole = "worker" | "agency" | "admin";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    role: UserRole,
    profileData: WorkerProfileData | AgencyProfileData
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
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

  useEffect(() => {
    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user role
          setTimeout(async () => {
            const { data: roleData } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .maybeSingle();
            
            setRole(roleData?.role as UserRole | null);
          }, 0);
        } else {
          setRole(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data: roleData }) => {
            setRole(roleData?.role as UserRole | null);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userRole: UserRole,
    profileData: WorkerProfileData | AgencyProfileData
  ) => {
    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
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

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, role, loading, signUp, signIn, signOut }}
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

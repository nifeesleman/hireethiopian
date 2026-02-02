import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { WorkersTable } from "@/components/admin/WorkersTable";
import { AgenciesTable } from "@/components/admin/AgenciesTable";
import { AdminOverview } from "@/components/admin/AdminOverview";

export type AdminView = "overview" | "workers" | "agencies";

const AdminDashboard = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AdminView>("overview");

  // Redirect is now handled by ProtectedRoute

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const renderContent = () => {
    switch (currentView) {
      case "workers":
        return <WorkersTable />;
      case "agencies":
        return <AgenciesTable />;
      default:
        return <AdminOverview onNavigate={setCurrentView} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 flex flex-col">
          <AdminHeader onSignOut={handleSignOut} />
          <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;

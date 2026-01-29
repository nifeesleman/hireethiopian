import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, CheckCircle, Clock, ArrowRight } from "lucide-react";
import type { AdminView } from "@/pages/dashboard/AdminDashboard";

interface AdminOverviewProps {
  onNavigate: (view: AdminView) => void;
}

interface Stats {
  totalWorkers: number;
  totalAgencies: number;
  verifiedAgencies: number;
  pendingVerification: number;
}

export function AdminOverview({ onNavigate }: AdminOverviewProps) {
  const [stats, setStats] = useState<Stats>({
    totalWorkers: 0,
    totalAgencies: 0,
    verifiedAgencies: 0,
    pendingVerification: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch worker count
      const { count: workerCount } = await supabase
        .from("worker_profiles")
        .select("*", { count: "exact", head: true });

      // Fetch agency counts
      const { data: agencies } = await supabase
        .from("agency_profiles")
        .select("is_verified");

      const totalAgencies = agencies?.length || 0;
      const verifiedAgencies = agencies?.filter((a) => a.is_verified).length || 0;
      const pendingVerification = totalAgencies - verifiedAgencies;

      setStats({
        totalWorkers: workerCount || 0,
        totalAgencies,
        verifiedAgencies,
        pendingVerification,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-muted-foreground">Platform statistics and quick actions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkers}</div>
            <p className="text-xs text-muted-foreground">Registered workers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgencies}</div>
            <p className="text-xs text-muted-foreground">Registered agencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified Agencies</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verifiedAgencies}</div>
            <p className="text-xs text-muted-foreground">Approved agencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingVerification}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Workers</CardTitle>
            <CardDescription>
              View all registered workers, their profiles, and availability status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate("workers")} className="w-full">
              View Workers
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Agencies</CardTitle>
            <CardDescription>
              Review and verify agency registrations, manage agency access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate("agencies")} className="w-full">
              View Agencies
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileText, Bell, User, LogOut, MapPin, DollarSign } from "lucide-react";
import { ProfileEditDialog } from "@/components/worker/ProfileEditDialog";

interface WorkerProfile {
  first_name: string;
  last_name: string;
  primary_skill: string | null;
  availability_status: string | null;
  experience_years: number | null;
  location: string | null;
  bio: string | null;
  desired_salary_min: number | null;
  desired_salary_max: number | null;
}

const WorkerDashboard = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login/worker");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("worker_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      available: {
        label: "Available",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      employed: {
        label: "Employed",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      unavailable: {
        label: "Unavailable",
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      },
    };
    const config = statusConfig[status || "available"] || statusConfig.available;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatSkill = (skill: string | null) => {
    if (!skill) return "Not specified";
    return skill.charAt(0).toUpperCase() + skill.slice(1).replace(/_/g, " ");
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Worker Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back{profile ? `, ${profile.first_name}` : ""}! Manage your profile and applications.
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="mt-4 md:mt-0">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Profile Summary Card */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">Your Profile</CardTitle>
                <CardDescription>Your public profile information</CardDescription>
              </div>
              <Button onClick={() => setProfileDialogOpen(true)}>
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : profile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium text-foreground">
                      {profile.first_name} {profile.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Primary Skill</p>
                    <p className="font-medium text-foreground">{formatSkill(profile.primary_skill)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    {getStatusBadge(profile.availability_status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Experience</p>
                    <p className="font-medium text-foreground">
                      {profile.experience_years
                        ? `${profile.experience_years} year${profile.experience_years > 1 ? "s" : ""}`
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium text-foreground">{profile.location || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Salary Expectation</p>
                      <p className="font-medium text-foreground">
                        {formatSalary(profile.desired_salary_min, profile.desired_salary_max)}
                      </p>
                    </div>
                  </div>
                  {profile.bio && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Bio</p>
                      <p className="font-medium text-foreground">{profile.bio}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Unable to load profile data.</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Active applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Uploaded documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Unread messages</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Browse Jobs</CardTitle>
                <CardDescription>
                  Explore available job opportunities from verified agencies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => navigate("/jobs")}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Find Jobs
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Upload your CV, certificates, and other required documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Documents
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Edit Dialog */}
      <ProfileEditDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        onProfileUpdated={fetchProfile}
      />
    </Layout>
  );
};

export default WorkerDashboard;

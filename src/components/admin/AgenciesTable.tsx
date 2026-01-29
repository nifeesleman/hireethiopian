import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Eye, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface AgencyProfile {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  position: string | null;
  country: string;
  business_email: string | null;
  business_phone: string | null;
  website: string | null;
  is_verified: boolean | null;
  created_at: string;
}

export function AgenciesTable() {
  const [agencies, setAgencies] = useState<AgencyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<AgencyProfile | null>(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [agencyToVerify, setAgencyToVerify] = useState<{ agency: AgencyProfile; action: "verify" | "revoke" } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const { data, error } = await supabase
        .from("agency_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAgencies(data || []);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async () => {
    if (!agencyToVerify) return;

    try {
      const newStatus = agencyToVerify.action === "verify";
      const { error } = await supabase
        .from("agency_profiles")
        .update({ is_verified: newStatus })
        .eq("id", agencyToVerify.agency.id);

      if (error) throw error;

      toast({
        title: newStatus ? "Agency Verified" : "Verification Revoked",
        description: `${agencyToVerify.agency.company_name} has been ${newStatus ? "verified" : "unverified"}.`,
      });

      // Update local state
      setAgencies((prev) =>
        prev.map((a) =>
          a.id === agencyToVerify.agency.id ? { ...a, is_verified: newStatus } : a
        )
      );
    } catch (error) {
      console.error("Error updating verification:", error);
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    } finally {
      setVerifyDialogOpen(false);
      setAgencyToVerify(null);
    }
  };

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCountry = (country: string) => {
    const countryMap: Record<string, string> = {
      uae: "United Arab Emirates",
      saudi: "Saudi Arabia",
      qatar: "Qatar",
      kuwait: "Kuwait",
      bahrain: "Bahrain",
      oman: "Oman",
      jordan: "Jordan",
      lebanon: "Lebanon",
    };
    return countryMap[country] || country;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Agencies</h2>
          <p className="text-muted-foreground">
            Manage and verify registered agencies
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No agencies found matching your search" : "No agencies registered yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell className="font-medium">{agency.company_name}</TableCell>
                    <TableCell>{agency.contact_person}</TableCell>
                    <TableCell>{formatCountry(agency.country)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          agency.is_verified
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                        }
                      >
                        {agency.is_verified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(agency.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border border-border">
                          <DropdownMenuItem onClick={() => setSelectedAgency(agency)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {agency.is_verified ? (
                            <DropdownMenuItem
                              onClick={() => {
                                setAgencyToVerify({ agency, action: "revoke" });
                                setVerifyDialogOpen(true);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Revoke Verification
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                setAgencyToVerify({ agency, action: "verify" });
                                setVerifyDialogOpen(true);
                              }}
                              className="text-green-600 focus:text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify Agency
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agency Details Dialog */}
      <Dialog open={!!selectedAgency} onOpenChange={() => setSelectedAgency(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agency Details</DialogTitle>
            <DialogDescription>
              View complete information about this agency
            </DialogDescription>
          </DialogHeader>
          {selectedAgency && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{selectedAgency.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      selectedAgency.is_verified
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                    }
                  >
                    {selectedAgency.is_verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{selectedAgency.contact_person}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{selectedAgency.position || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{formatCountry(selectedAgency.country)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Email</p>
                  <p className="font-medium">{selectedAgency.business_email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Phone</p>
                  <p className="font-medium">{selectedAgency.business_phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="font-medium">{selectedAgency.website || "Not provided"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {new Date(selectedAgency.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verification Confirmation Dialog */}
      <AlertDialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {agencyToVerify?.action === "verify" ? "Verify Agency" : "Revoke Verification"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {agencyToVerify?.action === "verify"
                ? `Are you sure you want to verify ${agencyToVerify?.agency.company_name}? This will give them full access to the platform.`
                : `Are you sure you want to revoke verification for ${agencyToVerify?.agency.company_name}? This will limit their platform access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVerificationAction}
              className={agencyToVerify?.action === "revoke" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {agencyToVerify?.action === "verify" ? "Verify" : "Revoke"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

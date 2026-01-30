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
import { Search, Eye, MoreHorizontal, Trash2 } from "lucide-react";
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

interface WorkerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  primary_skill: string | null;
  availability_status: string | null;
  experience_years: number | null;
  location: string | null;
  created_at: string;
}

export function WorkersTable() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<WorkerProfile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const { data, error } = await supabase
        .from("worker_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorkers(data || []);
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorker = async () => {
    if (!workerToDelete) return;

    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await supabase.functions.invoke("delete-user", {
        body: { userId: workerToDelete.user_id },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to delete user");
      }

      toast({
        title: "Worker Deleted",
        description: `${workerToDelete.first_name} ${workerToDelete.last_name} has been removed from the platform.`,
      });

      // Remove from local state
      setWorkers((prev) => prev.filter((w) => w.id !== workerToDelete.id));
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete worker.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setWorkerToDelete(null);
    }
  };

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.primary_skill?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string | null) => {
    const statusColors: Record<string, string> = {
      available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      employed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      unavailable: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return statusColors[status || "available"] || statusColors.available;
  };

  const formatSkill = (skill: string | null) => {
    if (!skill) return "Not specified";
    return skill.charAt(0).toUpperCase() + skill.slice(1).replace(/_/g, " ");
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
          <h2 className="text-2xl font-bold text-foreground">Workers</h2>
          <p className="text-muted-foreground">
            Manage all registered workers on the platform
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
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
                <TableHead>Name</TableHead>
                <TableHead>Primary Skill</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No workers found matching your search" : "No workers registered yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">
                      {worker.first_name} {worker.last_name}
                    </TableCell>
                    <TableCell>{formatSkill(worker.primary_skill)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(worker.availability_status)}>
                        {worker.availability_status || "Available"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {worker.experience_years
                        ? `${worker.experience_years} year${worker.experience_years > 1 ? "s" : ""}`
                        : "Not specified"}
                    </TableCell>
                    <TableCell>{worker.location || "Not specified"}</TableCell>
                    <TableCell>
                      {new Date(worker.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border border-border">
                          <DropdownMenuItem onClick={() => setSelectedWorker(worker)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setWorkerToDelete(worker);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Worker
                          </DropdownMenuItem>
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

      {/* Worker Details Dialog */}
      <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Worker Details</DialogTitle>
            <DialogDescription>
              View complete information about this worker
            </DialogDescription>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    {selectedWorker.first_name} {selectedWorker.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Primary Skill</p>
                  <p className="font-medium">{formatSkill(selectedWorker.primary_skill)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusBadge(selectedWorker.availability_status)}>
                    {selectedWorker.availability_status || "Available"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">
                    {selectedWorker.experience_years
                      ? `${selectedWorker.experience_years} years`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedWorker.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {new Date(selectedWorker.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Worker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {workerToDelete?.first_name} {workerToDelete?.last_name}? 
              This action cannot be undone and will permanently remove their account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorker}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

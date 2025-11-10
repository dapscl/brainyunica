import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, MessageSquare, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Approval {
  id: string;
  reviewer_id: string;
  assigned_by: string | null;
  status: string;
  comments: string | null;
  reviewed_at: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

interface OrgMember {
  user_id: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

interface ApprovalWorkflowProps {
  contentId: string;
  organizationId: string;
}

export const ApprovalWorkflow = ({ contentId, organizationId }: ApprovalWorkflowProps) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    loadApprovals();
    loadOrgMembers();
    getCurrentUser();
  }, [contentId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const loadApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from("content_approvals")
        .select(`
          *,
          profiles:reviewer_id (
            full_name,
            email
          )
        `)
        .eq("content_id", contentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApprovals(data as any || []);
    } catch (error) {
      console.error("Error loading approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrgMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("organization_members")
        .select(`
          user_id,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq("organization_id", organizationId);

      if (error) throw error;
      setOrgMembers(data as any || []);
    } catch (error) {
      console.error("Error loading org members:", error);
    }
  };

  const assignReviewer = async () => {
    if (!selectedReviewer) {
      toast.error("Selecciona un revisor");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("content_approvals")
        .insert({
          content_id: contentId,
          reviewer_id: selectedReviewer,
          assigned_by: user.id,
          status: "pending",
        });

      if (error) throw error;

      // Send notification to reviewer
      await supabase.rpc("send_notification", {
        p_user_id: selectedReviewer,
        p_title: "Nueva solicitud de aprobación",
        p_message: "Se te ha asignado contenido para revisar",
        p_type: "info",
        p_entity_type: "content_items",
        p_entity_id: contentId,
      });

      toast.success("Revisor asignado exitosamente");
      setAssignDialogOpen(false);
      setSelectedReviewer("");
      loadApprovals();
    } catch (error) {
      console.error("Error assigning reviewer:", error);
      toast.error("Error al asignar revisor");
    }
  };

  const updateApprovalStatus = async (approvalId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("content_approvals")
        .update({
          status: newStatus,
          comments: reviewComment,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", approvalId);

      if (error) throw error;

      toast.success(`Contenido ${newStatus === "approved" ? "aprobado" : "rechazado"}`);
      setReviewComment("");
      loadApprovals();
    } catch (error) {
      console.error("Error updating approval:", error);
      toast.error("Error al actualizar estado");
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: "bg-yellow-500", icon: Clock, label: "Pendiente" },
      in_review: { color: "bg-blue-500", icon: Clock, label: "En Revisión" },
      approved: { color: "bg-green-500", icon: CheckCircle, label: "Aprobado" },
      rejected: { color: "bg-red-500", icon: XCircle, label: "Rechazado" },
      changes_requested: { color: "bg-orange-500", icon: MessageSquare, label: "Cambios Solicitados" },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return <div>Cargando aprobaciones...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Aprobaciones</h3>
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Asignar Revisor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar Revisor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar miembro" />
                </SelectTrigger>
                <SelectContent>
                  {orgMembers.map((member) => (
                    <SelectItem key={member.user_id} value={member.user_id}>
                      {(member.profiles as any)?.full_name || (member.profiles as any)?.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={assignReviewer} className="w-full">
                Asignar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {approvals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No hay aprobaciones asignadas
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <Card key={approval.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm">
                      {(approval.profiles as any)?.full_name || (approval.profiles as any)?.email}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(approval.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(approval.status)}
                </div>
              </CardHeader>
              <CardContent>
                {approval.comments && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{approval.comments}</p>
                  </div>
                )}
                {approval.reviewer_id === currentUserId && approval.status === "pending" && (
                  <div className="space-y-3">
                    <Textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Comentarios de revisión..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateApprovalStatus(approval.id, "approved")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateApprovalStatus(approval.id, "changes_requested")}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Solicitar Cambios
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateApprovalStatus(approval.id, "rejected")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

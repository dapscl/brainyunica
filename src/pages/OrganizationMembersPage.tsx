import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import { usePermissions, type OrgRole } from "@/hooks/usePermissions";
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

interface Member {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

const OrganizationMembersPage = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { canManageMembers, loading: permissionsLoading } = usePermissions();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [canManage, setCanManage] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<OrgRole>("member");
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  useEffect(() => {
    if (orgId) {
      checkPermissions();
      loadMembers();
    }
  }, [orgId]);

  const checkPermissions = async () => {
    if (!orgId) return;
    const hasPermission = await canManageMembers(orgId);
    setCanManage(hasPermission);
  };

  const loadMembers = async () => {
    try {
      if (!orgId) return;

      const { data, error } = await supabase
        .from("organization_members")
        .select(`
          id,
          user_id,
          role,
          created_at,
          profiles (
            email,
            full_name
          )
        `)
        .eq("organization_id", orgId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMembers(data as any || []);
    } catch (error) {
      console.error("Error loading members:", error);
      toast.error("Error al cargar miembros");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      if (!orgId || !newMemberEmail) return;

      // Find user by email
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newMemberEmail)
        .single();

      if (profileError || !profiles) {
        toast.error("Usuario no encontrado");
        return;
      }

      const { error } = await supabase
        .from("organization_members")
        .insert({
          organization_id: orgId,
          user_id: profiles.id,
          role: newMemberRole,
        });

      if (error) throw error;

      toast.success("Miembro agregado exitosamente");
      setNewMemberEmail("");
      setNewMemberRole("member");
      loadMembers();
    } catch (error: any) {
      console.error("Error adding member:", error);
      if (error.code === '23505') {
        toast.error("El usuario ya es miembro de esta organización");
      } else {
        toast.error("Error al agregar miembro");
      }
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("organization_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;

      toast.success("Rol actualizado exitosamente");
      loadMembers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error al actualizar rol");
    }
  };

  const handleRemoveMember = async () => {
    try {
      if (!memberToRemove) return;

      const { error } = await supabase
        .from("organization_members")
        .delete()
        .eq("id", memberToRemove.id);

      if (error) throw error;

      toast.success("Miembro removido exitosamente");
      setMemberToRemove(null);
      loadMembers();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Error al remover miembro");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: "bg-purple-500",
      admin: "bg-blue-500",
      editor: "bg-green-500",
      viewer: "bg-gray-500",
      member: "bg-slate-500",
    };
    return colors[role] || "bg-gray-500";
  };

  if (loading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/organizations/${orgId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a organización
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Miembros del equipo</h1>
            <p className="text-muted-foreground">Gestiona los miembros y sus permisos</p>
          </div>
        </div>

        {canManage && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Agregar nuevo miembro</CardTitle>
              <CardDescription>Invita a un usuario existente por su email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Email del usuario"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="flex-1"
                />
                <Select value={newMemberRole} onValueChange={(value) => setNewMemberRole(value as OrgRole)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Miembro</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddMember} disabled={!newMemberEmail}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Miembros ({members.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {member.profiles?.full_name || member.profiles?.email}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.profiles?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {canManage ? (
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleUpdateRole(member.id, value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Miembro</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                    )}
                    {canManage && member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMemberToRemove(member)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Roles y permisos</CardTitle>
            <CardDescription>Descripción de los diferentes roles disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-purple-500 mt-1">Owner</Badge>
                <div>
                  <p className="font-medium">Propietario</p>
                  <p className="text-sm text-muted-foreground">
                    Control total de la organización. Puede eliminar la organización y gestionar todos los aspectos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 mt-1">Admin</Badge>
                <div>
                  <p className="font-medium">Administrador</p>
                  <p className="text-sm text-muted-foreground">
                    Puede gestionar miembros, crear/editar/eliminar marcas y proyectos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-green-500 mt-1">Editor</Badge>
                <div>
                  <p className="font-medium">Editor</p>
                  <p className="text-sm text-muted-foreground">
                    Puede crear y editar marcas y proyectos, pero no puede eliminarlos ni gestionar miembros.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-gray-500 mt-1">Viewer</Badge>
                <div>
                  <p className="font-medium">Visualizador</p>
                  <p className="text-sm text-muted-foreground">
                    Solo puede ver la información. No puede crear, editar ni eliminar nada.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-slate-500 mt-1">Member</Badge>
                <div>
                  <p className="font-medium">Miembro</p>
                  <p className="text-sm text-muted-foreground">
                    Rol básico con permisos limitados de visualización y edición.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esto removerá a {memberToRemove?.profiles?.email} de la organización.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveMember} className="bg-destructive">
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default OrganizationMembersPage;
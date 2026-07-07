"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Shield, User, Calendar, Plus, Edit3, Trash2, ShieldCheck } from "lucide-react";
import { usersApi, type User as UserType } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create dialog
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const [creating, setCreating] = useState(false);

  // Edit dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", email: "", password: "", role: "USER" });

  // Verification dialog
  const [openVerification, setOpenVerification] = useState(false);
  const [verificationForm, setVerificationForm] = useState({ id: "", verificationMethod: "EMAIL", verificationStatus: "PENDING", isVerified: false });
  const [savingVerification, setSavingVerification] = useState(false);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch (e) {
      console.error("Error loading users:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate() {
    if (!createForm.name || !createForm.email || !createForm.password) return;
    setCreating(true);
    try {
      await usersApi.create(createForm);
      setOpenCreate(false);
      setCreateForm({ name: "", email: "", password: "", role: "USER" });
      await loadUsers();
    } catch (e) {
      console.error("Error creating user:", e);
      alert("Error al crear usuario: " + (e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  function openEditDialog(user: UserType) {
    setEditForm({ id: user.id, name: user.name, email: user.email, password: "", role: user.role });
    setOpenEdit(true);
  }

  async function handleEdit() {
    if (!editForm.name) return;
    try {
      const data: any = { name: editForm.name, role: editForm.role };
      if (editForm.password) data.password = editForm.password;
      await usersApi.update(editForm.id, data);
      setOpenEdit(false);
      await loadUsers();
    } catch (e) {
      console.error("Error updating user:", e);
      alert("Error al actualizar usuario");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar usuario "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await usersApi.remove(id);
      setBulkIds((prev) => prev.filter((item) => item !== id));
      await loadUsers();
    } catch (e) {
      console.error("Error deleting user:", e);
      alert("Error al eliminar usuario");
    }
  }

  function openVerificationDialog(user: UserType) {
    setVerificationForm({
      id: user.id,
      verificationMethod: (user as any).verificationMethod || "EMAIL",
      verificationStatus: (user as any).verificationStatus || "PENDING",
      isVerified: !!(user as any).isVerified,
    });
    setOpenVerification(true);
  }

  async function handleSaveVerification() {
    setSavingVerification(true);
    try {
      const updated = await usersApi.updateVerification(verificationForm.id, {
        verificationMethod: verificationForm.verificationMethod,
        verificationStatus: verificationForm.verificationStatus,
        isVerified: verificationForm.isVerified,
      });
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setOpenVerification(false);
      setBulkIds((prev) => prev.filter((item) => item !== verificationForm.id));
    } catch (e) {
      console.error("Error updating verification:", e);
      alert("Error al actualizar verificación");
    } finally {
      setSavingVerification(false);
    }
  }

  async function handleBulkVerification() {
    if (bulkIds.length === 0) return;
    setSavingVerification(true);
    try {
      await Promise.all(
        bulkIds.map((id) =>
          usersApi.updateVerification(id, {
            verificationMethod: "ADMIN",
            verificationStatus: "APPROVED",
            isVerified: true,
          })
        )
      );
      await loadUsers();
      setBulkIds([]);
    } catch (e) {
      console.error("Error bulk verification:", e);
      alert("Error al actualizar verificación masiva");
    } finally {
      setSavingVerification(false);
    }
  }

  function toggleBulkId(id: string) {
    setBulkIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "Cargando..." : `${filtered.length} usuarios registrados`}
          </p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger render={<Button><Plus className="h-4 w-4 mr-2" />Nuevo Usuario</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
              <DialogDescription>Los usuarios pueden jugar o administrar el sistema</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Nombre</label>
                <Input placeholder="Nombre completo" value={createForm.name} onChange={(e) => setCreateForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <label>Email</label>
                <Input type="email" placeholder="usuario@email.com" value={createForm.email} onChange={(e) => setCreateForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <label>Contraseña</label>
                <Input type="password" placeholder="••••••••" value={createForm.password} onChange={(e) => setCreateForm(p => ({ ...p, password: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <label>Rol</label>
                <Select value={createForm.role} onValueChange={(v) => { if (v !== null) setCreateForm(p => ({ ...p, role: v })); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancelar</Button>
              <Button disabled={creating || !createForm.name || !createForm.email || !createForm.password} onClick={handleCreate}>
                {creating ? "Creando..." : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>{filtered.length} usuarios</CardDescription>
        </CardHeader>
        <CardContent>
          {bulkIds.length > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-md border p-2">
              <div className="text-sm">{bulkIds.length} seleccionados</div>
              <Button size="sm" onClick={handleBulkVerification} disabled={savingVerification}>
                {savingVerification ? "Guardando..." : "Marcar verificación masiva"}
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    {user.role === "ADMIN" ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        <Shield className="h-3 w-3 mr-1" />Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <User className="h-3 w-3 mr-1" />Usuario
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openVerificationDialog(user)}>
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleBulkId(user.id)}>
                        {bulkIds.includes(user.id) ? "✓" : "+"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id, user.name)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Modifica los datos del usuario</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Nombre</label>
              <Input value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <label>Email</label>
              <Input value={editForm.email} disabled className="bg-muted" />
            </div>
            <div className="grid gap-2">
              <label>Nueva Contraseña (dejar vacío para mantener)</label>
              <Input type="password" placeholder="••••••••" value={editForm.password} onChange={(e) => setEditForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <label>Rol</label>
              <Select value={editForm.role} onValueChange={(v) => { if (v !== null) setEditForm(p => ({ ...p, role: v })); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuario</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button disabled={!editForm.name} onClick={handleEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

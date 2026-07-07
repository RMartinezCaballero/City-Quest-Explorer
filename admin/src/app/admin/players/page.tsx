"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Search, Mail, Phone, ShieldCheck, QrCode, Plus } from "lucide-react";
import { usersApi, type UserDetail } from "@/lib/api";

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [editUser, setEditUser] = useState<UserDetail | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPhoto, setEditPhoto] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editSolo, setEditSolo] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editVerification, setEditVerification] = useState<UserDetail | null>(null);
  const [verificationMethod, setVerificationMethod] = useState("EMAIL");
  const [verificationStatus, setVerificationStatus] = useState("APPROVED");
  const [isVerified, setIsVerified] = useState(false);
  const [savingVerification, setSavingVerification] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<UserDetail | null>(null);

  useEffect(() => {
    usersApi.list()
      .then(setPlayers)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = players.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase())
  );

  function openEditUser(p: UserDetail) {
    setEditUser(p);
    setEditName(p.name || "");
    setEditEmail(p.email || "");
    setEditPhone(p.phoneNumber || "");
    setEditPhoto(p.profilePhotoUrl || "");
    setEditPassword("");
    setEditSolo(!!p.soloMode);
  }

  async function saveUser() {
    if (!editUser) return;
    setSaving(true);
    try {
      const payload: Partial<UserDetail> = {
        name: editName,
        email: editEmail,
        phoneNumber: editPhone,
        profilePhotoUrl: editPhoto,
        soloMode: editSolo,
      };
      if (editPassword.trim()) (payload as any).password = editPassword;
      const updated = await usersApi.update(editUser.id, payload);
      setPlayers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditUser(null);
    } catch (e) {
      console.error("Error updating user:", e);
    } finally {
      setSaving(false);
    }
  }

  function openVerification(p: UserDetail) {
    setEditVerification(p);
    setVerificationMethod(p.verificationMethod || "EMAIL");
    setVerificationStatus(p.verificationStatus || "PENDING");
    setIsVerified(!!p.isVerified);
  }

  async function saveVerification() {
    if (!editVerification) return;
    setSavingVerification(true);
    try {
      const updated = await usersApi.updateVerification(editVerification.id, {
        verificationMethod,
        verificationStatus,
        isVerified,
      });
      setPlayers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditVerification(null);
    } catch (e) {
      console.error("Error updating verification:", e);
    } finally {
      setSavingVerification(false);
    }
  }

  async function createUser() {
    const name = window.prompt("Nombre completo");
    const email = window.prompt("Correo electrónico");
    const password = window.prompt("Contraseña");
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      const created = await usersApi.create({ name, email, password, role: "player" });
      setPlayers((prev) => [created, ...prev]);
    } catch (e) {
      console.error("Error creating user:", e);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser() {
    if (!deleteConfirm) return;
    await usersApi.remove(deleteConfirm.id);
    setPlayers((prev) => prev.filter((item) => item.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jugadores</h1>
          <p className="text-muted-foreground mt-1">
            Registro completo, verificación, códigos únicos y estado individual/equipo.
          </p>
        </div>
        <Button onClick={createUser}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo jugador
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar jugador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{loading ? "Cargando..." : `${filtered.length} jugador${filtered.length === 1 ? "" : "es"} encontrado${filtered.length === 1 ? "" : "s"}`}</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.map((player) => (
            <div key={player.id} className="grid gap-2 py-3 border-b last:border-none md:grid-cols-[1fr_auto]">
              <div className="space-y-1">
                <div className="font-medium">{player.name || "Sin nombre"}</div>
                <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {player.email}
                  </span>
                  {player.phoneNumber ? (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {player.phoneNumber}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{player.soloMode ? "SOLO" : "TEAM"}</Badge>
                  <Badge variant="outline">{player.verificationStatus ?? "SIN VERIFICAR"}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Dialog open={editUser?.id === player.id} onOpenChange={(open) => !open && setEditUser(null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => openEditUser(player)}>Editar</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar jugador</DialogTitle>
                      <DialogDescription>Actualiza datos y modalidad.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nombre" />
                      <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" />
                      <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Celular" />
                      <Input value={editPhoto} onChange={(e) => setEditPhoto(e.target.value)} placeholder="Foto URL" />
                      <Input value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Nueva contraseña" />
                      <div className="flex items-center gap-2">
                        <Button type="button" variant={editSolo ? "default" : "outline"} onClick={() => setEditSolo(true)}>Solo</Button>
                        <Button type="button" variant={!editSolo ? "default" : "outline"} onClick={() => setEditSolo(false)}>Equipo</Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditUser(null)}>Cancelar</Button>
                      <Button onClick={saveUser} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={editVerification?.id === player.id} onOpenChange={(open) => !open && setEditVerification(null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => openVerification(player)}>
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      Verificación
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Verificación</DialogTitle>
                      <DialogDescription>Gestiona método y estado.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-2">
                        <Button type="button" variant={verificationMethod === "EMAIL" ? "default" : "outline"} onClick={() => setVerificationMethod("EMAIL")}>Email</Button>
                        <Button type="button" variant={verificationMethod === "PHONE" ? "default" : "outline"} onClick={() => setVerificationMethod("PHONE")}>Celular</Button>
                        <Button type="button" variant={verificationMethod === "ADMIN" ? "default" : "outline"} onClick={() => setVerificationMethod("ADMIN")}>Admin</Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant={verificationStatus === "PENDING" ? "default" : "outline"} onClick={() => setVerificationStatus("PENDING")}>Pendiente</Button>
                        <Button type="button" variant={verificationStatus === "APPROVED" ? "default" : "outline"} onClick={() => setVerificationStatus("APPROVED")}>Aprobado</Button>
                        <Button type="button" variant={verificationStatus === "REJECTED" ? "default" : "outline"} onClick={() => setVerificationStatus("REJECTED")}>Rechazado</Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant={isVerified ? "default" : "outline"} onClick={() => setIsVerified(true)}>Verificado</Button>
                        <Button type="button" variant={!isVerified ? "default" : "outline"} onClick={() => setIsVerified(false)}>No verificado</Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditVerification(null)}>Cancelar</Button>
                      <Button onClick={saveVerification} disabled={savingVerification}>{savingVerification ? "Guardando..." : "Guardar"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={deleteConfirm?.id === player.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(player)}>Eliminar</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Eliminar jugador</DialogTitle>
                      <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                    </DialogHeader>
                    <div className="text-sm">¿Eliminar a {player.name || player.email}?</div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
                      <Button variant="destructive" onClick={deleteUser}>Eliminar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger>
                    <Button variant="ghost" size="sm">
                      <QrCode className="h-4 w-4 mr-1" />
                      Códigos
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Jugador</DialogTitle>
                      <DialogDescription>Datos de registro, QR y modalidad.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                      <div>Nombre completo: {player.name || "—"}</div>
                      <div>Email: {player.email}</div>
                      <div>Modalidad: {player.soloMode ? "Jugador Solo" : "Equipo"}</div>
                      <div className="text-xs text-muted-foreground">QR jugador y QR equipo disponibles por backend.</div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cerrar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-6">No hay jugadores</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

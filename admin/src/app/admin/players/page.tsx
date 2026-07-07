"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Search, Mail, Phone, ShieldCheck, QrCode } from "lucide-react";
import { usersApi } from "@/lib/api";

interface Player {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  phoneNumber?: string;
  profilePhotoUrl?: string;
  verificationStatus?: string;
  soloMode?: boolean;
  teamId?: string;
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadPlayers() {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setPlayers(data);
    } catch (e) {
      console.error("Error loading players:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlayers();
  }, []);

  const filtered = players.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jugadores</h1>
          <p className="text-muted-foreground mt-1">
            Registro completo, verificación, códigos únicos y estado individual/equipo.
          </p>
        </div>
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
          <CardTitle>
            {loading ? "Cargando..." : `${filtered.length} jugador${filtered.length === 1 ? "" : "es"} encontrado${filtered.length === 1 ? "" : "s"}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.map((player) => (
            <div
              key={player.id}
              className="grid gap-2 py-3 border-b last:border-none md:grid-cols-[1fr_auto]"
            >
              <div className="space-y-1">
                <div className="font-medium">
                  {player.name || "Sin nombre"}
                </div>
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
                <div className="text-xs text-muted-foreground">
                  {player.soloMode
                    ? "El jugador continuará como individual en la ruta."
                    : "Pertenece a un equipo; la información del juego se comparte al equipo."}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {player.verificationStatus === "APPROVED" && (
                  <Badge variant="outline" className="gap-1">
                    <ShieldCheck className="h-3 w-3" /> Verificado
                  </Badge>
                )}
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
                      <DialogDescription>
                        Datos de registro, QR y modalidad del jugador.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                      <div>
                        Nombre completo: {player.name || "—"}
                      </div>
                      <div>
                        Email: {player.email}
                      </div>
                      <div>
                        Modalidad: {player.soloMode ? "Jugador Solo" : "Equipo"}
                      </div>
                      <div>
                        Redes sociales: asignadas desde el perfil del jugador.
                      </div>
                      <div className="pt-2 text-xs text-muted-foreground">
                        QR del jugador: hash único por jugador.
                      </div>
                      <div className="text-xs text-muted-foreground">
                        QR del equipo: hash único por equipo, si aplica.
                      </div>
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
            <div className="text-center text-muted-foreground py-6">
              No hay jugadores
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Mail, QrCode } from "lucide-react";
import { usersApi } from "@/lib/api";

interface Player {
  id: string;
  name: string;
  email: string;
  role: string;
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
            Consulta los datos de registro y clasificación de jugadores.
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
              className="flex items-center justify-between py-3 border-b last:border-none"
            >
              <div className="space-y-1">
                <div className="font-medium">{player.name || "Sin nombre"}</div>
                <div className="text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {player.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">{player.role}</Badge>
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
                        Información y códigos únicos del jugador.
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
                        <span className="inline-flex items-center gap-1">
                          Rol: {player.role}
                        </span>
                      </div>
                      <div className="pt-2 text-xs text-muted-foreground">
                        Aquí se generaría el QR del jugador y el QR del equipo asignado.
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

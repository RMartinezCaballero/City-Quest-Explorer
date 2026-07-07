"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Eye, CheckCircle, Play, XCircle, Clock } from "lucide-react";
import { sessionsApi, type GameSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  ABANDONED: "bg-red-50 text-red-700 border-red-200",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Activo",
  COMPLETED: "Completado",
  ABANDONED: "Abandonado",
};

export default function AdminActiveGamesPage() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GameSession | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await sessionsApi.list();
      setSessions(data);
    } catch (e) {
      console.error("Error loading active games:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = sessions.filter((s) =>
    (s.team?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.route?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Juegos Activos</h1>
          <p className="text-muted-foreground mt-1">
            Estado actual de sesiones, misiones y tiempos.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por equipo o ruta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sesiones</CardTitle>
          <CardDescription>
            {sessions.filter((s) => s.status === "ACTIVE").length} activas,{" "}
            {sessions.filter((s) => s.status === "COMPLETED").length} completadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Puntaje</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.team?.name || "—"}</TableCell>
                  <TableCell>{session.route?.name || "—"}</TableCell>
                  <TableCell>{session.city?.name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[session.status]}>
                      {session.status === "ACTIVE" && <Play className="h-3 w-3 mr-1" />}
                      {session.status === "COMPLETED" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {session.status === "ABANDONED" && <XCircle className="h-3 w-3 mr-1" />}
                      {statusLabels[session.status] ?? session.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-bold">{session.score}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(session.startedAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={selected?.id === session.id} onOpenChange={(open) => !open && setSelected(null)}>
                      <DialogTrigger>
                        <Button variant="ghost" size="sm" onClick={() => setSelected(session)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {selected && selected.id === session.id && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Juego #{session.id.substring(0, 6)}</DialogTitle>
                            <DialogDescription>
                              {session.route?.name || ""} en {session.city?.name || ""}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 text-sm">
                            <div>
                              Equipo: {session.team?.name || "—"}
                            </div>
                            <div>
                              Estado: {statusLabels[session.status] ?? session.status}
                            </div>
                            <div>
                              Puntaje: {session.score}
                            </div>
                            <div className="pt-2 text-xs text-muted-foreground">
                              Aquí se puede expandir esta vista para mostrar misiones por juego,
                              ayudas usadas, tiempo por misión y tiempo global.
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelected(null)}>
                              Cerrar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay juegos activos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

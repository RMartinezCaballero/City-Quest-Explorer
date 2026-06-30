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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Eye, Play, CheckCircle, XCircle, Clock } from "lucide-react";
import { sessionsApi, type GameSession } from "@/lib/api";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  ABANDONED: "bg-red-50 text-red-700 border-red-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  ACTIVE: <Play className="h-3 w-3 mr-1" />,
  COMPLETED: <CheckCircle className="h-3 w-3 mr-1" />,
  ABANDONED: <XCircle className="h-3 w-3 mr-1" />,
};

export default function GamesSessionsPage() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  async function loadSessions() {
    setLoading(true);
    try {
      const data = await sessionsApi.list();
      setSessions(data);
    } catch (e) {
      console.error("Error loading sessions:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  const filtered = sessions.filter((s) => {
    const matchesSearch =
      (s.team?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.route?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sesiones de Juego</h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "Cargando..." : `${filtered.length} sesiones encontradas`}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por equipo o ruta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { if (v !== null) setStatusFilter(v); }}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ACTIVE">Activos</SelectItem>
                <SelectItem value="COMPLETED">Completados</SelectItem>
                <SelectItem value="ABANDONED">Abandonados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sesiones</CardTitle>
          <CardDescription>
            {sessions.filter(s => s.status === "ACTIVE").length} activas,{' '}
            {sessions.filter(s => s.status === "COMPLETED").length} completadas
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
                      {statusIcons[session.status]}
                      {session.status === "ACTIVE" ? "Activo" : session.status === "COMPLETED" ? "Completado" : "Abandonado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-bold">{session.score}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(session.startedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay sesiones de juego
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

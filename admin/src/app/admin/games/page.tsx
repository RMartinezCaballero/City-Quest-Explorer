"use client";

import { useState } from "react";
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
import { Search, Plus, Filter, Eye, MoreHorizontal } from "lucide-react";

const mockGames = [
  {
    id: "1",
    team: "Los Buscadores",
    route: "El Manuscrito Prohibido",
    status: "ACTIVE",
    score: 450,
    startedAt: "2026-06-28 10:30",
    members: 4,
  },
  {
    id: "2",
    team: "Aventureros",
    route: "El Manuscrito Prohibido",
    status: "COMPLETED",
    score: 850,
    startedAt: "2026-06-28 09:00",
    members: 3,
  },
  {
    id: "3",
    team: "Exploradores",
    route: "El Manuscrito Prohibido",
    status: "ACTIVE",
    score: 320,
    startedAt: "2026-06-28 11:15",
    members: 5,
  },
  {
    id: "4",
    team: "Cartagena Team",
    route: "El Manuscrito Prohibido",
    status: "ABANDONED",
    score: 120,
    startedAt: "2026-06-27 14:00",
    members: 2,
  },
  {
    id: "5",
    team: "Los Piratas",
    route: "El Manuscrito Prohibido",
    status: "COMPLETED",
    score: 920,
    startedAt: "2026-06-27 08:30",
    members: 4,
  },
];

const statusColors: Record<string, string> = {
  ACTIVE:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  COMPLETED:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  ABANDONED:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
};

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockGames.filter((g) => {
    const matchesSearch =
      g.team.toLowerCase().includes(search.toLowerCase()) ||
      g.route.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Juegos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las sesiones de juego activas y finalizadas
          </p>
        </div>
        <Dialog>
          <DialogTrigger render={<Button><Plus className="h-4 w-4 mr-2" />Nuevo Juego</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Juego</DialogTitle>
              <DialogDescription>
                Inicia una nueva sesión de juego para un equipo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Equipo</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Los Buscadores</SelectItem>
                    <SelectItem value="2">Aventureros</SelectItem>
                    <SelectItem value="3">Exploradores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Ruta</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ruta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      El Manuscrito Prohibido
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Crear Juego</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
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
            <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
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

      {/* Games Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiones de Juego</CardTitle>
          <CardDescription>
            {filtered.length} sesiones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Puntaje</TableHead>
                <TableHead>Miembros</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.team}</TableCell>
                  <TableCell>{game.route}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[game.status]}
                    >
                      {game.status === "ACTIVE"
                        ? "Activo"
                        : game.status === "COMPLETED"
                          ? "Completado"
                          : "Abandonado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{game.score}</TableCell>
                  <TableCell>{game.members}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {game.startedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

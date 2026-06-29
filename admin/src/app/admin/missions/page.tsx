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
import { Search, Plus, MapPin, BookOpen } from "lucide-react";

const missions = [
  { id: "M1", name: "Juramento en la Muralla", location: "Baluarte Santa Catalina", difficulty: "Fácil", order: 1, status: "active" },
  { id: "M2", name: "La Aduana del Tiempo", location: "Plaza de la Aduana", difficulty: "Fácil", order: 2, status: "active" },
  { id: "M3", name: "El Cálculo del Castillo", location: "Castillo San Felipe", difficulty: "Media", order: 3, status: "active" },
  { id: "M4", name: "Viento de La Popa", location: "La Popa", difficulty: "Media", order: 4, status: "active" },
  { id: "M5", name: "Sendero con Tolerancia", location: "Camellón de los Mártires", difficulty: "Media", order: 5, status: "active" },
  { id: "M6", name: "Cifrado de Piedra", location: "Getsemaní", difficulty: "Media", order: 6, status: "active" },
  { id: "M7", name: "Observación", location: "Calle de la Amargura", difficulty: "Fácil", order: 7, status: "active" },
  { id: "M8", name: "Registro del Regreso", location: "Bocagrande", difficulty: "Fácil", order: 8, status: "active" },
  { id: "M9", name: "Peligro Controlado", location: "Pastelillo", difficulty: "Difícil", order: 9, status: "active" },
  { id: "M10", name: "Capítulo Final", location: "Muelle de los Pegasos", difficulty: "Media", order: 10, status: "active" },
];

const difficultyColors: Record<string, string> = {
  "Fácil": "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  "Media": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  "Difícil": "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
};

export default function MissionsPage() {
  const [search, setSearch] = useState("");

  const filtered = missions.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Misiones</h1>
          <p className="text-muted-foreground mt-1">
            Las 10 misiones del Mission Pack Cartagena
          </p>
        </div>
        <Dialog>
          <DialogTrigger render={<Button><Plus className="h-4 w-4 mr-2" />Nueva Misión</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Misión</DialogTitle>
              <DialogDescription>
                Añade un nuevo checkpoint a una ruta existente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Nombre</label>
                <Input placeholder="Nombre de la misión" />
              </div>
              <div className="grid gap-2">
                <label>Ubicación</label>
                <Input placeholder="Lugar del checkpoint" />
              </div>
              <div className="grid gap-2">
                <label>Descripción</label>
                <Input placeholder="Descripción narrativa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label>Latitud</label>
                  <Input type="number" placeholder="10.4236" />
                </div>
                <div className="grid gap-2">
                  <label>Longitud</label>
                  <Input type="number" placeholder="-75.5532" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Crear Misión</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar misiones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Misión</TableHead>
                <TableHead>
                  <BookOpen className="h-4 w-4 inline mr-1" />
                  Ubicación
                </TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell className="font-mono text-muted-foreground">
                    {mission.order}
                  </TableCell>
                  <TableCell className="font-medium">{mission.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {mission.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={difficultyColors[mission.difficulty]}
                    >
                      {mission.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300"
                    >
                      Activa
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Editar
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

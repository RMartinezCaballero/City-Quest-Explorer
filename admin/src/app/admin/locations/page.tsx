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
import { Search, Plus, MapPin, Navigation, Copy } from "lucide-react";

const locations = [
  { id: 1, name: "Baluarte Santa Catalina", lat: 10.4236, lng: -75.5532, type: "Muralla", missions: 1, status: "active" },
  { id: 2, name: "Plaza de la Aduana", lat: 10.4225, lng: -75.5501, type: "Plaza", missions: 1, status: "active" },
  { id: 3, name: "Castillo San Felipe", lat: 10.4231, lng: -75.5403, type: "Fortaleza", missions: 1, status: "active" },
  { id: 4, name: "La Popa", lat: 10.4210, lng: -75.5340, type: "Mirador", missions: 1, status: "active" },
  { id: 5, name: "Camellón de los Mártires", lat: 10.4245, lng: -75.5470, type: "Paseo", missions: 1, status: "active" },
  { id: 6, name: "Getsemaní", lat: 10.4247, lng: -75.5525, type: "Barrio", missions: 1, status: "active" },
  { id: 7, name: "Calle de la Amargura", lat: 10.4253, lng: -75.5495, type: "Calle", missions: 1, status: "active" },
  { id: 8, name: "Bocagrande", lat: 10.4080, lng: -75.5550, type: "Malecón", missions: 1, status: "active" },
  { id: 9, name: "Pastelillo", lat: 10.4150, lng: -75.5480, type: "Bastión", missions: 1, status: "active" },
  { id: 10, name: "Muelle de los Pegasos", lat: 10.4200, lng: -75.5430, type: "Muelle", missions: 1, status: "active" },
];

const typeColors: Record<string, string> = {
  "Muralla": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  "Plaza": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  "Fortaleza": "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  "Mirador": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
  "Paseo": "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  "Barrio": "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300",
  "Calle": "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
  "Malecón": "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300",
  "Bastión": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300",
  "Muelle": "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300",
};

export default function LocationsPage() {
  const [search, setSearch] = useState("");

  const filtered = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ubicaciones</h1>
          <p className="text-muted-foreground mt-1">
            Puntos de interés en Cartagena para las misiones
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Ubicación
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ubicaciones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <CardDescription>
            {filtered.length} ubicaciones en Cartagena de Indias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Nombre
                </TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>
                  <Navigation className="h-4 w-4 inline mr-1" />
                  Coordenadas
                </TableHead>
                <TableHead>Misiones</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell className="font-medium">{loc.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={typeColors[loc.type]}
                    >
                      {loc.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                      {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${loc.lat},${loc.lng}`
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">M{loc.missions}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Activo
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

      {/* Mini Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Vista General - Cartagena
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[21/9] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Mapa interactivo (OpenStreetMap / Leaflet)
              </p>
              <p className="text-xs mt-1">
                10 ubicaciones en el centro histórico de Cartagena
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() =>
                  window.open(
                    "https://www.openstreetmap.org/export/embed.html?bbox=-75.56%2C10.40%2C-75.53%2C10.43&layer=mapnik",
                    "_blank"
                  )
                }
              >
                Ver en OpenStreetMap
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

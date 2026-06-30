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
import { Search, MapPin, Filter } from "lucide-react";
import { missionsApi, routesApi, citiesApi, type Mission, type City } from "@/lib/api";

const difficultyLabels: Record<number, string> = {
  1: "Muy Fácil", 3: "Fácil", 5: "Media", 7: "Difícil", 9: "Muy Difícil",
};

const difficultyColors: Record<number, string> = {
  1: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  3: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  5: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  7: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
  9: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
};

export default function MissionsPage() {
  const [missions, setMissions] = useState<(Mission & { routeName?: string; cityName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");

  async function loadAllMissions() {
    setLoading(true);
    try {
      const citiesData = await citiesApi.list();
      setCities(citiesData);

      const allMissions: (Mission & { routeName?: string; cityName?: string })[] = [];

      for (const city of citiesData) {
        const routes = await routesApi.list(city.id);
        for (const route of routes) {
          const routeMissions = await missionsApi.listByRoute(route.id);
          allMissions.push(
            ...routeMissions.map((m) => ({
              ...m,
              routeName: route.name,
              cityName: city.name,
            }))
          );
        }
      }

      setMissions(allMissions);
    } catch (e) {
      console.error("Error loading missions:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllMissions();
  }, []);

  const filtered = missions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.routeName || "").toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === "all" || m.cityName === cities.find(c => c.id === selectedCity)?.name;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Misiones</h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "Cargando..." : `${filtered.length} misiones en total`}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar misiones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCity} onValueChange={(v) => { if (v !== null) setSelectedCity(v); }}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Misiones</CardTitle>
          <CardDescription>Misiones disponibles en todas las rutas y ciudades</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Misión</TableHead>
                <TableHead><MapPin className="h-4 w-4 inline mr-1" />Ruta</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead className="text-right">Orden</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell className="font-mono text-muted-foreground">
                    {mission.orderIndex}
                  </TableCell>
                  <TableCell className="font-medium">{mission.title}</TableCell>
                  <TableCell>{mission.routeName || "—"}</TableCell>
                  <TableCell>{mission.cityName || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={difficultyColors[mission.difficulty] || ""}>
                      {difficultyLabels[mission.difficulty] || `Nivel ${mission.difficulty}`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {mission.isLastMission ? "🔚 Final" : `M${mission.orderIndex}`}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay misiones disponibles
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

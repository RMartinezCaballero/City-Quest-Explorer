"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Search, Users, MapPin, Trophy, QrCode } from "lucide-react";
import { routesApi, teamsApi, type Route, type Team } from "@/lib/api";

export default function AdminTeamsPage() {
  const [data, setData] = useState<{ route: Route; teams: Team[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const citiesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com"}/cities`
      );
      const cities = citiesRes.ok ? await citiesRes.json() : [];
      const result: { route: Route; teams: Team[] }[] = [];
      for (const city of cities) {
        const routeList = await routesApi.list(city.id);
        for (const route of routeList) {
          const teamList = await teamsApi.list(route.id);
          result.push({ route, teams: teamList });
        }
      }
      setData(result);
    } catch (e) {
      console.error("Error loading teams data:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = data.filter((item) =>
    item.route.name.toLowerCase().includes(search.toLowerCase()) ||
    item.route.cityId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipos</h1>
          <p className="text-muted-foreground mt-1">
            Administra equipos y su acceso por ruta.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar equipo o ruta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <Card key={item.route.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {item.route.name}
              </CardTitle>
              <CardDescription>
                {item.teams.length} equipo{(item.teams.length === 1 ? "" : "s")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{item.route.difficulty}</Badge>
                {item.teams.length > 0 && (
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{item.route.name}</DialogTitle>
                        <DialogDescription>Equipos registrados para esta ruta.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        {item.teams.map((team) => (
                          <div
                            key={team.id}
                            className="flex items-center justify-between py-2 border-b last:border-none"
                          >
                            <div>
                              <div className="font-medium">{team.name || `Equipo ${team.id}`}</div>
                              <div className="text-xs text-muted-foreground">
                                Capitán: {team.captainId}
                              </div>
                            </div>
                            <Badge variant="outline">
                              <Users className="h-3 w-3 mr-1" /> Equipo
                            </Badge>
                          </div>
                        ))}

                        {item.teams.length === 0 && (
                          <div className="text-sm text-muted-foreground">Sin equipos</div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cerrar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {!loading && filtered.length === 0 && (
          <Card>
            <CardContent className="text-center text-muted-foreground py-6">
              No hay equipos registrados
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

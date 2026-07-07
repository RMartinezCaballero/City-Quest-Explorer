"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Search, Users, MapPin, Trophy, QrCode, ShieldCheck } from "lucide-react";
import { routesApi, teamsApi, type Route, type Team } from "@/lib/api";

type RouteTeams = {
  route: Route;
  teams: Team[];
  count: number;
};

export default function AdminTeamsPage() {
  const [data, setData] = useState<RouteTeams[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RouteTeams | null>(null);

  async function load() {
    setLoading(true);
    try {
      const citiesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com"}/cities`
      );
      const cities = citiesRes.ok ? await citiesRes.json() : [];
      const result: RouteTeams[] = [];
      for (const city of cities) {
        try {
          const routeList = await routesApi.list(city.id);
          for (const route of routeList) {
            try {
              const teamList = await teamsApi.list(route.id);
              result.push({ route, teams: teamList, count: teamList.length });
            } catch (e) {
              console.error("Error loading teams for route", route.id, e);
              result.push({ route, teams: [], count: 0 });
            }
          }
        } catch (e) {
          console.error("Error loading routes for city", city.id, e);
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
            Solo existen registros como equipo cuando hay un conjunto creado; si no hay equipos, aquí se muestra el flujo/jugador individual por ruta.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ruta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => {
          const hasTeams = item.count > 0;
          const team = item.teams[0];
          return (
            <Dialog key={item.route.id} open={selected?.route.id === item.route.id} onOpenChange={(open) => !open && setSelected(null)}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {item.route.name}
                  </CardTitle>
                  <CardDescription>
                    {hasTeams ? `${item.count} equipo${item.count === 1 ? "" : "s"}` : "Sin equipos - jugador individual"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{item.route.difficulty}</Badge>

                    {hasTeams ? (
                      <Badge variant="outline" className="gap-1">
                        <Users className="h-3 w-3" />
                        Equipo definido
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Jugador único
                      </Badge>
                    )}
                  </div>

                  {hasTeams ? (
                    <div className="space-y-2 text-sm">
                      <div className="font-medium">{team.name || `Equipo ${team.id}`}</div>
                      <div className="text-muted-foreground">
                        Capitán: {team.captainId}
                      </div>
                      <div className="flex items-center gap-2">
                        <QrCode className="h-3 w-3" />
                        <span className="text-muted-foreground">
                          QR compartido para unirse
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="font-medium">Jugador en modalidad Solo</div>
                      <div className="text-muted-foreground">
                        Sin equipos asignados a esta ruta. El flujo debe mostrar la información del jugador y continuar como individual.
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3" />
                        <span className="text-muted-foreground">
                          Solo = un solo jugador usa el dispositivo
                        </span>
                      </div>
                    </div>
                  )}

                  <DialogTrigger>
                    <Button variant="secondary" className="w-full" onClick={() => setSelected({ route: item.route, teams: item.teams, count: item.count })}>
                      <Trophy className="h-4 w-4 mr-1" />
                      Detalle
                    </Button>
                  </DialogTrigger>
                </CardContent>
              </Card>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selected?.route.name}</DialogTitle>
                  <DialogDescription>
                    {hasTeams ? "Información del equipo" : "Información del jugador individual"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  {hasTeams ? (
                    <>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">Nombre del Equipo</div>
                        <div className="font-medium">{team.name || `Equipo ${team.id}`}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">Capitán</div>
                        <div>{team.captainId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">QR del Equipo</div>
                        <div className="text-sm">
                          Escanea para unirte: {team.id ? `team-${team.id}` : "Por definir"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">Modalidad</div>
                        <div className="font-medium">Jugador en Solo</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">Descripción</div>
                        <div className="text-sm">
                          Aquí se muestra la información informada del jugador cuando no existe un equipo.
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline">Cerrar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        })}

        {!loading && filtered.length === 0 && (
          <Card>
            <CardContent className="text-center text-muted-foreground py-6">
              No hay rutas o equipos registrados
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

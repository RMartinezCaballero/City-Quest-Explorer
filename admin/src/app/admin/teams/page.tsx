"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Search, Users, MapPin, Trophy, QrCode, ShieldCheck, Plus, UserPlus } from "lucide-react";
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

  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [createTeamName, setCreateTeamName] = useState("");
  const [createCaptainId, setCreateCaptainId] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [editName, setEditName] = useState("");
  const [editCaptainId, setEditCaptainId] = useState("");
  const [savingTeam, setSavingTeam] = useState(false);

  const [deleteTeamConfirm, setDeleteTeamConfirm] = useState<Team | null>(null);

  const [isSoloFlowOpen, setIsSoloFlowOpen] = useState(false);
  const [soloMode, setSoloMode] = useState(true);

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

  const createTeam = async () => {
    if (!selected || !createTeamName.trim()) return;
    setCreateLoading(true);
    try {
      await teamsApi.create(selected.route.id, {
        name: createTeamName,
        captainId: createCaptainId || selected.route.id,
      });
      setIsCreateTeamOpen(false);
      setCreateTeamName("");
      setCreateCaptainId("");
      await load();
    } catch (e) {
      console.error("Error creating team:", e);
    } finally {
      setCreateLoading(false);
    }
  };

  function openEditTeam(team: Team) {
    setEditTeam(team);
    setEditName(team.name || "");
    setEditCaptainId(team.captainId || "");
  }

  async function saveTeam() {
    if (!selected || !editTeam) return;
    setSavingTeam(true);
    try {
      await teamsApi.update(selected.route.id, editTeam.id, {
        name: editName,
        captainId: editCaptainId,
      });
      setEditTeam(null);
      await load();
    } catch (e) {
      console.error("Error updating team:", e);
    } finally {
      setSavingTeam(false);
    }
  }

  async function removeTeam() {
    if (!selected || !deleteTeamConfirm) return;
    await teamsApi.remove(selected.route.id, deleteTeamConfirm.id);
    setDeleteTeamConfirm(null);
    setSelected(null);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipos</h1>
          <p className="text-muted-foreground mt-1">
            Si hay equipos, se muestra la información del equipo. Si no existen equipos, se muestra el flujo/jugador individual por ruta.
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
                      <div className="font-medium">{team.name || `Equipo ${team.id}` || `Equipo ${team.id}`}</div>
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
                    <Button variant="secondary" className="w-full">
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

                {!hasTeams && (
                  <div className="space-y-3">
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
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSoloFlowOpen(true)}>Iniciar flujo solo</Button>
                    </DialogFooter>
                  </div>
                )}

                {hasTeams && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase">Nombre del Equipo</div>
                        <div className="font-medium">{team?.name || `Equipo ${team?.id}` || `Equipo ${team?.id}`}</div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={editTeam?.id === team?.id} onOpenChange={(open) => !open && setEditTeam(null)}>
                          <DialogTrigger>
                            <Button variant="ghost" size="sm" onClick={() => openEditTeam(team!)}>Editar</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar equipo</DialogTitle>
                            </DialogHeader>
                            {editTeam && (
                              <div className="grid gap-3">
                                <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nombre" />
                                <Input value={editCaptainId} onChange={(e) => setEditCaptainId(e.target.value)} placeholder="Capitán" />
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditTeam(null)}>Cancelar</Button>
                              <Button onClick={saveTeam} disabled={savingTeam}>Guardar</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={deleteTeamConfirm?.id === team?.id} onOpenChange={(open) => !open && setDeleteTeamConfirm(null)}>
                          <DialogTrigger>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteTeamConfirm(team!)}>Eliminar</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Eliminar equipo</DialogTitle>
                              <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                            </DialogHeader>
                            <div className="text-sm">¿Eliminar equipo {team?.name || team?.id}?</div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteTeamConfirm(null)}>Cancelar</Button>
                              <Button variant="destructive" onClick={removeTeam}>Eliminar</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
                          <DialogTrigger>
                            <Button size="sm" onClick={() => { setCreateTeamName(""); setCreateCaptainId(""); }}>
                              <Plus className="h-4 w-4 mr-1" />
                              Nuevo equipo
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Crear equipo</DialogTitle>
                              <DialogDescription>Completa los datos del nuevo equipo.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-3">
                              <Input value={createTeamName} onChange={(e) => setCreateTeamName(e.target.value)} placeholder="Nombre" />
                              <Input value={createCaptainId} onChange={(e) => setCreateCaptainId(e.target.value)} placeholder="ID capitán" />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>Cancelar</Button>
                              <Button onClick={createTeam} disabled={createLoading || !createTeamName.trim()}>
                                {createLoading ? "Creando..." : "Crear"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Capitán</div>
                      <div>{team?.captainId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">QR del Equipo</div>
                      <div className="text-sm">
                        Escanea para unirte: {team?.id ? `team-${team.id}` : "Por definir"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Jugadores</div>
                      <div className="text-sm">Se asignan desde el flujo de jugador.</div>
                    </div>
                  </div>
                )}
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

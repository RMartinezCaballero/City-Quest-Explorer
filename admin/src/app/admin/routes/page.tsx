"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CitySelect from "@/components/city-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Globe,
  Route as RouteIcon,
  Target,
  AlertCircle,
  CheckCircle2,
  Wand2,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";
import { routesApi, citiesApi, missionsApi, type Route, type City, type Mission } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com";

const difficultyConfig: Record<string, {
  label: string;
  color: string;
  minMissions: number;
  maxMissions: number;
}> = {
  EASY: {
    label: "Fácil",
    color: "bg-green-50 text-green-700 border-green-200",
    minMissions: 5,
    maxMissions: 8,
  },
  MEDIUM: {
    label: "Media",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    minMissions: 8,
    maxMissions: 12,
  },
  HARD: {
    label: "Difícil",
    color: "bg-red-50 text-red-700 border-red-200",
    minMissions: 12,
    maxMissions: 15,
  },
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<(Route & { cityName?: string })[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  // Create dialog
  const [openCreate, setOpenCreate] = useState(false);
  const [createCityId, setCreateCityId] = useState("");
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD",
    distanceMeters: 4000,
    estimatedMinutes: 120,
    missionCount: 10,
  });
  const [creating, setCreating] = useState(false);

  // Edit dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    cityId: "",
    name: "",
    description: "",
    difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD",
    distanceMeters: 4000,
    estimatedMinutes: 120,
    missionCount: 10,
  });

  // Selected missions for create
  const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
  const [selectedMissionIds, setSelectedMissionIds] = useState<string[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);

  // Assign missions from routes list
  const [openAssignMissions, setOpenAssignMissions] = useState(false);
  const [assigningRouteId, setAssigningRouteId] = useState<string | null>(null);
  const [assignMissions, setAssignMissions] = useState<Mission[]>([]);
  const [assignSelectedIds, setAssignSelectedIds] = useState<string[]>([]);
  const [assignSaving, setAssignSaving] = useState(false);

  // Generate missions state
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Difficulty-based mission range
  const createConfig = difficultyConfig[createForm.difficulty];
  const editConfig = difficultyConfig[editForm.difficulty];

  async function loadAllRoutes() {
    setLoading(true);
    try {
      const citiesData = await citiesApi.list();
      setCities(citiesData);

      const allRoutes: (Route & { cityName?: string })[] = [];
      for (const city of citiesData) {
        const cityRoutes = await routesApi.list(city.id);
        allRoutes.push(
          ...cityRoutes.map((r) => {
            // Extract missionCount from conditions JSON if present
            const conditions = (r as Route & { conditions?: Record<string, unknown> }).conditions || {};
            const missionCount =
              typeof conditions.missionCount === "number"
                ? conditions.missionCount
                : difficultyConfig[r.difficulty]?.maxMissions ?? 10;
            return { ...r, cityName: city.name, missionCount };
          })
        );
      }
      setRoutes(allRoutes);
    } catch (e) {
      console.error("Error loading routes:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllRoutes();
  }, []);

  // Load available missions when city changes in create dialog
  useEffect(() => {
    if (!createCityId || createCityId === "all") {
      setAvailableMissions([]);
      setSelectedMissionIds([]);
      return;
    }
    async function loadMissions() {
      setLoadingMissions(true);
      try {
        const allMissions: Mission[] = [];
        const cityRoutes = await routesApi.list(createCityId);
        for (const route of cityRoutes) {
          const missions = await missionsApi.listByRoute(route.id);
          allMissions.push(...missions);
        }
        setAvailableMissions(allMissions);
      } catch (e) {
        console.error("Error loading missions:", e);
      } finally {
        setLoadingMissions(false);
      }
    }
    loadMissions();
  }, [createCityId]);

  const filtered = useMemo(() => {
    return routes.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.cityName || "").toLowerCase().includes(search.toLowerCase());
      const matchesCity =
        selectedCity === "all" ||
        r.cityName === cities.find((c) => c.id === selectedCity)?.name;
      return matchesSearch && matchesCity;
    });
  }, [routes, search, selectedCity, cities]);

  // Update missionCount when difficulty changes in create
  function handleCreateDifficultyChange(v: string | null) {
    if (!v) return;
    const diff = v as "EASY" | "MEDIUM" | "HARD";
    const config = difficultyConfig[diff];
    // Set to midpoint of range
    const mid = Math.round((config.minMissions + config.maxMissions) / 2);
    setCreateForm((p) => ({ ...p, difficulty: diff, missionCount: mid }));
  }

  // Update missionCount when difficulty changes in edit
  function handleEditDifficultyChange(v: string | null) {
    if (!v) return;
    const diff = v as "EASY" | "MEDIUM" | "HARD";
    const config = difficultyConfig[diff];
    const mid = Math.round((config.minMissions + config.maxMissions) / 2);
    setEditForm((p) => ({ ...p, difficulty: diff, missionCount: mid }));
  }

  async function handleCreate() {
    if (!createCityId || !createForm.name) return;
    setCreating(true);
    try {
      const gamesRes = await fetch(`${API_BASE}/cities/${createCityId}/games`);
      const games = gamesRes.ok ? await gamesRes.json() : [];
      let storyId = "";
      if (games.length > 0 && games[0]?.stories?.length > 0) {
        storyId = games[0].stories[0].id;
      }
      if (!storyId) {
        alert("Primero crea un juego con una historia para esta ciudad.");
        return;
      }
      await routesApi.createByCity(createCityId, {
        storyId,
        name: createForm.name,
        description: createForm.description,
        difficulty: createForm.difficulty,
        distanceMeters: createForm.distanceMeters,
        estimatedMinutes: createForm.estimatedMinutes,
        conditions: { missionCount: createForm.missionCount },
      });
      setOpenCreate(false);
      setCreateForm({
        name: "",
        description: "",
        difficulty: "MEDIUM",
        distanceMeters: 4000,
        estimatedMinutes: 120,
        missionCount: 10,
      });
      setCreateCityId("");
      setSelectedMissionIds([]);
      await loadAllRoutes();
    } catch (e) {
      console.error("Error creating route:", e);
      alert("Error al crear ruta");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(routeId: string, name: string) {
    if (
      !confirm(
        `¿Eliminar ruta "${name}"? También se eliminarán sus misiones y checkpoints.`
      )
    )
      return;
    try {
      await routesApi.remove(routeId);
      await loadAllRoutes();
    } catch (e) {
      console.error("Error deleting route:", e);
      alert("Error al eliminar ruta");
    }
  }

  function openEditDialog(route: Route & { cityName?: string }) {
    const config = difficultyConfig[route.difficulty];
    const conditions = (route as Route & { conditions?: Record<string, unknown> }).conditions || {};
    const missionCount =
      typeof conditions.missionCount === "number"
        ? conditions.missionCount
        : Math.round((config.minMissions + config.maxMissions) / 2);

    setEditForm({
      id: route.id,
      cityId: route.cityId,
      name: route.name,
      description: route.description,
      difficulty: route.difficulty,
      distanceMeters: route.distanceMeters,
      estimatedMinutes: route.estimatedMinutes,
      missionCount,
    });
    setOpenEdit(true);
  }

  async function handleGenerateMissions(routeId: string) {
    setGeneratingId(routeId);
    try {
      const res = await fetch(
        `${API_BASE}/routes/${routeId}/missions/generate`,
        { method: "POST" }
      );
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${res.statusText}${body ? " - " + body : ""}`);
      }
      await loadAllRoutes();
    } catch (e) {
      console.error("Error generating missions:", e);
      alert("Error al generar misiones");
    } finally {
      setGeneratingId(null);
    }
  }

  async function openAssignMissionsDialog(routeId: string) {
    setAssigningRouteId(routeId);
    setOpenAssignMissions(true);
    setAssignSaving(true);
    setAssignSelectedIds([]);
    try {
      const missions = await routesApi.missions(routeId);
      const route = routes.find((item) => item.id === routeId);
      const conditions = (route as Route & { conditions?: Record<string, unknown> })?.conditions || {};
      const preselected =
        Array.isArray(conditions.selectedMissionIds) && conditions.selectedMissionIds.length > 0
          ? (conditions.selectedMissionIds as string[])
          : missions.map((m) => m.id);
      setAssignMissions(missions);
      setAssignSelectedIds(preselected);
    } catch (e) {
      console.error("Error loading route missions:", e);
      alert("No se pudieron cargar las misiones de la ruta");
    } finally {
      setAssignSaving(false);
    }
  }

  async function saveAssignMissions() {
    if (!assigningRouteId) return;
    setAssignSaving(true);
    try {
      await routesApi.assignMissions(assigningRouteId, assignSelectedIds);
      await loadAllRoutes();
      setOpenAssignMissions(false);
    } catch (e) {
      console.error("Error assigning missions:", e);
      alert("No se pudieron guardar las misiones asignadas");
    } finally {
      setAssignSaving(false);
    }
  }

  async function handleEdit() {
    if (!editForm.name) return;
    try {
      await routesApi.update(editForm.id, {
        name: editForm.name,
        description: editForm.description,
        difficulty: editForm.difficulty,
        distanceMeters: Number(editForm.distanceMeters),
        estimatedMinutes: Number(editForm.estimatedMinutes),
        conditions: { missionCount: editForm.missionCount },
      });
      setOpenEdit(false);
      await loadAllRoutes();
    } catch (e) {
      console.error("Error updating route:", e);
      alert("Error al actualizar ruta");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rutas</h1>
          <p className="text-muted-foreground mt-1">
            {loading
              ? "Cargando..."
              : `${filtered.length} rutas en total`}
          </p>
        </div>
        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Ruta
        </Button>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Ruta</DialogTitle>
              <DialogDescription>
                Define la ruta, su dificultad y cuántas misiones incluirá
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Ciudad */}
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Ciudad</label>
                <CitySelect
                  value={createCityId}
                  onChange={setCreateCityId}
                  placeholder="Seleccionar ciudad"
                />
              </div>

              {/* Nombre */}
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Nombre</label>
                <Input
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Ruta Principal"
                />
              </div>

              {/* Descripción */}
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Descripción</label>
                <Input
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Dificultad */}
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Dificultad</label>
                <Select
                  value={createForm.difficulty}
                  onValueChange={handleCreateDifficultyChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Fácil</SelectItem>
                    <SelectItem value="MEDIUM">Media</SelectItem>
                    <SelectItem value="HARD">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Misión Count Slider */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium leading-none">
                    <Target className="h-4 w-4" />
                    Cantidad de misiones                    </label>
                  <Badge
                    variant="outline"
                    className={createConfig.color}
                  >
                    {createForm.missionCount} misiones
                  </Badge>
                </div>
                <input
                  type="range"
                  min={createConfig.minMissions}
                  max={createConfig.maxMissions}
                  value={createForm.missionCount}
                  onChange={(e) =>
                    setCreateForm((p) => ({
                      ...p,
                      missionCount: Number(e.target.value),
                    }))
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mín: {createConfig.minMissions}</span>
                  <span>
                    {createConfig.label}: {createConfig.minMissions}-
                    {createConfig.maxMissions} misiones
                  </span>
                  <span>Máx: {createConfig.maxMissions}</span>
                </div>
              </div>

              {/* Distancia y tiempo */}
              <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">Distancia (m)</label>
                  <Input
                    type="number"
                    value={createForm.distanceMeters}
                    onChange={(e) =>
                      setCreateForm((p) => ({
                        ...p,
                        distanceMeters: Number(e.target.value),
                      }))
                    }
                  />
                </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">Minutos estimados</label>
                  <Input
                    type="number"
                    value={createForm.estimatedMinutes}
                    onChange={(e) =>
                      setCreateForm((p) => ({
                        ...p,
                        estimatedMinutes: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              {/* Available missions info */}
              {createCityId && (
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      {loadingMissions
                        ? "Cargando misiones disponibles..."
                        : `${availableMissions.length} misiones existentes en esta ciudad`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Las misiones se asignan y gestionan desde la sección{" "}
                    <strong>Misiones</strong>. Esta ruta tendrá{" "}
                    <strong>{createForm.missionCount} misiones</strong>.
                    Puedes ajustar la cantidad según la dificultad.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>
                Cancelar
              </Button>
              <Button
                disabled={creating || !createCityId || !createForm.name}
                onClick={handleCreate}
              >
                {creating ? "Creando..." : "Crear Ruta"}
              </Button>
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
                placeholder="Buscar rutas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <CitySelect
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="Filtrar ciudad"
              className="w-[200px]"
              includeAll
              allLabel="Todas las ciudades"
            />
          </div>
        </CardContent>
      </Card>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="h-5 w-5" />
            Rutas disponibles
          </CardTitle>
          <CardDescription>
            {loading
              ? "Cargando..."
              : `${filtered.length} rutas encontradas`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <RouteIcon className="h-4 w-4 inline mr-1" />
                  Nombre
                </TableHead>
                <TableHead>
                  <Globe className="h-4 w-4 inline mr-1" />
                  Ciudad
                </TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Misiones</TableHead>
                <TableHead>Distancia</TableHead>
                <TableHead>Checkpoints</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((route) => {
                const config = difficultyConfig[route.difficulty];
                const currentMissions = route.missions?.length ?? 0;
                const targetMissions = route.missionCount ?? config.maxMissions;
                const isComplete = currentMissions >= targetMissions;
                const progressPct = Math.min(
                  100,
                  Math.round((currentMissions / targetMissions) * 100)
                );

                return (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">
                      {route.name}
                    </TableCell>
                    <TableCell>{route.cityName || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={config.color}>
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-[100px]">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>
                              {currentMissions}/{targetMissions}
                            </span>
                            {isComplete ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                              <span className="text-muted-foreground">
                                {targetMissions - currentMissions} restantes
                              </span>
                            )}
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isComplete
                                  ? "bg-green-500"
                                  : "bg-amber-400"
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`ml-2 text-xs ${
                            isComplete
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {isComplete ? "Completa" : `${config.minMissions}-${config.maxMissions}`}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {Math.round(route.distanceMeters)} m
                    </TableCell>
                    <TableCell>
                      {route.checkpoints?.length ?? 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/admin/cities/${route.cityId}`,
                              "_blank"
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={generatingId === route.id}
                          onClick={() => handleGenerateMissions(route.id)}
                          title="Generar misiones automáticamente"
                        >
                          {generatingId === route.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                          ) : (
                            <Wand2 className="h-4 w-4 text-amber-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openAssignMissionsDialog(route.id)}
                          title="Asignar misiones a esta ruta"
                        >
                          <CheckSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(route)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDelete(route.id, route.name)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No hay rutas disponibles. Crea un juego con una historia
                    primero.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Ruta</DialogTitle>
            <DialogDescription>
              Modifica los datos de la ruta y la cantidad de misiones
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Nombre */}
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">Nombre</label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            {/* Descripción */}
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">Descripción</label>
              <Input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            {/* Dificultad */}
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">Dificultad</label>
              <Select
                value={editForm.difficulty}
                onValueChange={handleEditDifficultyChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Fácil</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HARD">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mission Count Slider */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1 text-sm font-medium leading-none">
                  <Target className="h-4 w-4" />
                  Cantidad de misiones
                </label>
                <Badge variant="outline" className={editConfig.color}>
                  {editForm.missionCount} misiones
                </Badge>
              </div>
              <input
                type="range"
                min={editConfig.minMissions}
                max={editConfig.maxMissions}
                value={editForm.missionCount}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    missionCount: Number(e.target.value),
                  }))
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mín: {editConfig.minMissions}</span>
                <span>
                  {editConfig.label}: {editConfig.minMissions}-
                  {editConfig.maxMissions} misiones
                </span>
                <span>Máx: {editConfig.maxMissions}</span>
              </div>
            </div>

            {/* Distancia y tiempo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Distancia (m)</label>
                <Input
                  type="number"
                  value={editForm.distanceMeters}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      distanceMeters: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none">Minutos estimados</label>
                <Input
                  type="number"
                  value={editForm.estimatedMinutes}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      estimatedMinutes: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancelar
            </Button>
            <Button disabled={!editForm.name} onClick={handleEdit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign missions dialog */}
      <Dialog open={openAssignMissions} onOpenChange={setOpenAssignMissions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar misiones a la ruta</DialogTitle>
            <DialogDescription>
              Seleccioná las misiones que estarán activas para esta ruta. La primera y última siempre estarán
              incluidas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4 max-h-[70vh] overflow-auto">
            {assignSaving && (
              <div className="text-sm text-muted-foreground">Cargando misiones...</div>
            )}
            {!assignSaving &&
              assignMissions.map((mission) => {
                const isFirst = mission.orderIndex === 0;
                const isLast = mission.isLastMission;
                const checked = assignSelectedIds.includes(mission.id);
                return (
                  <label
                    key={mission.id}
                    className="flex items-start gap-3 rounded-lg border px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                      checked={checked}
                      disabled={isFirst || isLast}
                      onChange={(e) =>
                        setAssignSelectedIds((curr) =>
                          e.target.checked
                            ? [...curr, mission.id]
                            : curr.filter((id) => id !== mission.id)
                        )
                      }
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {mission.title || `Misión ${mission.orderIndex + 1}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Orden: {mission.orderIndex + 1}
                        {isFirst ? " · Primera (siempre activa)" : ""}
                        {isLast ? " · Última (siempre activa)" : ""}
                      </div>
                    </div>
                  </label>
                );
              })}
            {!assignSaving && assignMissions.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Esta ruta no tiene misiones cargadas. Generalas primero desde el botón de varita.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAssignMissions(false)}>
              Cancelar
            </Button>
            <Button disabled={assignSaving} onClick={saveAssignMissions}>
              Guardar asignaciones
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

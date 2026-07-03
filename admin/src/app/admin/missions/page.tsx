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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, MapPin, Filter, Plus, Edit3, Trash2 } from "lucide-react";
import CitySelect from "@/components/city-select";
import { missionsApi, routesApi, citiesApi, type Mission, type City, type Route } from "@/lib/api";

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

  // Create dialog
  const [openCreate, setOpenCreate] = useState(false);
  const [createCityId, setCreateCityId] = useState("");
  const [createRouteId, setCreateRouteId] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
  const [createForm, setCreateForm] = useState({
    title: "", narrative: "", description: "", difficulty: 5, orderIndex: 1,
  });
  const [creating, setCreating] = useState(false);

  // Edit dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "", routeId: "", title: "", narrative: "", description: "", difficulty: 5, orderIndex: 1,
  });

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

  async function handleCityChange(cityId: string) {
    setCreateCityId(cityId);
    if (cityId) {
      const routes = await routesApi.list(cityId);
      setAvailableRoutes(routes);
    } else {
      setAvailableRoutes([]);
    }
    setCreateRouteId("");
  }

  async function handleCreate() {
    if (!createRouteId || !createForm.title) return;
    setCreating(true);
    try {
      await missionsApi.create(createRouteId, {
        title: createForm.title,
        narrative: createForm.narrative || null,
        description: createForm.description || null,
        difficulty: Number(createForm.difficulty),
        orderIndex: Number(createForm.orderIndex),
      });
      setOpenCreate(false);
      setCreateForm({ title: "", narrative: "", description: "", difficulty: 5, orderIndex: 1 });
      setCreateCityId("");
      setCreateRouteId("");
      await loadAllMissions();
    } catch (e) {
      console.error("Error creating mission:", e);
      alert("Error al crear misión");
    } finally {
      setCreating(false);
    }
  }

  function openEditDialog(mission: Mission & { routeName?: string; cityName?: string }) {
    setEditForm({
      id: mission.id,
      routeId: mission.routeId,
      title: mission.title,
      narrative: mission.narrative || "",
      description: mission.description || "",
      difficulty: mission.difficulty,
      orderIndex: mission.orderIndex,
    });
    setOpenEdit(true);
  }

  async function handleEdit() {
    if (!editForm.title) return;
    try {
      await missionsApi.update(editForm.routeId, editForm.id, {
        title: editForm.title,
        narrative: editForm.narrative || null,
        description: editForm.description || null,
        difficulty: Number(editForm.difficulty),
        orderIndex: Number(editForm.orderIndex),
      });
      setOpenEdit(false);
      await loadAllMissions();
    } catch (e) {
      console.error("Error updating mission:", e);
      alert("Error al actualizar misión");
    }
  }

  async function handleDelete(missionId: string, title: string) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;
    if (!confirm(`¿Eliminar misión "${title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await missionsApi.remove(mission.routeId, missionId);
      await loadAllMissions();
    } catch (e) {
      console.error("Error deleting mission:", e);
      alert("Error al eliminar misión");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Misiones</h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "Cargando..." : `${filtered.length} misiones en total`}
          </p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger render={<Button><Plus className="h-4 w-4 mr-2" />Nueva Misión</Button>} />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Misión</DialogTitle>
              <DialogDescription>Agrega una nueva misión a una ruta existente</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Ciudad</label>
                <CitySelect
                  value={createCityId}
                  onChange={handleCityChange}
                  placeholder="Seleccionar ciudad"
                />
              </div>
              <div className="grid gap-2">
                <label>Ruta</label>
                <Select value={createRouteId} onValueChange={(v) => { if (v !== null) setCreateRouteId(v); }} disabled={!createCityId}>
                  <SelectTrigger>
                    <SelectValue placeholder={createCityId ? "Seleccionar ruta" : "Primero selecciona una ciudad"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoutes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Título de la Misión</label>
                <Input value={createForm.title} onChange={(e) => setCreateForm(p => ({ ...p, title: e.target.value }))} placeholder="Ej: El Enigma del Faro" />
              </div>
              <div className="grid gap-2">
                <label>Narrativa (opcional)</label>
                <Textarea value={createForm.narrative} onChange={(e) => setCreateForm(p => ({ ...p, narrative: e.target.value }))} rows={2} placeholder="Texto narrativo de la misión..." />
              </div>
              <div className="grid gap-2">
                <label>Descripción</label>
                <Input value={createForm.description} onChange={(e) => setCreateForm(p => ({ ...p, description: e.target.value }))} placeholder="Descripción breve" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label>Dificultad (1-10)</label>
                  <Input type="number" min={1} max={10} value={createForm.difficulty} onChange={(e) => setCreateForm(p => ({ ...p, difficulty: Number(e.target.value) }))} />
                </div>
                <div className="grid gap-2">
                  <label>Orden</label>
                  <Input type="number" min={1} value={createForm.orderIndex} onChange={(e) => setCreateForm(p => ({ ...p, orderIndex: Number(e.target.value) }))} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancelar</Button>
              <Button disabled={creating || !createRouteId || !createForm.title} onClick={handleCreate}>
                {creating ? "Creando..." : "Crear Misión"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <TableHead>Orden</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
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
                  <TableCell className="text-muted-foreground">
                    {mission.isLastMission ? "🔚 Final" : `M${mission.orderIndex}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(mission)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(mission.id, mission.title)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay misiones disponibles
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
            <DialogTitle>Editar Misión</DialogTitle>
            <DialogDescription>Modifica los datos de la misión</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Título</label>
              <Input value={editForm.title} onChange={(e) => setEditForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <label>Narrativa</label>
              <Textarea value={editForm.narrative} onChange={(e) => setEditForm(p => ({ ...p, narrative: e.target.value }))} rows={2} />
            </div>
            <div className="grid gap-2">
              <label>Descripción</label>
              <Input value={editForm.description} onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label>Dificultad (1-10)</label>
                <Input type="number" min={1} max={10} value={editForm.difficulty} onChange={(e) => setEditForm(p => ({ ...p, difficulty: Number(e.target.value) }))} />
              </div>
              <div className="grid gap-2">
                <label>Orden</label>
                <Input type="number" min={1} value={editForm.orderIndex} onChange={(e) => setEditForm(p => ({ ...p, orderIndex: Number(e.target.value) }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button disabled={!editForm.title} onClick={handleEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

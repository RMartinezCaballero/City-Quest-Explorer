"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  DialogTrigger,
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
import { Search, Plus, Edit3, Trash2, Eye, Globe, Route as RouteIcon, MapPin } from "lucide-react";
import { routesApi, citiesApi, type Route, type City } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com";

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-50 text-green-700 border-green-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HARD: "bg-red-50 text-red-700 border-red-200",
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
    name: "", description: "", difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD",
    distanceMeters: 4000, estimatedMinutes: 120,
  });
  const [creating, setCreating] = useState(false);

  // Edit dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "", cityId: "", name: "", description: "", difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD",
    distanceMeters: 4000, estimatedMinutes: 120,
  });

  async function loadAllRoutes() {
    setLoading(true);
    try {
      const citiesData = await citiesApi.list();
      setCities(citiesData);

      const allRoutes: (Route & { cityName?: string })[] = [];
      for (const city of citiesData) {
        const cityRoutes = await routesApi.list(city.id);
        allRoutes.push(...cityRoutes.map(r => ({ ...r, cityName: city.name })));
      }
      setRoutes(allRoutes);
    } catch (e) {
      console.error("Error loading routes:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAllRoutes(); }, []);

  const filtered = useMemo(() => {
    return routes.filter((r) => {
      const matchesSearch = !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.cityName || "").toLowerCase().includes(search.toLowerCase());
      const matchesCity = selectedCity === "all" || r.cityName === cities.find(c => c.id === selectedCity)?.name;
      return matchesSearch && matchesCity;
    });
  }, [routes, search, selectedCity, cities]);

  async function handleCreate() {
    if (!createCityId || !createForm.name) return;
    setCreating(true);
    try {
      // Need to get a story for this city to create the route
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
        ...createForm,
      });
      setOpenCreate(false);
      setCreateForm({ name: "", description: "", difficulty: "MEDIUM", distanceMeters: 4000, estimatedMinutes: 120 });
      setCreateCityId("");
      await loadAllRoutes();
    } catch (e) {
      console.error("Error creating route:", e);
      alert("Error al crear ruta");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(routeId: string, name: string) {
    if (!confirm(`¿Eliminar ruta "${name}"? También se eliminarán sus misiones y checkpoints.`)) return;
    try {
      await routesApi.remove(routeId);
      await loadAllRoutes();
    } catch (e) {
      console.error("Error deleting route:", e);
      alert("Error al eliminar ruta");
    }
  }

  function openEditDialog(route: Route & { cityName?: string }) {
    setEditForm({
      id: route.id,
      cityId: route.cityId,
      name: route.name,
      description: route.description,
      difficulty: route.difficulty,
      distanceMeters: route.distanceMeters,
      estimatedMinutes: route.estimatedMinutes,
    });
    setOpenEdit(true);
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
            {loading ? "Cargando..." : `${filtered.length} rutas en total`}
          </p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger render={<Button><Plus className="h-4 w-4 mr-2" />Nueva Ruta</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Ruta</DialogTitle>
              <DialogDescription>Una ruta contiene misiones y checkpoints para una ciudad</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label>Ciudad</label>
                <CitySelect
                  value={createCityId}
                  onChange={setCreateCityId}
                  placeholder="Seleccionar ciudad"
                />
              </div>
              <div className="grid gap-2">
                <label>Nombre</label>
                <Input value={createForm.name} onChange={(e) => setCreateForm(p => ({ ...p, name: e.target.value }))} placeholder="Ruta Principal" />
              </div>
              <div className="grid gap-2">
                <label>Descripción</label>
                <Input value={createForm.description} onChange={(e) => setCreateForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label>Distancia (m)</label>
                  <Input type="number" value={createForm.distanceMeters} onChange={(e) => setCreateForm(p => ({ ...p, distanceMeters: Number(e.target.value) }))} />
                </div>
                <div className="grid gap-2">
                  <label>Minutos</label>
                  <Input type="number" value={createForm.estimatedMinutes} onChange={(e) => setCreateForm(p => ({ ...p, estimatedMinutes: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="grid gap-2">
                <label>Dificultad</label>
                <Select value={createForm.difficulty} onValueChange={(v) => { if (v !== null) setCreateForm(p => ({ ...p, difficulty: v as "EASY" | "MEDIUM" | "HARD" })); }}>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancelar</Button>
              <Button disabled={creating || !createCityId || !createForm.name} onClick={handleCreate}>
                {creating ? "Creando..." : "Crear Ruta"}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="h-5 w-5" />
            Rutas disponibles
          </CardTitle>
          <CardDescription>
            {loading ? "Cargando..." : `${filtered.length} rutas encontradas`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><RouteIcon className="h-4 w-4 inline mr-1" />Nombre</TableHead>
                <TableHead><Globe className="h-4 w-4 inline mr-1" />Ciudad</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Distancia</TableHead>
                <TableHead>Misiones</TableHead>
                <TableHead>Checkpoints</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>{route.cityName || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={difficultyColors[route.difficulty]}>
                      {route.difficulty === "EASY" ? "Fácil" : route.difficulty === "MEDIUM" ? "Media" : "Difícil"}
                    </Badge>
                  </TableCell>
                  <TableCell>{Math.round(route.distanceMeters)} m</TableCell>
                  <TableCell>{route.missions?.length ?? 0}</TableCell>
                  <TableCell>{route.checkpoints?.length ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Link href={`/admin/cities/${route.cityId}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(route)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(route.id, route.name)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay rutas disponibles. Crea un juego con una historia primero.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ruta</DialogTitle>
            <DialogDescription>Modifica los datos de la ruta</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Nombre</label>
              <Input value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <label>Descripción</label>
              <Input value={editForm.description} onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label>Distancia (m)</label>
                <Input type="number" value={editForm.distanceMeters} onChange={(e) => setEditForm(p => ({ ...p, distanceMeters: Number(e.target.value) }))} />
              </div>
              <div className="grid gap-2">
                <label>Minutos estimados</label>
                <Input type="number" value={editForm.estimatedMinutes} onChange={(e) => setEditForm(p => ({ ...p, estimatedMinutes: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <label>Dificultad</label>
              <Select value={editForm.difficulty} onValueChange={(v) => { if (v !== null) setEditForm(p => ({ ...p, difficulty: v as "EASY" | "MEDIUM" | "HARD" })); }}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button disabled={!editForm.name} onClick={handleEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

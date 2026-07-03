"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
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
import { Search, Plus, MapPin, Globe, Edit3, Trash2, Gamepad2, Eye } from "lucide-react";
import { citiesApi, type City } from "@/lib/api";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  INACTIVE: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", country: "" });
  const [creating, setCreating] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", slug: "", country: "" });

  async function loadCities() {
    setLoading(true);
    try {
      setCities(await citiesApi.list());
    } catch (e) {
      console.error("Error loading cities:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCities(); }, []);

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate() {
    if (!form.name || !form.slug) return;
    setCreating(true);
    try {
      await citiesApi.create({ name: form.name, slug: form.slug.toLowerCase().replace(/\s+/g, "-"), country: form.country });
      setOpenCreate(false);
      setForm({ name: "", slug: "", country: "" });
      await loadCities();
    } catch (e) {
      console.error("Error creating city:", e);
    } finally {
      setCreating(false);
    }
  }

  async function handleEdit() {
    if (!editForm.name) return;
    try {
      await citiesApi.update(editForm.id, { name: editForm.name, slug: editForm.slug.toLowerCase().replace(/\s+/g, "-"), country: editForm.country });
      setOpenEdit(false);
      await loadCities();
    } catch (e) {
      console.error("Error updating city:", e);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm("Eliminar " + name + "?")) return;
    try {
      await citiesApi.remove(id);
      await loadCities();
    } catch (e) {
      console.error("Error deleting city:", e);
    }
  }

  function openEditDialog(city: City) {
    setEditForm({ id: city.id, name: city.name, slug: city.slug, country: city.country });
    setOpenEdit(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ciudades</h1>
          <p className="text-muted-foreground mt-1">{loading ? "Cargando..." : filtered.length + " ciudades"}</p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger render={<Button><Plus className="h-4 w-4 mr-2" />Nueva Ciudad</Button>} />
          <DialogContent>
            <DialogHeader><DialogTitle>Crear Ciudad</DialogTitle><DialogDescription>Una ciudad puede tener múltiples juegos</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><label>Nombre</label><Input placeholder="Barranquilla" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} /></div>
              <div className="grid gap-2"><label>Slug</label><Input value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
              <div className="grid gap-2"><label>País</label><Input placeholder="Colombia" value={form.country} onChange={(e) => setForm(p => ({ ...p, country: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancelar</Button>
              <Button disabled={creating || !form.name} onClick={handleCreate}>{creating ? "Creando..." : "Crear"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar ciudades..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><MapPin className="h-4 w-4 inline mr-1" />Nombre</TableHead>
                <TableHead><Globe className="h-4 w-4 inline mr-1" />País</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((city) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">
                    <Link href={"/admin/cities/" + city.id} className="hover:underline text-primary">{city.name}</Link>
                  </TableCell>
                  <TableCell>{city.country}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[city.state || "ACTIVE"]}>{city.state || "ACTIVE"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Link href={"/admin/cities/" + city.id}>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />Ver</Button>
                      </Link>
                      <Link href={"/admin/games-template?cityId=" + city.id}>
                        <Button variant="ghost" size="sm"><Gamepad2 className="h-4 w-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(city)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(city.id, city.name)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No hay ciudades. Crea la primera!</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Ciudad</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><label>Nombre</label><Input value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="grid gap-2"><label>Slug</label><Input value={editForm.slug} onChange={(e) => setEditForm(p => ({ ...p, slug: e.target.value }))} /></div>
            <div className="grid gap-2"><label>País</label><Input value={editForm.country} onChange={(e) => setEditForm(p => ({ ...p, country: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button onClick={handleEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Globe,
  MapPin,
  Share2,
  Pencil,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com";

interface Game {
  id: string;
  cityId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  difficulty: string;
  status: string;
  maxPlayers: number;
  imageUrl: string | null;
  city: { id: string; name: string; country: string };
  stories: Array<{ id: string; name: string; status: string }>;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  PUBLISHED: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  ARCHIVED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
};

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  HARD: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
};

export default function GameDetailPage() {
  const params = useParams<{ gameId: string }>();
  const router = useRouter();
  const gameId = params.gameId;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    difficulty: "MEDIUM",
    durationMinutes: 120,
    maxPlayers: 5,
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [storyName, setStoryName] = useState("");
  const [storyIntro, setStoryIntro] = useState("");

  const [openRoute, setOpenRoute] = useState(false);
  const [routeDifficulty, setRouteDifficulty] = useState("MEDIUM");
  const [routeDistanceMeters, setRouteDistanceMeters] = useState("4000");
  const [routeEstimatedMinutes, setRouteEstimatedMinutes] = useState("120");
  const [routing, setRouting] = useState(false);

  useEffect(() => {
    if (gameId) loadGame();
  }, [gameId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function loadGame() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`);
      if (res.ok) {
        const data = (await res.json()) as Game;
        setGame(data);
        setEditForm({
          name: data.name,
          description: data.description || "",
          difficulty: data.difficulty,
          durationMinutes: data.durationMinutes,
          maxPlayers: data.maxPlayers,
        });
      }
    } catch (e) {
      console.error("Error loading game:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateStory() {
    if (!game || !storyName.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: storyName,
          introduction: storyIntro || undefined,
        }),
      });
      if (res.ok) {
        setOpenCreate(false);
        setStoryName("");
        setStoryIntro("");
        await loadGame();
      }
    } catch (e) {
      console.error("Error creating story:", e);
    }
  }

  async function handleEditGame() {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description || null,
          difficulty: editForm.difficulty,
          durationMinutes: Number(editForm.durationMinutes),
          maxPlayers: Number(editForm.maxPlayers),
        }),
      });
      if (res.ok) {
        setOpenEdit(false);
        await loadGame();
      }
    } catch (e) {
      console.error("Error updating game:", e);
    }
  }

  async function handlePublish() {
    try {
      await fetch(`${API_BASE}/games/${gameId}/publish`, { method: "POST" });
      await loadGame();
    } catch (e) {
      console.error("Error publishing:", e);
    }
  }

  async function handleClone() {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}/clone`, { method: "POST" });
      if (res.ok) {
        const cloned = (await res.json()) as { id: string };
        router.push(`/admin/games-template/${cloned.id}`);
      }
    } catch (e) {
      console.error("Error cloning:", e);
    }
  }

  async function handleEnsureGameRoutes() {
    if (!game || routing) return;
    setRouting(true);
    try {
      const cityId = game.cityId;

      const easy = await fetch(`${API_BASE}/cities/${cityId}/routes?difficulty=EASY`).then((r) =>
        r.ok ? r.json() : []
      );
      const medium = await fetch(`${API_BASE}/cities/${cityId}/routes?difficulty=MEDIUM`).then((r) =>
        r.ok ? r.json() : []
      );
      const hard = await fetch(`${API_BASE}/cities/${cityId}/routes?difficulty=HARD`).then((r) =>
        r.ok ? r.json() : []
      );

      const missionTargets = { EASY: "6", MEDIUM: "9", HARD: "12" };
      const difficulties = [
        { key: "EASY", items: easy },
        { key: "MEDIUM", items: medium },
        { key: "HARD", items: hard },
      ] as const;

      for (const diff of difficulties) {
        const hasDiffRoute = diff.items.some((route: any) => route.difficulty === diff.key);
        if (!hasDiffRoute && game.stories[0]) {
          await fetch(
            `${API_BASE}/stories/${game.stories[0].id}/cities/${cityId}/routes`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: `${game.name} — ${diff.key}`,
                description: `Ruta ${diff.key.toLowerCase()} del juego`,
                difficulty: diff.key,
                distanceMeters: 5000,
                estimatedMinutes: 120,
                missionCount: Number(missionTargets[diff.key]),
              }),
            }
          );
        }
      }

      await loadGame();
    } catch (e) {
      console.error("Error ensuring routes:", e);
    } finally {
      setRouting(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando juego...</div>;
  }

  if (!game) {
    return <div className="p-8 text-center text-muted-foreground">Juego no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/games-template">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{game.name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {game.city.name}, {game.city.country}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenEdit(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={handleClone}>
            <Share2 className="h-4 w-4 mr-2" />
            Clonar
          </Button>
          <Button onClick={handlePublish}>
            {game.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Rutas del juego
          </CardTitle>
          <CardDescription>Asigna y genera rutas automáticas para este juego</CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={handleEnsureGameRoutes}
          disabled={routing || game.stories.length === 0}
        >
          <Globe className="h-4 w-4 mr-2" />
          {routing ? "Generando..." : "Generar rutas base"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Duración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{game.durationMinutes} min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Dificultad</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className={difficultyColors[game.difficulty]}>
              {game.difficulty}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Jugadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{game.maxPlayers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className={statusColors[game.status]}>
              {game.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Historias
              </CardTitle>
              <CardDescription>
                Historias narrativas asociadas a este juego
              </CardDescription>
            </div>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger render={<Button><Plus className="h-4 w-4 mr-2" />Nueva Historia</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Historia</DialogTitle>
                  <DialogDescription>
                    Las historias permiten crear rutas y misiones dentro de este juego.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label>Nombre</label>
                    <Input
                      placeholder="Nombre de la historia"
                      value={storyName}
                      onChange={(e) => setStoryName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label>Introducción (opcional)</label>
                    <Input
                      placeholder="Introducción narrativa"
                      value={storyIntro}
                      onChange={(e) => setStoryIntro(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenCreate(false)}>
                    Cancelar
                  </Button>
                  <Button disabled={!storyName.trim()} onClick={handleCreateStory}>
                    Crear Historia
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {game.stories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell className="font-medium">{story.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[story.status]}>
                      {story.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/games-template/${gameId}/stories/${story.id}`}>
                      <Button variant="ghost" size="sm">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Ver Historia
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {game.stories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No hay historias. ¡Crea la primera!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Juego</DialogTitle>
            <DialogDescription>Modifica los datos del juego</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Nombre</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <label>Descripción</label>
              <Textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label>Dificultad</label>
                <Select
                  value={editForm.difficulty}
                  onValueChange={(v) => {
                    if (v !== null) {
                      setEditForm((prev) => ({ ...prev, difficulty: v }));
                    }
                  }}
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
              <div className="grid gap-2">
                <label>Duración (min)</label>
                <Input
                  type="number"
                  value={String(editForm.durationMinutes)}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      durationMinutes: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label>Máximo de jugadores</label>
              <Input
                type="number"
                value={String(editForm.maxPlayers)}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    maxPlayers: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancelar
            </Button>
            <Button disabled={!editForm.name.trim()} onClick={handleEditGame}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

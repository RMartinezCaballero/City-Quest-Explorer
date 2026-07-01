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
  Trash2,
  Pencil,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com";

interface Story {
  id: string;
  name: string;
  status: string;
  routes?: Array<{ id: string; name: string; difficulty: string; status: string }>;
}

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
  city: { id: string; name: string; slug: string; country: string };
  stories: Story[];
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

  // Edit game dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    difficulty: "MEDIUM",
    durationMinutes: 120,
    maxPlayers: 5,
  });

  // Create story dialog
  const [openCreate, setOpenCreate] = useState(false);
  const [storyName, setStoryName] = useState("");
  const [storyIntro, setStoryIntro] = useState("");

  async function loadGame() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`);
      if (res.ok) {
        setGame(await res.json());
      }
    } catch (e) {
      console.error("Error loading game:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (gameId) loadGame();
  }, [gameId]);

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
        loadGame();
      }
    } catch (e) {
      console.error("Error creating story:", e);
    }
  }

  async function handlePublish() {
    try {
      await fetch(`${API_BASE}/games/${gameId}/publish`, { method: "POST" });
      loadGame();
    } catch (e) {
      console.error("Error publishing:", e);
    }
  }

  async function handleClone() {
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}/clone`, { method: "POST" });
      if (res.ok) {
        const cloned = await res.json();
        router.push(`/admin/games-template/${cloned.id}`);
      }
    } catch (e) {
      console.error("Error cloning:", e);
    }
  }

  function openEditDialog() {
    if (!game) return;
    setEditForm({
      name: game.name,
      description: game.description || "",
      difficulty: game.difficulty,
      durationMinutes: game.durationMinutes,
      maxPlayers: game.maxPlayers,
    });
    setOpenEdit(true);
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
        loadGame();
      }
    } catch (e) {
      console.error("Error updating game:", e);
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
      {/* Header */}
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
          <Button variant="outline" onClick={openEditDialog}>
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

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Duración</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{game.durationMinutes} min</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Dificultad</CardTitle></CardHeader>
          <CardContent>
            <Badge variant="outline" className={difficultyColors[game.difficulty]}>{game.difficulty}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Jugadores</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{game.maxPlayers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Estado</CardTitle></CardHeader>
          <CardContent>
            <Badge variant="outline" className={statusColors[game.status]}>{game.status}</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Stories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Historias
              </CardTitle>
              <CardDescription>Historias narrativas asociadas a este juego</CardDescription>
            </div>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger render={<Button><Plus className="h-4 w-4 mr-2" />Nueva Historia</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Historia</DialogTitle>
                  <DialogDescription>
                    Una historia contiene lore, objetivos narrativos y rutas jugables.
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
                      placeholder="Texto de introducción narrativa"
                      value={storyIntro}
                      onChange={(e) => setStoryIntro(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancelar</Button>
                  <Button disabled={!storyName.trim()} onClick={handleCreateStory}>Crear Historia</Button>
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
                <TableHead>Rutas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {game.stories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell className="font-medium">{story.name}</TableCell>
                  <TableCell>{(story.routes ?? []).length} rutas</TableCell>
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
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay historias. ¡Crea la primera!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Game Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Juego</DialogTitle>
            <DialogDescription>
              Modifica los datos del juego
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Nombre</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <label>Descripción</label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label>Dificultad</label>
                <Select
                  value={editForm.difficulty}
                  onValueChange={(v) => { if (v !== null) setEditForm(p => ({ ...p, difficulty: v })); }}
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
                  value={editForm.durationMinutes}
                  onChange={(e) => setEditForm(p => ({ ...p, durationMinutes: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label>Máximo de jugadores</label>
              <Input
                type="number"
                value={editForm.maxPlayers}
                onChange={(e) => setEditForm(p => ({ ...p, maxPlayers: Number(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button disabled={!editForm.name.trim()} onClick={handleEditGame}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

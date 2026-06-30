"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  ArrowLeft,
  Route,
  Flag,
  Plus,
  BookOpen,
  MapPin,
  Trophy,
  GripVertical,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com/api";

interface StoryEnding {
  id: string;
  name: string;
  description: string;
  conditions: Record<string, unknown>;
  narrative: string | null;
  mediaUrl: string | null;
  orderIndex: number;
}

interface StoryRoute {
  id: string;
  name: string;
  difficulty: string;
  status: string;
  distanceMeters: number;
  estimatedMinutes: number;
  missions?: Array<{
    id: string;
    title: string;
    orderIndex: number;
    difficulty: number;
    challenges?: Array<{ id: string; type: string; prompt: string }>;
  }>;
}

interface Story {
  id: string;
  name: string;
  introduction: string | null;
  lore: string | null;
  objectives: string[] | null;
  rules: string | null;
  status: string;
  game: { id: string; name: string; city: { name: string } };
  routes: StoryRoute[];
  endings: StoryEnding[];
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-50 text-green-700 border-green-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HARD: "bg-red-50 text-red-700 border-red-200",
};

const missionDifficultyColors: Record<number, string> = {
  1: "bg-green-100 text-green-700",
  2: "bg-green-100 text-green-700",
  3: "bg-lime-100 text-lime-700",
  4: "bg-lime-100 text-lime-700",
  5: "bg-amber-100 text-amber-700",
  6: "bg-amber-100 text-amber-700",
  7: "bg-orange-100 text-orange-700",
  8: "bg-orange-100 text-orange-700",
  9: "bg-red-100 text-red-700",
  10: "bg-red-100 text-red-700",
};

export default function StoryDetailPage() {
  const params = useParams<{ gameId: string; storyId: string }>();
  const { gameId, storyId } = params;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  // Create route dialog
  const [openRoute, setOpenRoute] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeDesc, setRouteDesc] = useState("");
  const [routeDist, setRouteDist] = useState("4000");
  const [routeMin, setRouteMin] = useState("120");
  const [routeDiff, setRouteDiff] = useState("MEDIUM");

  // Create ending dialog
  const [openEnding, setOpenEnding] = useState(false);
  const [endingName, setEndingName] = useState("");
  const [endingDesc, setEndingDesc] = useState("");

  async function loadStory() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/games/${gameId}/stories/${storyId}`);
      if (res.ok) setStory(await res.json());
    } catch (e) {
      console.error("Error loading story:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (gameId && storyId) loadStory();
  }, [gameId, storyId]);

  async function handleCreateRoute() {
    if (!story) return;
    // Obtener cityId desde el game asociado (necesitamos cargar el game)
    try {
      const gameRes = await fetch(`${API_BASE}/games/${gameId}`);
      if (!gameRes.ok) return;
      const gameData = await gameRes.json();
      const cityId = gameData.cityId;

      const res = await fetch(`${API_BASE}/stories/${storyId}/cities/${cityId}/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: routeName,
          description: routeDesc,
          difficulty: routeDiff,
          distanceMeters: parseInt(routeDist),
          estimatedMinutes: parseInt(routeMin),
          isDefault: story.routes.length === 0,
        }),
      });
      if (res.ok) {
        setOpenRoute(false);
        setRouteName("");
        setRouteDesc("");
        loadStory();
      }
    } catch (e) {
      console.error("Error creating route:", e);
    }
  }

  async function handleCreateEnding() {
    if (!story) return;
    try {
      const res = await fetch(`${API_BASE}/stories/${storyId}/endings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: endingName,
          description: endingDesc,
          conditions: { minScore: 0, requiredMissions: 10 },
        }),
      });
      if (res.ok) {
        setOpenEnding(false);
        setEndingName("");
        setEndingDesc("");
        loadStory();
      }
    } catch (e) {
      console.error("Error creating ending:", e);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando historia...</div>;
  }

  if (!story) {
    return <div className="p-8 text-center text-muted-foreground">Historia no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/games-template/${gameId}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{story.name}</h1>
            <p className="text-muted-foreground mt-1">{story.game.name} — {story.game.city?.name}</p>
          </div>
        </div>
      </div>

      {/* Narrative Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Información Narrativa</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Introducción</h3>
            <p className="text-sm">{story.introduction || "—"}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Estado</h3>
            <Badge variant="outline" className={story.status === "PUBLISHED" ? "bg-green-50 text-green-700" : ""}>
              {story.status}
            </Badge>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Lore</h3>
            <p className="text-sm">{story.lore || "—"}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Objetivos</h3>
            {story.objectives ? (
              <ul className="list-disc list-inside text-sm space-y-1">
                {story.objectives.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            ) : <p className="text-sm">—</p>}
          </div>
        </CardContent>
      </Card>

      {/* Routes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Route className="h-5 w-5" />Rutas</CardTitle>
              <CardDescription>Rutas jugables con misiones ordenadas</CardDescription>
            </div>
            <Dialog open={openRoute} onOpenChange={setOpenRoute}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Nueva Ruta</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Ruta</DialogTitle>
                  <DialogDescription>Define una variante de ruta con orden de misiones</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label>Nombre</label>
                    <Input value={routeName} onChange={(e) => setRouteName(e.target.value)} placeholder="Ruta Alternativa B" />
                  </div>
                  <div className="grid gap-2">
                    <label>Descripción</label>
                    <Input value={routeDesc} onChange={(e) => setRouteDesc(e.target.value)} placeholder="Ruta por Getsemaní..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label>Distancia (m)</label>
                      <Input type="number" value={routeDist} onChange={(e) => setRouteDist(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <label>Minutos</label>
                      <Input type="number" value={routeMin} onChange={(e) => setRouteMin(e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenRoute(false)}>Cancelar</Button>
                  <Button disabled={!routeName.trim()} onClick={handleCreateRoute}>Crear Ruta</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {story.routes.map((route) => (
              <Card key={route.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{route.name}</h3>
                      <Badge variant="outline" className={difficultyColors[route.difficulty]}>
                        {route.difficulty}
                      </Badge>
                      {route.status === "PUBLISHED" && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">Publicada</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/games-template/${gameId}/stories/${storyId}/routes/${route.id}`}>
                        Ver Misiones
                      </Link>
                    </Button>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>📍 {route.distanceMeters}m</span>
                    <span>⏱ {route.estimatedMinutes}min</span>
                    <span>🎯 {(route.missions ?? []).length} misiones</span>
                  </div>
                  {/* Mini lista de misiones */}
                  {route.missions && route.missions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {route.missions.map((m, i) => (
                        <Badge key={m.id} variant="secondary" className="text-xs">
                          {i + 1}. {m.title}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {story.routes.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No hay rutas. ¡Crea la primera!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Endings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Flag className="h-5 w-5" />Finales Alternativos</CardTitle>
              <CardDescription>Desenlaces configurables según condiciones</CardDescription>
            </div>
            <Dialog open={openEnding} onOpenChange={setOpenEnding}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Nuevo Final</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Final Alternativo</DialogTitle>
                  <DialogDescription>Define un desenlace para la historia</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label>Nombre</label>
                    <Input value={endingName} onChange={(e) => setEndingName(e.target.value)} placeholder="Final Oscuro" />
                  </div>
                  <div className="grid gap-2">
                    <label>Descripción</label>
                    <Input value={endingDesc} onChange={(e) => setEndingDesc(e.target.value)} placeholder="Descripción del final..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenEnding(false)}>Cancelar</Button>
                  <Button disabled={!endingName.trim()} onClick={handleCreateEnding}>Crear Final</Button>
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
                <TableHead>Condiciones</TableHead>
                <TableHead>Narrativa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {story.endings.map((ending) => (
                <TableRow key={ending.id}>
                  <TableCell className="font-medium">{ending.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {ending.conditions ? JSON.stringify(ending.conditions) : "—"}
                  </TableCell>
                  <TableCell className="text-sm max-w-md truncate">{ending.narrative || "—"}</TableCell>
                </TableRow>
              ))}
              {story.endings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">Sin finales configurados</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

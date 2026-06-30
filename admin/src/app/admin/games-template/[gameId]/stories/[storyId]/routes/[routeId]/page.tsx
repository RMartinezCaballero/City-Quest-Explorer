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
  Plus,
  GripVertical,
  Trash2,
  Eye,
  QrCode,
  Puzzle,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com/api";

interface Challenge {
  id: string;
  type: string;
  prompt: string;
  hint1: string | null;
  hint2: string | null;
  hint3: string | null;
  hint4: string | null;
  orderIndex: number;
  penalty: number;
  answers?: Array<{ id: string; value: string; label: string | null; isCorrect: boolean }>;
  unlockKeys?: Array<{ id: string; type: string; keyValue: string }>;
}

interface Mission {
  id: string;
  title: string;
  narrative: string | null;
  description: string | null;
  orderIndex: number;
  difficulty: number;
  timeLimit: number | null;
  isLastMission: boolean;
  mediaUrl: string | null;
  checkpoint?: { id: string; name: string; latitude: number; longitude: number } | null;
  challenges?: Challenge[];
}

interface RouteDetail {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  distanceMeters: number;
  estimatedMinutes: number;
  isDefault: boolean;
  status: string;
  story?: { id: string; name: string };
  missions?: Mission[];
  checkpoints?: Array<{ id: string; name: string; latitude: number; longitude: number }>;
}

const challengeTypeColors: Record<string, string> = {
  SECRET_CODE: "bg-purple-100 text-purple-700",
  QR: "bg-blue-100 text-blue-700",
  NFC: "bg-cyan-100 text-cyan-700",
  TEXT: "bg-gray-100 text-gray-700",
  IMAGE: "bg-pink-100 text-pink-700",
  AUDIO: "bg-indigo-100 text-indigo-700",
  GEOLOCATION: "bg-green-100 text-green-700",
  AI: "bg-orange-100 text-orange-700",
  PHYSICAL_OBJECT: "bg-rose-100 text-rose-700",
};

export default function RouteDetailPage() {
  const params = useParams<{ gameId: string; storyId: string; routeId: string }>();
  const { gameId, storyId, routeId } = params;

  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Create mission dialog
  const [openMission, setOpenMission] = useState(false);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionNarrative, setMissionNarrative] = useState("");

  // Challenge dialog
  const [openChallenge, setOpenChallenge] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [challengeType, setChallengeType] = useState("SECRET_CODE");
  const [challengePrompt, setChallengePrompt] = useState("");

  async function loadRoute() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/routes/${routeId}`);
      if (res.ok) setRoute(await res.json());
    } catch (e) {
      console.error("Error loading route:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (routeId) loadRoute();
  }, [routeId]);

  async function handleCreateMission() {
    if (!route) return;
    try {
      const missions = route.missions ?? [];
      const res = await fetch(`${API_BASE}/routes/${routeId}/missions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: missionTitle,
          narrative: missionNarrative || undefined,
          orderIndex: missions.length,
          difficulty: 5,
        }),
      });
      if (res.ok) {
        setOpenMission(false);
        setMissionTitle("");
        setMissionNarrative("");
        loadRoute();
      }
    } catch (e) {
      console.error("Error creating mission:", e);
    }
  }

  async function handleCreateChallenge() {
    if (!selectedMissionId) return;
    try {
      const res = await fetch(`${API_BASE}/missions/${selectedMissionId}/challenges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: challengeType,
          prompt: challengePrompt,
          orderIndex: 0,
          answers: challengeType === "SECRET_CODE" ? [{ value: "", label: "Respuesta", isCorrect: true }] : undefined,
        }),
      });
      if (res.ok) {
        setOpenChallenge(false);
        setChallengeType("SECRET_CODE");
        setChallengePrompt("");
        setSelectedMissionId(null);
        loadRoute();
      }
    } catch (e) {
      console.error("Error creating challenge:", e);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando ruta...</div>;
  }

  if (!route) {
    return <div className="p-8 text-center text-muted-foreground">Ruta no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/games-template/${gameId}/stories/${storyId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{route.name}</h1>
            <p className="text-muted-foreground mt-1">
              {route.story?.name} — {route.distanceMeters}m · {route.estimatedMinutes}min
            </p>
          </div>
        </div>
      </div>

      {/* Missions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="h-5 w-5" />
                Misiones ({route.missions?.length ?? 0})
              </CardTitle>
              <CardDescription>
                Misiones ordenadas secuencialmente. Arrastrar para reordenar.
              </CardDescription>
            </div>
            <Dialog open={openMission} onOpenChange={setOpenMission}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Nueva Misión</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Misión</DialogTitle>
                  <DialogDescription>Añade una nueva misión jugable a la ruta</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label>Título</label>
                    <Input value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} placeholder="Título de la misión" />
                  </div>
                  <div className="grid gap-2">
                    <label>Narrativa (opcional)</label>
                    <Textarea value={missionNarrative} onChange={(e) => setMissionNarrative(e.target.value)} placeholder="Texto narrativo..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenMission(false)}>Cancelar</Button>
                  <Button disabled={!missionTitle.trim()} onClick={handleCreateMission}>Crear</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(route.missions ?? []).map((mission, index) => (
              <Card key={mission.id} className={`border-l-4 ${mission.isLastMission ? "border-l-amber-500" : "border-l-primary"}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{mission.title}</h3>
                          <Badge variant="secondary" className="text-xs">D{if (mission.difficulty)}</Badge>
                          {mission.isLastMission && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Última</Badge>
                          )}
                        </div>
                        {mission.narrative && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{mission.narrative}</p>
                        )}
                        {mission.checkpoint && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📍 {mission.checkpoint.name} ({mission.checkpoint.latitude.toFixed(4)}, {mission.checkpoint.longitude.toFixed(4)})
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedMissionId(mission.id);
                          setOpenChallenge(true);
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Reto
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  {/* Challenges inside this mission */}
                  {mission.challenges && mission.challenges.length > 0 && (
                    <div className="mt-3 pl-11 space-y-2">
                      {mission.challenges.map((ch) => (
                        <div key={ch.id} className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted/50">
                          <Badge variant="outline" className={`text-xs ${challengeTypeColors[ch.type] || ""}`}>
                            {ch.type}
                          </Badge>
                          <span className="flex-1 truncate">{ch.prompt}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(ch.answers ?? []).length} respuestas
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {(ch.unlockKeys ?? []).length} llaves
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {(route.missions ?? []).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No hay misiones en esta ruta. ¡Crea la primera!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Checkpoints Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Checkpoints de Referencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Coordenadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(route.checkpoints ?? []).map((cp) => (
                <TableRow key={cp.id}>
                  <TableCell className="font-medium">{cp.name}</TableCell>
                  <TableCell className="font-mono text-sm">{cp.latitude.toFixed(4)}, {cp.longitude.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Challenge Dialog */}
      <Dialog open={openChallenge} onOpenChange={setOpenChallenge}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Reto</DialogTitle>
            <DialogDescription>Añade un reto/enigma a la misión seleccionada</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Tipo de Reto</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={challengeType}
                onChange={(e) => setChallengeType(e.target.value)}
              >
                <option value="SECRET_CODE">Código Secreto</option>
                <option value="QR">QR</option>
                <option value="TEXT">Respuesta Textual</option>
                <option value="IMAGE">Imagen</option>
                <option value="AUDIO">Audio</option>
                <option value="GEOLOCATION">Geolocalización</option>
                <option value="AI">IA</option>
                <option value="NFC">NFC</option>
                <option value="PHYSICAL_OBJECT">Objeto Físico</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label>Enunciado</label>
              <Textarea
                value={challengePrompt}
                onChange={(e) => setChallengePrompt(e.target.value)}
                placeholder="¿Qué debe resolver el jugador?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenChallenge(false)}>Cancelar</Button>
            <Button disabled={!challengePrompt.trim()} onClick={handleCreateChallenge}>Crear Reto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

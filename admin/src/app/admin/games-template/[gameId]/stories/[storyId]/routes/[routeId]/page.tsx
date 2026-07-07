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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
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
  Navigation,
  Pencil,
} from "lucide-react";

const LeafletMap = dynamic(() => import("@/components/map/leaflet-map"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-muted animate-pulse rounded-lg flex items-center justify-center"><span className="text-muted-foreground">Cargando mapa...</span></div>,
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com";

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

  // Edit route dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    difficulty: "MEDIUM",
    distanceMeters: 4000,
    estimatedMinutes: 120,
  });

  // Create mission dialog
  const [openMission, setOpenMission] = useState(false);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionNarrative, setMissionNarrative] = useState("");

  // Challenge dialog
  const [openChallenge, setOpenChallenge] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [challengeType, setChallengeType] = useState("SECRET_CODE");
  const [challengePrompt, setChallengePrompt] = useState("");

  // Mission assignment
  const missions = route?.missions ?? [];
  const [selectedEasyIds, setSelectedEasyIds] = useState<string[]>([]);
  const [selectedMediumIds, setSelectedMediumIds] = useState<string[]>([]);
  const [selectedHardIds, setSelectedHardIds] = useState<string[]>([]);
  const [savingAssignments, setSavingAssignments] = useState(false);

  function syncSelectionFromMissions(list: Mission[]) {
    const first = list[0]?.id ?? null;
    const last = list[list.length - 1]?.id ?? null;
    setSelectedEasyIds((prev) => ensureFixed(prev, first, last, list));
    setSelectedMediumIds((prev) => ensureFixed(prev, first, last, list));
    setSelectedHardIds((prev) => ensureFixed(prev, first, last, list));
  }

  useEffect(() => {
    syncSelectionFromMissions(missions);
  }, [missions.length, missions[0]?.id, missions[missions.length - 1]?.id]);

  function ensureFixed(prev: string[], first: string | null, last: string | null, list: Mission[]) {
    const map = new Map(list.map((m) => [m.id, m]));
    const desired = new Set<string>();
    if (first) desired.add(first);
    if (last) desired.add(last);
    const merged = new Set(prev);

    for (const id of desired) {
      if (map.has(id)) merged.add(id);
    }
    return Array.from(merged);
  }

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
      const currentMissions = route.missions ?? [];
      const res = await fetch(`${API_BASE}/routes/${routeId}/missions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: missionTitle,
          narrative: missionNarrative || undefined,
          orderIndex: currentMissions.length,
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

  function openEditDialog() {
    if (!route) return;
    setEditForm({
      name: route.name,
      description: route.description,
      difficulty: route.difficulty,
      distanceMeters: route.distanceMeters,
      estimatedMinutes: route.estimatedMinutes,
    });
    setOpenEdit(true);
  }

  async function handleEditRoute() {
    try {
      const res = await fetch(`${API_BASE}/routes/${routeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          difficulty: editForm.difficulty,
          distanceMeters: Number(editForm.distanceMeters),
          estimatedMinutes: Number(editForm.estimatedMinutes),
        }),
      });
      if (res.ok) {
        setOpenEdit(false);
        loadRoute();
      }
    } catch (e) {
      console.error("Error updating route:", e);
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

  async function handleSyncAssignments() {
    if (!routeId) return;
    const first = missions[0]?.id ?? null;
    const last = missions[missions.length - 1]?.id ?? null;

    const sanitize = (ids: string[]) => {
      const set = new Set(ids);
      if (first) set.add(first);
      if (last) set.add(last);
      return missions.filter((m) => set.has(m.id)).map((m) => m.id);
    };

    const easyIds = sanitize(selectedEasyIds).slice(0, Math.max(5, Math.min(7, missions.length)));
    const mediumIds = sanitize(selectedMediumIds).slice(0, Math.max(8, Math.min(10, missions.length)));
    const hardIds = sanitize(selectedHardIds).slice(0, Math.max(10, Math.min(15, missions.length)));

    setSavingAssignments(true);
    try {
      const payloads = [
        { label: "Fácil", ids: easyIds },
        { label: "Media", ids: mediumIds },
        { label: "Difícil", ids: hardIds },
      ] as const;

      for (const batch of payloads) {
        const res = await fetch(`${API_BASE}/routes/${routeId}/missions`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ missionIds: batch.ids }),
        });
        if (!res.ok) throw new Error(`No se pudo guardar la variante ${batch.label}`);
      }

      alert("Asignaciones guardadas");
      loadRoute();
    } catch (e) {
      console.error(e);
      alert("Error guardando asignaciones");
    } finally {
      setSavingAssignments(false);
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
          <Link href={`/admin/games-template/${gameId}/stories/${storyId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{route.name}</h1>
            <p className="text-muted-foreground mt-1">
              {route.story?.name} — {route.distanceMeters}m · {route.estimatedMinutes}min
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={openEditDialog}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Missions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="h-5 w-5" />
                Misiones ({missions.length})
              </CardTitle>
              <CardDescription>
                Misiones ordenadas secuencialmente. Arrastrar para reordenar.
              </CardDescription>
            </div>
            <Dialog open={openMission} onOpenChange={setOpenMission}>
              <DialogTrigger render={<Button><Plus className="h-4 w-4 mr-2" />Nueva Misión</Button>} />
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
            {missions.map((mission, index) => (
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
                          <Badge variant="secondary" className="text-xs">{mission.difficulty}</Badge>
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
            {missions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No hay misiones en esta ruta. ¡Crea la primera!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mission assignment by difficulty ranges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="h-5 w-5" />
                Asignar misiones por dificultad
              </CardTitle>
              <CardDescription>
                Marca las misiones que forman parte de cada variante. La primera y última están fijas.
              </CardDescription>
            </div>
            <Button size="sm" variant="secondary" onClick={handleSyncAssignments} disabled={savingAssignments}>
              {savingAssignments ? "Guardando..." : "Guardar asignaciones"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <DifficultyMissionGroup title="Fácil" color="border-l-green-500" missions={missions} assignCount={7} selectedIds={selectedEasyIds} onChange={setSelectedEasyIds} />
          <DifficultyMissionGroup title="Media" color="border-l-blue-500" missions={missions} assignCount={10} selectedIds={selectedMediumIds} onChange={setSelectedMediumIds} />
          <DifficultyMissionGroup title="Difícil" color="border-l-red-500" missions={missions} assignCount={15} selectedIds={selectedHardIds} onChange={setSelectedHardIds} />
        </CardContent>
      </Card>

      {/* Map + Checkpoints */}
      {(route.checkpoints ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa de Ruta — {(route.checkpoints ?? []).length} checkpoints
            </CardTitle>
            <CardDescription>
              Marcadores en orden de recorrido. Primer checkpoint en verde.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LeafletMap
              points={(route.checkpoints ?? []).map((cp, i) => ({
                id: cp.id,
                name: cp.name,
                latitude: cp.latitude,
                longitude: cp.longitude,
                description: "Orden: " + (i + 1),
                color: i === 0 ? "#22c55e" : "#3b82f6",
              }))}
              height="400px"
              zoom={15}
              polyline={true}
              polylineColor="#22c55e"
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Coordenadas</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(route.checkpoints ?? []).map((cp, i) => (
                  <TableRow key={cp.id}>
                    <TableCell>
                      <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white " + (i === 0 ? "bg-green-500" : "bg-blue-500")}>
                        {i + 1}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{cp.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {cp.latitude.toFixed(4)}, {cp.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      <a
                        href={"https://www.google.com/maps?q=" + cp.latitude + "," + cp.longitude}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Navigation className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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

      {/* Edit Route Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ruta</DialogTitle>
            <DialogDescription>
              Modifica los datos de la ruta
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Nombre</label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <label>Descripción</label>
              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <label>Dificultad</label>
              <Select value={editForm.difficulty} onValueChange={(value) => setEditForm({ ...editForm, difficulty: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Fácil</SelectItem>
                  <SelectItem value="MEDIUM">Media</SelectItem>
                  <SelectItem value="HARD">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label>Distancia (m)</label>
                <Input type="number" value={editForm.distanceMeters} onChange={(e) => setEditForm({ ...editForm, distanceMeters: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <label>Duración (min)</label>
                <Input type="number" value={editForm.estimatedMinutes} onChange={(e) => setEditForm({ ...editForm, estimatedMinutes: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancelar</Button>
            <Button onClick={handleEditRoute}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DifficultyMissionGroup({
  title,
  color,
  missions,
  assignCount,
  selectedIds,
  onChange,
}: {
  title: string;
  color: string;
  missions: Mission[];
  assignCount: number;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const first = missions[0];
  const last = missions[missions.length - 1];

  const toggle = (id: string) => {
    const isFixed = [first?.id, last?.id].includes(id);
    if (isFixed) return;
    const set = new Set(selectedIds);
    if (set.has(id)) set.delete(id);
    else if (selectedIds.length < assignCount) set.add(id);
    onChange(Array.from(set));
  };

  return (
    <div className={"rounded-md border bg-background/60 p-3 " + color}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">{title} · objetivo {assignCount}</p>
        <span className="text-xs text-muted-foreground">{selectedIds.filter((id) => [first?.id, last?.id].includes(id) || selectedIds.includes(id)).length}/{assignCount}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {missions.map((mission, index) => {
          const isFirst = first?.id === mission.id;
          const isLast = last?.id === mission.id;
          const checked = isFirst || isLast || selectedIds.includes(mission.id);
          return (
            <label key={mission.id} className={"flex items-center gap-2 rounded-md border p-2 " + (checked ? "bg-muted/50" : "opacity-80")}>
              <input
                type="checkbox"
                className="h-4 w-4"
                disabled={isFirst || isLast}
                checked={checked}
                onChange={() => toggle(mission.id)}
              />
              <span className="text-xs">
                {isFirst ? "Misión 1" : isLast ? "Última" : `#${index + 1}`}
              </span>
            </label>
          );
        })}
      </div>
      {missions.length === 0 && (
        <p className="text-xs text-muted-foreground">Aún no hay misiones en esta ruta.</p>
      )}
    </div>
  );
}
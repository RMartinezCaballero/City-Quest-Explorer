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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Plus, Search, BookOpen } from "lucide-react";
import { useParams } from "next/navigation";

import { routesApi, citiesApi, type Route, type City } from "@/lib/api";

const difficultyColors: Record<string, string> = {
    EASY: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
    MEDIUM:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
    HARD: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
};

export default function HistoriesPage() {
    const params = useParams<{ cityId: string }>();
    const cityId = params.cityId;

    const [cities, setCities] = useState<City[]>([]);
    const city = useMemo(
        () => cities.find((c) => c.id === cityId),
        [cities, cityId]
    );

    const [loading, setLoading] = useState(true);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [search, setSearch] = useState("");

    // Create dialog state
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        distanceMeters: 0,
        estimatedMinutes: 60,
        difficulty: "EASY" as "EASY" | "MEDIUM" | "HARD",
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const [citiesData, routesData] = await Promise.all([
                    citiesApi.list(),
                    routesApi.list(cityId),
                ]);
                if (cancelled) return;
                setCities(citiesData);
                setRoutes(routesData);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (cityId) load();

        return () => {
            cancelled = true;
        };
    }, [cityId]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return routes;
        return routes.filter((r) =>
            [r.name, r.description]
                .filter(Boolean)
                .some((t) => (t as string).toLowerCase().includes(q))
        );
    }, [routes, search]);

    async function onCreate() {
        if (!cityId) return;
        setCreating(true);
        try {
            await routesApi.create(cityId, {
                name: form.name,
                description: form.description,
                distanceMeters: Number(form.distanceMeters),
                estimatedMinutes: Number(form.estimatedMinutes),
                difficulty: form.difficulty,
            });

            // reload
            const routesData = await routesApi.list(cityId);
            setRoutes(routesData);
            setOpen(false);
            setForm({
                name: "",
                description: "",
                distanceMeters: 0,
                estimatedMinutes: 60,
                difficulty: "EASY",
            });
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Historias</h1>
                    <p className="text-muted-foreground mt-1">
                        {city?.name
                            ? `Historias de ${city.name}`
                            : "Historias de la ciudad"}
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Historia
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Crear Nueva Historia</DialogTitle>
                            <DialogDescription>
                                Una historia (Ruta) contiene misiones (checkpoints) que luego
                                se ordenan para el juego.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-2">
                            <div className="grid gap-2">
                                <label>Nombre</label>
                                <Input
                                    placeholder="Nombre de la historia"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, name: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <label>Descripción</label>
                                <Input
                                    placeholder="Descripción narrativa"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, description: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label>Distancia (m)</label>
                                    <Input
                                        type="number"
                                        value={form.distanceMeters}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                distanceMeters: Number(e.target.value),
                                            }))
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label>Minutos estimados</label>
                                    <Input
                                        type="number"
                                        value={form.estimatedMinutes}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                estimatedMinutes: Number(e.target.value),
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label>Dificultad</label>
                                <Select
                                    value={form.difficulty}
                                    onValueChange={(v) =>
                                        setForm((p) => ({
                                            ...p,
                                            difficulty: v as "EASY" | "MEDIUM" | "HARD",
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EASY">EASY (Fácil)</SelectItem>
                                        <SelectItem value="MEDIUM">MEDIUM (Media)</SelectItem>
                                        <SelectItem value="HARD">HARD (Difícil)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button disabled={creating} onClick={onCreate}>
                                {creating ? "Creando..." : "Crear Historia"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar historias..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                        {loading ? "Cargando..." : `${filtered.length} historias`}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Dificultad</TableHead>
                                <TableHead>Distancia</TableHead>
                                <TableHead>Minutos</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium">{r.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={difficultyColors[r.difficulty]}
                                        >
                                            {r.difficulty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{Math.round(r.distanceMeters)} m</TableCell>
                                    <TableCell>{Math.round(r.estimatedMinutes)} min</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/locations/${cityId}/histories/${r.id}`}>
                                                <BookOpen className="h-4 w-4 mr-2 inline" />
                                                Misiones
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No hay historias para esta búsqueda.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}


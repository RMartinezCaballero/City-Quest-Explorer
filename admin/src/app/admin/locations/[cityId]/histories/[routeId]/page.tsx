
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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

import { routesApi, type Checkpoint, type Route } from "@/lib/api";

type CheckpointWithQr = Checkpoint & { qrCodes?: Array<{ id: string; code: string }> };

type RouteWithCheckpoints = Route & {
    checkpoints?: CheckpointWithQr[];
};

const difficultyColors: Record<string, string> = {

    EASY: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
    MEDIUM:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
    HARD: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
};

export default function HistoryDetailPage() {
    const params = useParams<{ cityId: string; routeId: string }>();
    const cityId = params.cityId;
    const routeId = params.routeId;

    const [loading, setLoading] = useState(true);
    const [route, setRoute] = useState<Route | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                if (!cityId || !routeId) return;
                const data = await routesApi.get(cityId, routeId);
                if (cancelled) return;
                setRoute(data);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [cityId, routeId]);

    const checkpoints: Checkpoint[] = useMemo(() => {
        if (!route?.checkpoints) return [];
        return [...route.checkpoints].sort((a, b) => a.orderIndex - b.orderIndex);
    }, [route]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Misiones</h1>
                    <p className="text-muted-foreground mt-1">
                        {loading
                            ? "Cargando..."
                            : route
                                ? `Historia: ${route.name}`
                                : "Historia no encontrada"}
                    </p>
                </div>
                <Button variant="outline">
                    <Link href={`/admin/locations/${cityId}/histories`}>Volver</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">Resumen</CardTitle>
                        {route?.difficulty && (
                            <Badge
                                variant="outline"
                                className={difficultyColors[route.difficulty]}
                            >
                                {route.difficulty}
                            </Badge>
                        )}
                    </div>
                    <CardDescription>
                        Las misiones de la historia provienen de los checkpoints ordenados.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="p-3 rounded-md bg-muted">
                            <div className="text-muted-foreground">Distancia</div>
                            <div className="font-semibold">{route ? Math.round(route.distanceMeters) : 0} m</div>
                        </div>
                        <div className="p-3 rounded-md bg-muted">
                            <div className="text-muted-foreground">Minutos estimados</div>
                            <div className="font-semibold">{route ? Math.round(route.estimatedMinutes) : 0} min</div>
                        </div>
                        <div className="p-3 rounded-md bg-muted">
                            <div className="text-muted-foreground"># Misiones</div>
                            <div className="font-semibold">{checkpoints.length}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Lista de Misiones (Checkpoints)</CardTitle>
                    <CardDescription>
                        MVP: el orden es por <code>orderIndex</code>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Misión</TableHead>
                                <TableHead>Coordenadas</TableHead>
                                <TableHead>QRs</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {checkpoints.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-mono text-muted-foreground">
                                        {c.orderIndex}
                                    </TableCell>
                                    <TableCell className="font-medium">{c.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {("qrCodes" in c && Array.isArray((c as { qrCodes?: unknown[] }).qrCodes) ? (c as { qrCodes?: unknown[] }).qrCodes?.length : 0)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && checkpoints.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No hay misiones en esta historia.
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


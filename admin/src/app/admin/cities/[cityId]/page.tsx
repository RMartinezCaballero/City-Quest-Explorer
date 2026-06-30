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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, MapPin, Globe, Gamepad2, Navigation } from "lucide-react";
import { citiesApi, routesApi, gamesTemplateApi, type City, type Route, type Game } from "@/lib/api";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/map/leaflet-map"), {
  ssr: false,
  loading: () => <div className="h-[450px] bg-muted animate-pulse rounded-lg flex items-center justify-center"><span className="text-muted-foreground">Cargando mapa...</span></div>
});

export default function CityDetailPage() {
  const params = useParams<{ cityId: string }>();
  const cityId = params.cityId;

  const [city, setCity] = useState<City | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityId) return;
    setLoading(true);
    Promise.all([
      citiesApi.get(cityId),
      gamesTemplateApi.listByCity(cityId),
      routesApi.list(cityId),
    ])
      .then(([cityData, gamesData, routesData]) => {
        setCity(cityData);
        setGames(gamesData);
        setRoutes(routesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cityId]);

  const mapPoints = routes.flatMap((route) =>
    (route.checkpoints ?? []).map((cp) => ({
      id: cp.id,
      name: cp.name,
      latitude: cp.latitude,
      longitude: cp.longitude,
      description: route.name + " - Orden: " + cp.orderIndex,
      color: cp.orderIndex === 1 ? "#22c55e" : "#3b82f6",
    }))
  );

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando ciudad...</div>;
  }

  if (!city) {
    return <div className="p-8 text-center text-muted-foreground">Ciudad no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/cities">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{city.name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Globe className="h-4 w-4" />{city.country}
            </p>
          </div>
        </div>
        <Link href={"/admin/games-template?cityId=" + city.id}>
          <Button><Gamepad2 className="h-4 w-4 mr-2" />Juegos</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Juegos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{games.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Rutas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{routes.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Checkpoints</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{mapPoints.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Estado</CardTitle></CardHeader><CardContent><Badge variant="outline" className="bg-green-50 text-green-700">{city.state || "ACTIVE"}</Badge></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de {city.name}
          </CardTitle>
          <CardDescription>
            {mapPoints.length > 0
              ? mapPoints.length + " checkpoints en " + routes.length + " rutas. Marcadores verdes = punto de inicio."
              : "No hay checkpoints configurados aun. Crea rutas con misiones para verlos en el mapa."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mapPoints.length > 0 && <LeafletMap points={mapPoints} height="450px" zoom={14} />}
          {mapPoints.length === 0 && (
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No hay checkpoints en esta ciudad</p>
                <Link href="/admin/games-template">
                  <Button variant="outline" size="sm" className="mt-3">Crear Juego</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Juegos en {city.name}</CardTitle>
          <CardDescription>{games.length} juegos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Duracion</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell><Badge variant="outline">{g.difficulty}</Badge></TableCell>
                  <TableCell>{g.durationMinutes} min</TableCell>
                  <TableCell><Badge variant="outline" className="bg-green-50 text-green-700">{g.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Link href={"/admin/games-template/" + g.id}>
                      <Button variant="ghost" size="sm"><Gamepad2 className="h-4 w-4 mr-1" />Ver</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {games.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay juegos en esta ciudad. <Link href="/admin/games-template" className="text-primary hover:underline">Crear juego</Link>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {mapPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Checkpoints
            </CardTitle>
            <CardDescription>Todos los puntos de geolocalizacion en esta ciudad</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Coordenadas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...mapPoints].sort((a, b) => a.name.localeCompare(b.name)).map((p, i) => (
                  <TableRow key={p.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.description ? p.description.split(" - ")[0] : ""}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

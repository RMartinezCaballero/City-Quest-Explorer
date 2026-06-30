"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Search, Plus, Gamepad2, BookOpen, Eye, MapPin } from "lucide-react";
import { citiesApi, type City } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://city-quest-explorer-api.onrender.com/api";

interface Game {
  id: string;
  cityId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  difficulty: string;
  status: string;
  maxPlayers: number;
  stories?: Array<{ id: string; name: string; status: string }>;
  city?: City;
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  HARD: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  PUBLISHED: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  ARCHIVED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
};

export default function GamesTemplatePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadAllGames() {
    setLoading(true);
    try {
      const citiesData = await citiesApi.list();
      setCities(citiesData);
      const allGames: Game[] = [];
      for (const city of citiesData) {
        const res = await fetch(`${API_BASE}/cities/${city.id}/games`);
        if (res.ok) {
          const cityGames = await res.json();
          allGames.push(...cityGames.map((g: Game) => ({ ...g, city })));
        }
      }
      setGames(allGames);
    } catch (e) {
      console.error("Error loading games:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllGames();
  }, []);

  const filtered = games.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.city?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Juegos</h1>
          <p className="text-muted-foreground mt-1">
            Juegos configurables por ciudad
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/locations">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Juego
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar juegos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <CardDescription>
            {loading ? "Cargando..." : `${filtered.length} juegos encontrados`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Gamepad2 className="h-4 w-4 inline mr-1" />Nombre</TableHead>
                <TableHead><MapPin className="h-4 w-4 inline mr-1" />Ciudad</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Jugadores</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Historias</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.name}</TableCell>
                  <TableCell>{game.city?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={difficultyColors[game.difficulty]}>
                      {game.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{game.durationMinutes} min</TableCell>
                  <TableCell>{game.maxPlayers}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[game.status]}>
                      {game.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{(game.stories ?? []).length}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/games-template/${game.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

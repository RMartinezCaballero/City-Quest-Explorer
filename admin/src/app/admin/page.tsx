"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  MapPin,
  Users,
  Gamepad2,
  Trophy,
  TrendingUp,
  Activity,
} from "lucide-react";
import { citiesApi, type City, type Route } from "@/lib/api";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await citiesApi.list();
        setCities(data);
      } catch (e) {
        console.error("Error loading cities:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statsCards = [
    {
      title: "Ciudades Activas",
      value: cities.length,
      icon: MapPin,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Jugadores",
      value: "—",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Juegos Activos",
      value: "—",
      icon: Gamepad2,
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/20",
    },
    {
      title: "Rankings",
      value: "—",
      icon: Trophy,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  const activityData = [
    { name: "Lun", juegos: 4 },
    { name: "Mar", juegos: 7 },
    { name: "Mié", juegos: 5 },
    { name: "Jue", juegos: 12 },
    { name: "Vie", juegos: 8 },
    { name: "Sáb", juegos: 15 },
    { name: "Dom", juegos: 9 },
  ];

  const difficultyData = [
    { name: "Fácil", value: 4 },
    { name: "Media", value: 5 },
    { name: "Difícil", value: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen general de City Quest Explorer
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <span className="text-muted-foreground animate-pulse">
                      ...
                    </span>
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.title === "Ciudades Activas" && "+0% vs mes anterior"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Actividad de Juegos (7 días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="juegos"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Difficulty Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Distribución por Dificultad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {difficultyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cities Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ciudades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-muted animate-pulse rounded-md"
                />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              <div className="grid grid-cols-4 gap-4 py-2 text-sm font-medium text-muted-foreground">
                <div>Nombre</div>
                <div>Slug</div>
                <div>País</div>
                <div>Estado</div>
              </div>
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="grid grid-cols-4 gap-4 py-3 text-sm"
                >
                  <div className="font-medium">{city.name}</div>
                  <div className="text-muted-foreground">{city.slug}</div>
                  <div className="text-muted-foreground">{city.country}</div>
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Activa
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  Trophy,
  Clock,
} from "lucide-react";

const weeklyData = [
  { day: "Lun", sesiones: 4, completados: 2, tiempo: 65 },
  { day: "Mar", sesiones: 7, completados: 5, tiempo: 72 },
  { day: "Mié", sesiones: 5, completados: 3, tiempo: 58 },
  { day: "Jue", sesiones: 12, completados: 8, tiempo: 70 },
  { day: "Vie", sesiones: 8, completados: 6, tiempo: 55 },
  { day: "Sáb", sesiones: 15, completados: 10, tiempo: 80 },
  { day: "Dom", sesiones: 9, completados: 7, tiempo: 62 },
];

const monthlyData = [
  { month: "Ene", jugadores: 12, sesiones: 8 },
  { month: "Feb", jugadores: 18, sesiones: 15 },
  { month: "Mar", jugadores: 25, sesiones: 22 },
  { month: "Abr", jugadores: 20, sesiones: 18 },
  { month: "May", jugadores: 30, sesiones: 28 },
  { month: "Jun", jugadores: 45, sesiones: 35 },
];

const topTeams = [
  { team: "Los Buscadores", score: 920, sessions: 5, avgTime: 68 },
  { team: "Aventureros", score: 850, sessions: 4, avgTime: 72 },
  { team: "Exploradores", score: 780, sessions: 6, avgTime: 55 },
  { team: "Los Piratas", score: 750, sessions: 3, avgTime: 82 },
  { team: "Navegantes", score: 620, sessions: 4, avgTime: 60 },
];

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground mt-1">
            Análisis de datos y métricas de rendimiento
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Jugadores Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">150</span>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Sesiones Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">89</span>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                +8%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">total acumulado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Tiempo Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">66</span>
              <span className="text-lg text-muted-foreground">min</span>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                <TrendingDown className="h-3 w-3 mr-1" />
                -3%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">por sesión</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Tasa de Retención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">72</span>
              <span className="text-lg text-muted-foreground">%</span>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                +5%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">jugadores que repiten</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Actividad Diaria
            </CardTitle>
            <CardDescription>Últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="sesiones"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Sesiones"
                />
                <Bar
                  dataKey="completados"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Completados"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo Promedio por Día
            </CardTitle>
            <CardDescription>Duración en minutos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="tiempo"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.2}
                  name="Minutos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Crecimiento Mensual
          </CardTitle>
          <CardDescription>Enero - Junio 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="jugadores"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Jugadores"
              />
              <Line
                type="monotone"
                dataKey="sesiones"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Sesiones"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Teams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Top Equipos
          </CardTitle>
          <CardDescription>Mejores puntajes de la temporada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {topTeams.map((t, i) => (
              <div
                key={t.team}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : i === 1
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          : i === 2
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{t.team}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.sessions} sesiones · ~{t.avgTime} min promedio
                    </p>
                  </div>
                </div>
                <span className="font-bold text-lg font-mono">{t.score}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

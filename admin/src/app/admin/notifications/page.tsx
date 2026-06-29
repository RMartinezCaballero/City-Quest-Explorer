"use client";

import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, UserCheck, Clock, Filter, CheckCheck, XCircle } from "lucide-react";

const initialNotifications = [
  { id: 1, type: "SESSION_STARTED", team: "Los Buscadores", actors: ["Carlos (Narrador)", "Ana (Guía)"], location: "Baluarte Santa Catalina", time: "10:30 AM", date: "2026-06-28", status: "pending", read: false },
  { id: 2, type: "SESSION_STARTED", team: "Aventureros", actors: ["Luis (Custodio)"], location: "Castillo San Felipe", time: "09:00 AM", date: "2026-06-28", status: "sent", read: true },
  { id: 3, type: "SESSION_STARTED", team: "Exploradores", actors: ["María (Guía)", "Pedro (Narrador)"], location: "Plaza de la Aduana", time: "11:15 AM", date: "2026-06-28", status: "pending", read: false },
  { id: 4, type: "SESSION_COMPLETED", team: "Los Piratas", actors: ["Carlos (Narrador)"], location: "Muelle de los Pegasos", time: "12:30 PM", date: "2026-06-27", status: "sent", read: true },
  { id: 5, type: "SESSION_STARTED", team: "Cartagena Team", actors: ["Ana (Guía)"], location: "Getsemaní", time: "02:00 PM", date: "2026-06-27", status: "cancelled", read: true },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  sent: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = notifications.filter(
    (n) => statusFilter === "all" || n.status === statusFilter
  );

  const pendingCount = notifications.filter((n) => n.status === "pending").length;

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, status: "sent" as const } : n))
    );
  };

  const handleCancel = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "cancelled" as const } : n))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
            {pendingCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {pendingCount} pendientes
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Notificaciones a actores freelance cuando inician sesiones de juego
          </p>
        </div>
        <Button variant="outline">
          <CheckCheck className="h-4 w-4 mr-2" />
          Marcar todas leídas
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="sent">Enviadas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            {filtered.length} notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Actores</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((notif) => (
                <TableRow
                  key={notif.id}
                  className={!notif.read ? "bg-muted/30" : ""}
                >
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        notif.type === "SESSION_STARTED"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {notif.type === "SESSION_STARTED" ? (
                        <><Bell className="h-3 w-3 mr-1" /> Inicio</>
                      ) : (
                        <><CheckCheck className="h-3 w-3 mr-1" /> Completo</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{notif.team}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {notif.actors.map((actor) => (
                        <Badge key={actor} variant="secondary" className="text-xs">
                          <UserCheck className="h-3 w-3 mr-1" />
                          {actor}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {notif.location}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {notif.date} {notif.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[notif.status]}
                    >
                      {notif.status === "pending"
                        ? "Pendiente"
                        : notif.status === "sent"
                          ? "Enviada"
                          : "Cancelada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {notif.status === "pending" && (
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notif.id)}
                        >
                          <CheckCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(notif.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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

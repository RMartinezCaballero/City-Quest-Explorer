"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, UserCheck, Clock, Filter, CheckCheck } from "lucide-react";
import { notificationsApi, type Notification } from "@/lib/api";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  sent: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadNotifications() {
    setLoading(true);
    try {
      const data = await notificationsApi.list();
      setNotifications(data);
    } catch (e) {
      console.error("Error loading notifications:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const filtered = notifications.filter(
    (n) => statusFilter === "all" || n.status === statusFilter
  );

  const pendingCount = notifications.filter((n) => n.status === "pending").length;

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
            {loading ? "Cargando..." : `${filtered.length} notificaciones`}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={(v) => { if (v !== null) setStatusFilter(v); }}>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((notif) => (
                <TableRow key={notif.id}>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Bell className="h-3 w-3 mr-1" /> Inicio
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{notif.teamName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {notif.actors?.map((actor) => (
                        <Badge key={actor} variant="secondary" className="text-xs">
                          <UserCheck className="h-3 w-3 mr-1" />{actor}
                        </Badge>
                      )) || "—"}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{notif.location}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[notif.status] || ""}>
                      {notif.status === "pending" ? "Pendiente" : notif.status === "sent" ? "Enviada" : "Cancelada"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay notificaciones
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

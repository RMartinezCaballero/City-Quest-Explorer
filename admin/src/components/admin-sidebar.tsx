"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  MapPin,
  Users,
  BarChart3,
  BookOpen,
  QrCode,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";

const navItems = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  { href: "/admin/games-template", icon: Gamepad2, label: "Juegos" },
  { href: "/admin/cities", icon: MapPin, label: "Ciudades" },
  { href: "/admin/missions", icon: BookOpen, label: "Misiones" },
  { href: "/admin/games", icon: Gamepad2, label: "Sesiones" },
  { href: "/admin/qr-codes", icon: QrCode, label: "QR Codes" },
  { href: "/admin/users", icon: Users, label: "Usuarios" },
  { href: "/admin/stats", icon: BarChart3, label: "Estadísticas" },
  { href: "/admin/notifications", icon: Bell, label: "Notificaciones" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar-background text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight">
            City Quest
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />
      {!collapsed && user && (
        <div className="px-4 py-2 text-xs text-muted-foreground truncate">
          {user.email}
        </div>
      )}
      <div className="p-2">
        <button
          onClick={signOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}

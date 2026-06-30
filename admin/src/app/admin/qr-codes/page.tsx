"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { Printer, Download, MapPin, Copy, Check, RefreshCw } from "lucide-react";
import { routesApi, citiesApi, type Checkpoint } from "@/lib/api";

export default function QrCodesPage() {
  const [checkpoints, setCheckpoints] = useState<(Checkpoint & { cityName?: string; routeName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  async function loadCheckpoints() {
    setLoading(true);
    try {
      const citiesData = await citiesApi.list();
      const allCheckpoints: (Checkpoint & { cityName?: string; routeName?: string })[] = [];

      for (const city of citiesData) {
        const routes = await routesApi.list(city.id);
        for (const route of routes) {
          if (route.checkpoints) {
            allCheckpoints.push(
              ...route.checkpoints.map((cp) => ({
                ...cp,
                cityName: city.name,
                routeName: route.name,
              }))
            );
          }
        }
      }

      setCheckpoints(allCheckpoints);
    } catch (e) {
      console.error("Error loading checkpoints:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCheckpoints();
  }, []);

  const handlePrint = () => window.print();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code || "");
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Codes</h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "Cargando..." : `${checkpoints.length} códigos QR de checkpoints`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCheckpoints}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground animate-pulse py-12">
          Cargando checkpoints...
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 print:grid-cols-5">
          {checkpoints.map((cp) => {
            const qrValue = `CQE-${cp.cityName?.toUpperCase() || "CITY"}-${cp.id.slice(0, 8)}`;
            return (
              <Card key={cp.id} className="print:break-inside-avoid">
                <CardHeader className="pb-3 text-center">
                  <Badge variant="outline" className="w-fit mx-auto mb-1">
                    #{cp.orderIndex}
                  </Badge>
                  <CardTitle className="text-sm leading-tight">{cp.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {cp.routeName} · {cp.cityName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-3">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCodeSVG
                      id={`qr-${cp.id}`}
                      value={qrValue}
                      size={160}
                      level="H"
                      includeMargin
                    />
                  </div>

                  <div className="w-full space-y-1 text-xs text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{cp.latitude.toFixed(4)}, {cp.longitude.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                        {qrValue}
                      </code>
                      <button onClick={() => handleCopyCode(qrValue)} className="text-muted-foreground hover:text-foreground">
                        {copied === qrValue ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {checkpoints.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No hay checkpoints disponibles. Crea rutas con checkpoints primero.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

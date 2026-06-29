"use client";

import { useState } from "react";
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
import { Printer, Download, MapPin, Copy, Check } from "lucide-react";

const checkpoints = [
  { id: 1, name: "Baluarte Santa Catalina", mission: "M1 — Juramento en la Muralla", code: "CQE-MP-01-CARTAGENA", lat: "10.4236", lng: "-75.5532" },
  { id: 2, name: "Plaza de la Aduana", mission: "M2 — La Aduana del Tiempo", code: "CQE-MP-02-CARTAGENA", lat: "10.4225", lng: "-75.5501" },
  { id: 3, name: "Castillo San Felipe", mission: "M3 — El Cálculo del Castillo", code: "CQE-MP-03-CARTAGENA", lat: "10.4231", lng: "-75.5403" },
  { id: 4, name: "La Popa", mission: "M4 — Viento de La Popa", code: "CQE-MP-04-CARTAGENA", lat: "10.4210", lng: "-75.5340" },
  { id: 5, name: "Camellón de los Mártires", mission: "M5 — Sendero con Tolerancia", code: "CQE-MP-05-CARTAGENA", lat: "10.4245", lng: "-75.5470" },
  { id: 6, name: "Getsemaní", mission: "M6 — Cifrado de Piedra", code: "CQE-MP-06-CARTAGENA", lat: "10.4247", lng: "-75.5525" },
  { id: 7, name: "Calle de la Amargura", mission: "M7 — Observación", code: "CQE-MP-07-CARTAGENA", lat: "10.4253", lng: "-75.5495" },
  { id: 8, name: "Bocagrande", mission: "M8 — Registro del Regreso", code: "CQE-MP-08-CARTAGENA", lat: "10.4080", lng: "-75.5550" },
  { id: 9, name: "Pastelillo", mission: "M9 — Peligro Controlado", code: "CQE-MP-09-CARTAGENA", lat: "10.4150", lng: "-75.5480" },
  { id: 10, name: "Muelle de los Pegasos", mission: "M10 — Capítulo Final", code: "CQE-MP-10-CARTAGENA", lat: "10.4200", lng: "-75.5430" },
];

export default function QrCodesPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (code: string, name: string) => {
    const svg = document.getElementById(`qr-${code}`);
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);

      const link = document.createElement("a");
      const fileName = name.replace(/[^a-zA-Z0-9]/g, "_");
      link.download = `QR_${fileName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Codes</h1>
          <p className="text-muted-foreground mt-1">
            Códigos QR imprimibles para las pruebas de campo en Cartagena
          </p>
        </div>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir Todo
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 print:grid-cols-5">
        {checkpoints.map((cp) => (
          <Card
            key={cp.id}
            className="print:break-inside-avoid print:shadow-none print:border"
          >
            <CardHeader className="pb-3 text-center">
              <Badge variant="outline" className="w-fit mx-auto mb-1">
                Checkpoint #{cp.id}
              </Badge>
              <CardTitle className="text-sm leading-tight">
                {cp.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {cp.mission}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG
                  id={`qr-${cp.code}`}
                  value={cp.code}
                  size={160}
                  level="H"
                  includeMargin
                />
              </div>

              <div className="w-full space-y-1 text-xs text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{cp.lat}, {cp.lng}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                    {cp.code}
                  </code>
                  <button
                    onClick={() => handleCopyCode(cp.code)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {copied === cp.code ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 w-full print:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(cp.code, cp.name)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  PNG
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

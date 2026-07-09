"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ArrowRight } from "lucide-react";

export default function PaymentSuccessClient() {
  const search = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const paymentId = search.get("paymentId") || search.get("external_reference");
  const accessCode = search.get("accessCode");
  const status = search.get("status");

  const displayCode = accessCode || process.env.NEXT_PUBLIC_DEMO_ACCESS_CODE || "";

  const handleCopy = async () => {
    if (!displayCode) return;
    await navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isDemo = status === "demo" || process.env.NEXT_PUBLIC_DEMO_ACCESS_CODE;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">
          {isDemo ? "Acceso de prueba" : "¡Pago exitoso!"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          {isDemo
            ? "Usa este código para ingresar a la app y comenzar tu experiencia."
            : "Tu pago fue aprobado. Usa este código en la app para iniciar tu aventura."}
        </p>

        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Código de acceso</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-center text-lg font-mono font-semibold">
              {displayCode || "—"}
            </code>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
              disabled={!displayCode}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <p className="text-xs text-center text-green-600 mt-2">Copiado</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => router.push("/login")}>
            Ir al login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/admin")}
          >
            Volver al panel
          </Button>
        </div>

        {paymentId && (
          <p className="text-center text-xs text-muted-foreground break-all">
            Ref: {paymentId}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

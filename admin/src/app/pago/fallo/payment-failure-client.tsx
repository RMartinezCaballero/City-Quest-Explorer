"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentFailureClient() {
  const search = useSearchParams();
  const router = useRouter();

  const reason = search.get("status") || search.get("failure_reason") || "Pago no completado";

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto rounded-full bg-destructive/10 p-3 w-fit">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl">Pago no completado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          No pudimos confirmar tu pago. Puedes intentarlo nuevamente o usar otro medio.
        </p>

        <div className="rounded-lg border bg-muted/50 p-4 text-center text-sm">
          Motivo: <span className="font-medium">{reason}</span>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={() => router.push("/admin/players")}
          >
            Reintentar compra
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/admin")}
          >
            Volver al panel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

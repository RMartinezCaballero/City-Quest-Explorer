import { Suspense } from "react";
import PaymentFailureClient from "./payment-failure-client";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-lg">
            <Card>
              <CardContent className="p-4">Cargando...</CardContent>
            </Card>
          </div>
        }
      >
        <PaymentFailureClient />
      </Suspense>
    </div>
  );
}

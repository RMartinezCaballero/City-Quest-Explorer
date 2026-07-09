import { Suspense } from "react";
import PaymentSuccessClient from "./payment-success-client";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-lg">
            <Card>
              <CardContent className="p-4">Cargando...</CardContent>
            </Card>
          </div>
        }
      >
        <PaymentSuccessClient />
      </Suspense>
    </div>
  );
}

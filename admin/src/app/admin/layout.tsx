import { AuthProvider } from "@/components/auth-provider";
import AuthGuard from "@/components/auth-guard";
import AdminSidebar from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}

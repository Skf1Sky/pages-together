import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Package, Users, Settings, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Shared for all admin pages */}
      <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 h-screen hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black">K</div>
          <span className="font-bold text-xl tracking-tight">KTNET <span className="text-xs font-medium text-muted-foreground ml-1">Admin</span></span>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
            { icon: Package, label: "Phần mềm", path: "/admin" },
            { icon: Users, label: "Người dùng", path: "/admin" },
            { icon: Settings, label: "Cấu hình", path: "/admin" },
          ].map((item, i) => (
            <Link 
              key={i} 
              to={item.path}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-muted-foreground hover:bg-secondary/50 hover:text-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="mt-auto flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="size-4" />
          Quay lại trang chủ
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

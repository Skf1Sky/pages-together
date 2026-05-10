import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Package, Users, Settings } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <Outlet />;
  }

  const adminSidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Phần mềm", icon: Package, path: "/admin" },
    { name: "Người dùng", icon: Users, path: "/admin" },
    { name: "Cấu hình", icon: Settings, path: "/admin" },
  ];

  return (
    <AppLayout 
      isAdmin={true} 
      showAdminLink={false} 
      sidebarItems={adminSidebarItems}
    >
      <Outlet />
    </AppLayout>
  );
}

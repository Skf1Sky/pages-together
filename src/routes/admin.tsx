import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Package, Users, MessageSquare } from "lucide-react";
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
    { name: "Phần mềm", icon: Package, path: "/admin/softwares" },
    { name: "Người dùng", icon: Users, path: "/admin/users" },
    { name: "Yêu cầu hỗ trợ", icon: MessageSquare, path: "/admin/support" },
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

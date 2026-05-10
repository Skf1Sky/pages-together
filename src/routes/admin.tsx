import { createFileRoute, Outlet, useLocation, redirect, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Package, Users, MessageSquare, Settings, UserCircle, LogOut } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { useAuthStore } from "@/lib/auth-store";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    // Check auth from localStorage since we can't use hooks here easily 
    // unless we pass context. For now, we'll check the persisted state.
    if (typeof window !== "undefined") {
      const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
      const isAuthenticated = auth?.state?.isAuthenticated;

      if (!isAuthenticated && location.pathname !== "/admin/login") {
        throw redirect({
          to: "/admin/login",
          search: {
            redirect: location.href,
          },
        });
      }
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, lastActive, updateActivity } = useAuthStore();
  const isLoginPage = pathname === "/admin/login";

  // Session Timeout Logic (30 minutes)
  useEffect(() => {
    if (!isAuthenticated || isLoginPage) return;

    const TIMEOUT = 30 * 60 * 1000; // 30 mins
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActive > TIMEOUT) {
        logout();
        toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
        navigate({ to: "/admin/login" });
      }
    }, 10000); // Check every 10s

    const activityHandler = () => updateActivity();
    window.addEventListener('mousemove', activityHandler);
    window.addEventListener('keydown', activityHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', activityHandler);
      window.removeEventListener('keydown', activityHandler);
    };
  }, [isAuthenticated, lastActive, logout, isLoginPage]);

  if (isLoginPage) {
    return <Outlet />;
  }

  const adminSidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Phần mềm", icon: Package, path: "/admin/softwares" },
    { name: "Người dùng", icon: Users, path: "/admin/users" },
    { name: "Hỗ trợ", icon: MessageSquare, path: "/admin/support", badge: 3 },
    { name: "Hồ sơ", icon: UserCircle, path: "/admin/profile" },
    { name: "Cài đặt", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <AppLayout 
      isAdmin={true} 
      showAdminLink={false} 
      sidebarItems={adminSidebarItems}
    >
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={() => {
            logout();
            toast.info("Đã đăng xuất khỏi hệ thống.");
            navigate({ to: "/admin/login" });
          }}
          className="h-11 px-5 rounded-xl bg-white/[0.03] border border-border text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2 font-bold text-xs"
        >
          <LogOut className="size-4" />
          Đăng xuất
        </button>
      </div>
      <Outlet />
    </AppLayout>
  );
}

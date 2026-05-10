import { createFileRoute, Outlet, useLocation, redirect, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Package, Users, MessageSquare, Settings, UserCircle, LogOut } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    // Check admin role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      toast.error("Bạn không có quyền truy cập trang quản trị.");
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const adminSidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Phần mềm", icon: Package, path: "/admin/softwares" },
    { name: "Người dùng", icon: Users, path: "/admin/users" },
    { name: "Hỗ trợ", icon: MessageSquare, path: "/admin/support", badge: 3 },
    { name: "Hồ sơ", icon: UserCircle, path: "/admin/profile" },
    { name: "Cài đặt", icon: Settings, path: "/admin/settings" },
  ];

  const activeTab = adminSidebarItems.find(item => item.path === pathname)?.name;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.info("Đã đăng xuất khỏi hệ thống.");
      navigate({ to: "/login" });
    } catch (error: any) {
      toast.error("Lỗi khi đăng xuất: " + error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AppLayout 
      isAdmin={true} 
      user={user as any}
      activeTab={activeTab}
      sidebarItems={adminSidebarItems}
    >
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-11 px-5 rounded-xl bg-white/[0.03] border border-border text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2 font-bold text-xs disabled:opacity-50"
        >
          <LogOut className="size-4" />
          {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
        </button>
      </div>
      <Outlet />
    </AppLayout>
  );
}

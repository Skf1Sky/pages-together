import { Link } from "@tanstack/react-router";
import { LogIn, Home, Package, LayoutGrid, Users, MessageSquare, Settings, Search, Bell } from "lucide-react";

export function AppLayout({ 
  children, 
  activeTab, 
  rightPanel, 
  sidebarItems,
  showAdminLink = true,
  isAdmin = false
}: { 
  children: React.ReactNode; 
  activeTab?: string; 
  rightPanel?: React.ReactNode;
  sidebarItems?: { name: string; icon: any; path: string }[];
  showAdminLink?: boolean;
  isAdmin?: boolean;
}) {
  const defaultItems = [
    { name: "Trang chủ", icon: Home, path: "/" },
    { name: "Danh mục", icon: LayoutGrid, path: "/" },
    { name: "Người dùng", icon: Users, path: "/" },
  ];

  const items = sidebarItems || defaultItems;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <div className={`mx-auto max-w-[1920px] p-5 grid grid-cols-1 lg:grid-cols-[280px_1fr] ${rightPanel ? "xl:grid-cols-[280px_1fr_340px]" : ""} gap-5`}>
        
        {/* SIDEBAR */}
        <aside className="hidden lg:flex flex-col justify-between h-[calc(100vh-40px)] sticky top-5 p-6 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-border rounded-[24px]">
          <div>
            <Link to="/" className="flex items-center gap-3.5 mb-10 group">
              <div className="relative size-[34px]">
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-2 w-full bg-[#d4d4d8] rounded-full rotate-45 transition-transform group-hover:rotate-[225deg] duration-500" />
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-2 w-full bg-primary rounded-full -rotate-45 transition-transform group-hover:-rotate-[135deg] duration-500" />
              </div>
              <h1 className="text-[28px] font-black tracking-tighter">
                {isAdmin ? (
                  <>X <span className="text-primary">Admin</span></>
                ) : (
                  <>X <span className="text-primary">Apps</span></>
                )}
              </h1>
            </Link>

            <nav className="flex flex-col gap-2.5">
              {items.map((item) => (
                <Link
                  key={item.name}
                  to={item.path as any}
                  className={`h-[54px] px-[18px] rounded-[16px] flex items-center gap-3.5 transition-all border border-transparent ${
                    activeTab === item.name
                      ? "bg-primary/10 border-primary/25 text-white"
                      : "text-muted-foreground hover:bg-white/[0.03] hover:border-border hover:text-white"
                  }`}
                >
                  <item.icon className={`size-[18px] ${activeTab === item.name ? "text-primary" : ""}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {showAdminLink && (
            <Link
              to="/admin/login"
              className="h-[54px] px-[18px] rounded-[16px] flex items-center gap-3.5 text-muted-foreground hover:bg-white/[0.03] hover:border-border hover:text-white transition-all border border-transparent"
            >
              <Settings className="size-[18px]" />
              <span className="font-medium">Quản trị</span>
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/"
              className="h-[54px] px-[18px] rounded-[16px] flex items-center gap-3.5 text-muted-foreground hover:bg-white/[0.03] hover:border-border hover:text-white transition-all border border-transparent"
            >
              <Home className="size-[18px]" />
              <span className="font-medium">Về trang chủ</span>
            </Link>
          )}
        </aside>

        {/* MAIN */}
        <main className="flex flex-col gap-5 min-w-0">
          {/* Topbar */}
          <header className="h-[74px] px-6 flex items-center justify-between bg-white/[0.02] border border-border rounded-[24px]">
            <div className="relative flex-1 max-w-[640px] hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm phần mềm..."
                className="w-full h-12 pl-12 pr-4 bg-[#111] border border-border rounded-[14px] focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <button className="size-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-border text-muted-foreground hover:text-white transition-colors">
                <Bell className="size-5" />
              </button>
              
              {!isAdmin && activeTab !== "Trang chủ" && (
                <div>
                  <div className="text-right hidden sm:block">
                    <div className="font-bold text-sm">Admin</div>
                    <div className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium">Quản trị viên</div>
                  </div>
                  <div className="size-[42px] rounded-full bg-[#1a1a1a] border border-border flex items-center justify-center overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" />
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="flex-1">
            {children}
          </div>
        </main>

        {/* RIGHT PANEL */}
        {rightPanel && (
          <aside>
            {rightPanel}
          </aside>
        )}
      </div>
    </div>
  );
}


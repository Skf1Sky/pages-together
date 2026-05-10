import { Link } from "@tanstack/react-router";
import { LogIn, Home, Package, LayoutGrid, Users, MessageSquare, Settings, Search, Bell, HardHat, Palette, Briefcase } from "lucide-react";

export function AppLayout({ 
  children, 
  activeTab, 
  rightPanel, 
  sidebarItems,
  isAdmin = false,
  onSearch,
  user
}: { 
  children: React.ReactNode; 
  activeTab?: string; 
  rightPanel?: React.ReactNode;
  sidebarItems?: { name: string; icon: any; path: string; search?: any }[];
  isAdmin?: boolean;
  onSearch?: (query: string) => void;
  user?: { name: string; role: 'admin' | 'user' } | null;
}) {
  const defaultItems = [
    { name: "Trang chủ", icon: Home, path: "/" },
    { name: "Xây Dựng", icon: HardHat, path: "/", search: { category: "Xây Dựng" } },
    { name: "Đồ Hoạ", icon: Palette, path: "/", search: { category: "Đồ Hoạ" } },
    { name: "Văn Phòng", icon: Briefcase, path: "/", search: { category: "Văn Phòng" } },
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
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-2 w-full bg-brand-red rounded-full -rotate-45 transition-transform group-hover:-rotate-[135deg] duration-500" />
              </div>
              <h1 className="text-[28px] font-black tracking-tighter">
                {isAdmin || user?.role === 'admin' ? (
                  <>X <span className="text-brand-red">Admin</span></>
                ) : (
                  <>X <span className="text-brand-red">Apps</span></>
                )}
              </h1>
            </Link>

            <nav className="flex flex-col gap-2.5">
              {items.map((item) => (
                <Link
                  key={item.name}
                  to={item.path as any}
                  search={item.search}
                  className={`h-[54px] px-[18px] rounded-[16px] flex items-center gap-3.5 transition-all border border-transparent ${
                    activeTab === item.name || (item.search?.category === activeTab)
                      ? "bg-primary/10 border-primary/25 text-white"
                      : "text-muted-foreground hover:bg-white/[0.03] hover:border-border hover:text-white"
                  }`}
                >
                  <item.icon className={`size-[18px] ${activeTab === item.name || (item.search?.category === activeTab) ? "text-primary" : ""}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-2">
            {(isAdmin || user?.role === 'admin') && (
              <Link
                to="/"
                className="h-[54px] px-[18px] rounded-[16px] flex items-center gap-3.5 text-muted-foreground hover:bg-white/[0.03] hover:border-border hover:text-white transition-all border border-transparent"
              >
                <Home className="size-[18px]" />
                <span className="font-medium">Về trang chủ</span>
              </Link>
            )}
            
            {!isAdmin && (
              <button
                onClick={() => (window as any).onSupportClick?.()}
                className="h-[54px] px-[18px] rounded-[16px] flex items-center gap-3.5 text-muted-foreground hover:bg-white/[0.03] hover:border-border hover:text-white transition-all border border-transparent"
              >
                <MessageSquare className="size-[18px]" />
                <span className="font-medium">Gửi yêu cầu hỗ trợ</span>
              </button>
            )}
          </div>
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
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-[#111] border border-border rounded-[14px] focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="size-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-border text-muted-foreground hover:text-white transition-colors">
                <Bell className="size-5" />
              </button>
              
              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center justify-end gap-2">
                      {user.role === 'admin' && (
                        <Link to="/admin" className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold hover:bg-primary/30 transition-colors">
                          QUẢN TRỊ
                        </Link>
                      )}
                      <div className="font-bold text-sm">
                        {user.role === 'admin' ? 'Admin' : user.name}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium">
                      {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </div>
                  </div>
                  <div className="size-[42px] rounded-full bg-[#1a1a1a] border border-border flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      alt="Avatar" 
                    />
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




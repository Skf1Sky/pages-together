import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogIn, Home, Package, LayoutGrid, Users, MessageSquare, Settings, Search, Bell, HardHat, Palette, Briefcase, Menu, X, Sun, Moon, ArrowUp } from "lucide-react";
import { Footer } from "./Footer";
import { useState, useEffect } from "react";

export function AppLayout({ 
  children, 
  activeTab, 
  rightPanel, 
  sidebarItems,
  isAdmin = false,
  onSearch,
  user,
  sidebarFooter
}: { 
  children: React.ReactNode; 
  activeTab?: string; 
  rightPanel?: React.ReactNode;
  sidebarItems?: { name: string; icon: any; path: string; search?: any }[];
  isAdmin?: boolean;
  onSearch?: (query: string) => void;
  user?: { name: string; role: 'admin' | 'user' } | null;
  sidebarFooter?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search }) || {} as any;
  const [localSearch, setLocalSearch] = useState((search as any)?.q || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultItems = [
    { name: "Trang chủ", icon: Home, path: "/" },
    { name: "Tất cả phần mềm", icon: Package, path: "/softwares" },
    { name: "Xây Dựng", icon: HardHat, path: "/softwares", search: { category: "Xây Dựng" } },
    { name: "Đồ Hoạ", icon: Palette, path: "/softwares", search: { category: "Đồ Hoạ" } },
    { name: "Văn Phòng", icon: Briefcase, path: "/softwares", search: { category: "Văn Phòng" } },
  ];

  const items = sidebarItems || defaultItems;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/softwares", search: { q: localSearch } });
  };

  const SidebarContent = () => (
    <>
      <div>
        <Link to="/" className="flex items-center gap-3.5 mb-10 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="relative size-[34px]">
            <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-2 w-full bg-muted-foreground/30 rounded-full rotate-45 transition-transform group-hover:rotate-[225deg] duration-500" />
            <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-2 w-full bg-brand-primary rounded-full -rotate-45 transition-transform group-hover:-rotate-[135deg] duration-500" />
          </div>
          <h1 className="text-[28px] font-black tracking-tighter">
            {isAdmin || user?.role === 'admin' ? (
              <>X <span className="text-brand-primary">Admin</span></>
            ) : (
              <>X <span className="text-brand-primary">Apps</span></>
            )}
          </h1>
        </Link>

        <nav className="flex flex-col gap-2.5">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.path as any}
              search={item.search}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`h-[54px] px-[18px] rounded-[16px] flex items-center justify-between transition-all border border-transparent ${
                activeTab === item.name || (item.search && typeof item.search === 'object' && (item.search as any).category === activeTab && activeTab !== "Trang chủ" && activeTab !== "Tất cả phần mềm")
                  ? "bg-primary/10 border-primary/25 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:border-border hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <item.icon className={`size-[18px] ${activeTab === item.name || (item.search && typeof item.search === 'object' && (item.search as any).category === activeTab && activeTab !== "Trang chủ" && activeTab !== "Tất cả phần mềm") ? "text-primary" : ""}`} />
                <span className="font-bold">{item.name}</span>
              </div>
              {(item as any).badge && (
                <span className="size-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-primary/20">
                  {(item as any).badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {!isAdmin && (
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="h-[54px] px-[18px] rounded-[16px] flex items-center gap-3.5 text-muted-foreground hover:bg-secondary transition-all border border-transparent"
          >
            <Users className="size-[18px]" />
            <span className="font-bold">Giới thiệu</span>
          </Link>

          <Link
            to="/support"
            onClick={() => setIsMobileMenuOpen(false)}
            className="h-[54px] px-[18px] rounded-[16px] flex items-center gap-3.5 text-muted-foreground hover:bg-secondary transition-all border border-transparent"
          >
            <MessageSquare className="size-[18px]" />
            <span className="font-bold">Hỗ trợ</span>
          </Link>
        </div>
      )}
      
      {sidebarFooter && (
        <div className="mt-auto pt-4">
          {sidebarFooter}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      <div className={`mx-auto max-w-[1920px] p-4 lg:p-5 grid grid-cols-1 lg:grid-cols-[280px_1fr] ${rightPanel ? "xl:grid-cols-[280px_1fr_340px]" : ""} gap-5`}>
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col justify-between h-[calc(100vh-40px)] sticky top-5 p-6 bg-card border border-border rounded-[32px] shadow-premium">
          <SidebarContent />
        </aside>

        {/* MOBILE SIDEBAR (Drawer) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-[280px] bg-card p-6 border-r border-border flex flex-col justify-between animate-in slide-in-from-left duration-300">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* MAIN */}
        <main className="flex flex-col gap-5 min-w-0">
          {/* Topbar */}
          <header className="h-[74px] px-6 flex items-center justify-between bg-card border border-border rounded-[24px] shadow-sm">
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden size-10 flex items-center justify-center rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground"
              >
                <Menu className="size-6" />
              </button>
              
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-[540px] hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phần mềm..."
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  className="w-full h-11 pl-12 pr-4 bg-secondary border border-border rounded-[14px] focus:outline-none focus:border-primary/50 transition-all font-medium"
                />
              </form>
            </div>

            <div className="flex items-center gap-4">
              <button className="size-10 flex items-center justify-center rounded-xl bg-secondary border border-border text-muted-foreground hover:text-primary transition-colors">
                <Bell className="size-5" />
              </button>
              
              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center justify-end gap-2">
                      {user.role === 'admin' && (
                        <Link to="/admin" className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black tracking-widest hover:bg-primary/30 transition-colors">
                          ADMIN
                        </Link>
                      )}
                      <div className="font-bold text-sm leading-none">
                        {user.name}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold mt-0.5">
                      {user.role === 'admin' ? 'Quản trị viên' : 'Hội viên'}
                    </div>
                  </div>
                  <div className="size-11 rounded-2xl bg-secondary border border-border flex items-center justify-center overflow-hidden shadow-sm">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      alt="Avatar" 
                    />
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="flex-1 min-h-[600px]">
            {children}
            <Footer />
          </div>
        </main>

        {/* RIGHT PANEL */}
        {rightPanel && (
          <aside className="hidden xl:block">
            {rightPanel}
          </aside>
        )}
      </div>

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-glow animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300 z-50 hover:scale-110 active:scale-95 transition-all"
        >
          <ArrowUp className="size-6" />
        </button>
      )}
    </div>
  );
}




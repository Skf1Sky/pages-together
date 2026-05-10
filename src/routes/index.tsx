import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Zap, Shield, Laptop, LayoutGrid, User, Lock, LogIn, ChevronRight, HardHat, Palette, Briefcase, LogOut, Settings, ExternalLink, Users, X, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSoftwares } from "@/lib/api/softwares";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type SoftwareSearch = {
  category?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): SoftwareSearch => {
    return {
      category: (search?.category as string) || undefined,
    };
  },
  loader: ({ search }) => getSoftwares(search?.category),
  component: Index,
  head: () => ({ 
    meta: [
      { title: "X Apps — Modern Software Hub" }, 
      { name: "description", content: "High-performance software upload & download platform." }
    ] 
  }),
});

import { toast } from "sonner";

function Index() {
  const { category } = Route.useSearch();
  const softwares = Route.useLoaderData() || [];
  const [searchQuery, setSearchQuery] = useState("");
  const { user, profile, isAdmin } = useAuth();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const navigate = useNavigate();

  const filteredSoftwares = Array.isArray(softwares) 
    ? softwares.filter((s: any) => {
        const matchesSearch = s?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    : [];

  const isHomePage = !category;

  const handleDownload = () => {
    toast.success("Đang khởi tạo liên kết tải xuống an toàn...");
  };

  useEffect(() => {
    (window as any).onSupportClick = () => {
      setIsSupportModalOpen(true);
    };
    return () => { delete (window as any).onSupportClick; };
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Đã đăng xuất");
  };

  const rightPanel = (
    <div className="flex flex-col gap-5">
      {/* USER / LOGIN CARD */}
      <div id="login-card" className="bg-card border border-border rounded-[28px] p-7 flex flex-col gap-6">
        {user ? (
          /* LOGGED IN VIEW */
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="size-[64px] rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                <img 
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="size-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight truncate max-w-[150px]">{profile?.full_name || user.email?.split('@')[0]}</h3>
                <p className="text-primary text-[13px] font-bold uppercase tracking-wider">
                  {isAdmin ? 'Quản trị viên' : 'Người dùng'}
                </p>
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            <div className="flex flex-col gap-2">
              {isAdmin && (
                <>
                  <Link 
                    to="/admin"
                    className="h-[52px] px-5 rounded-[14px] bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-between group hover:bg-primary hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="size-[18px]" />
                      <span>Trang quản trị</span>
                    </div>
                    <ChevronRight className="size-[18px] group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link 
                    to="/admin/users"
                    className="h-[52px] px-5 rounded-[14px] bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-between group hover:bg-primary hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="size-[18px]" />
                      <span>Quản lý người dùng</span>
                    </div>
                    <ChevronRight className="size-[18px] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
              
              <button className="h-[52px] px-5 rounded-[14px] bg-white/[0.03] border border-border text-foreground font-medium flex items-center gap-3 hover:bg-white/[0.06] transition-all">
                <User className="size-[18px] text-muted-foreground" />
                <span>Hồ sơ cá nhân</span>
              </button>

              <button 
                onClick={handleLogout}
                className="h-[52px] px-5 rounded-[14px] bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center gap-3 hover:bg-red-500 hover:text-white transition-all mt-2"
              >
                <LogOut className="size-[18px]" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        ) : (
          /* CLICKABLE LOGIN CARD */
          <Link 
            to="/login"
            className="flex flex-col gap-6 group cursor-pointer"
          >
            <div>
              <h3 className="text-[24px] font-extrabold tracking-tight mb-1 group-hover:text-primary transition-colors">Chào mừng!</h3>
              <p className="text-muted-foreground text-sm">Đăng nhập để quản lý phần mềm và tài khoản của bạn.</p>
            </div>

            <div className="h-[140px] rounded-[24px] bg-white/[0.02] border border-border flex flex-col items-center justify-center gap-4 group-hover:bg-primary/[0.04] group-hover:border-primary/30 transition-all">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <LogIn className="size-7" />
              </div>
              <span className="font-bold text-sm">Nhấn để đăng nhập hệ thống</span>
            </div>
          </Link>
        )}
      </div>

      {/* CALENDAR CARD */}
      <div className="bg-card border border-border rounded-[28px] p-7 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Lịch công việc</h3>
          <div className="text-muted-foreground text-sm font-medium">Tháng 5, 2026</div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <div key={day} className="text-[11px] font-bold text-muted-foreground uppercase mb-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <div
              key={date}
              className={`size-9 flex items-center justify-center rounded-xl text-sm transition-all cursor-pointer ${
                date === 10
                  ? "bg-primary text-white font-bold shadow-lg shadow-primary/20"
                  : "hover:bg-white/[0.03] text-[#d4d4d8]"
              }`}
            >
              {date}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-primary" />
            <div className="text-[13px] font-medium">Cập nhật hệ thống (14:00)</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-blue-500" />
            <div className="text-[13px] font-medium text-muted-foreground">Kiểm tra bảo mật</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout 
      activeTab={category || "Trang chủ"} 
      rightPanel={rightPanel}
      onSearch={setSearchQuery}
      user={user}
    >
      <div className="flex flex-col gap-5">
        
        {/* HERO - Only on Home */}
        {isHomePage && (
          <section className="relative overflow-hidden rounded-[30px] border border-primary/20 p-10 lg:p-16 bg-[#1A1A1A] bg-[radial-gradient(circle_at_top_right,rgba(197,164,126,0.15),transparent_40%)]">
            <div className="absolute top-[-180px] right-[-180px] size-[500px] border border-primary/10 rounded-full" />
            <div className="absolute top-[-120px] right-[-120px] size-[380px] border border-primary/10 rounded-full" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center h-[34px] px-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-[13px] font-bold mb-6">
                MODERN MINIMALIST
              </div>
              
              <h2 className="text-[60px] lg:text-[82px] font-black leading-none tracking-tighter mb-5">
                X <span className="text-brand-primary">APPS</span>
              </h2>
              
              <p className="text-muted-foreground text-lg max-w-[700px] leading-relaxed mb-10">
                Hệ thống upload & download phần mềm với giao diện dark mode hiện đại,
                tối ưu trải nghiệm người dùng và tốc độ tải.
              </p>
              
              <div className="flex flex-wrap gap-3.5">
                <button 
                  onClick={handleDownload}
                  className="h-[54px] px-8 rounded-[16px] bg-primary text-white font-bold text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                >
                  Khám phá ngay
                </button>
                <button 
                  onClick={handleDownload}
                  className="h-[54px] px-8 rounded-[16px] bg-[#191919] border border-border text-white font-bold text-[15px] hover:bg-white/[0.05] transition-all"
                >
                  Tải phần mềm
                </button>
              </div>
            </div>
          </section>
        )}

        {/* FEATURES - Only on Home */}
        {isHomePage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Modern Design", icon: LayoutGrid, desc: "Giao diện tối giản, hiện đại và dễ sử dụng." },
              { title: "Fast Download", icon: Zap, desc: "Hệ thống tối ưu tốc độ upload & download." },
              { title: "Secure System", icon: Shield, desc: "Kiểm soát dữ liệu và upload an toàn." },
              { title: "Total Apps", icon: Laptop, desc: `Hiện có tổng cộng ${softwares.length} phần mềm trên hệ thống.` },
            ].map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-[24px] p-6 group hover:border-primary/20 transition-colors">
                <div className="size-[52px] rounded-[16px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <f.icon className="size-6" />
                </div>
                <h4 className="mt-4 mb-2 text-lg font-bold">{f.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* APPS SECTION */}
        <section className="bg-card border border-border rounded-[28px] p-7">
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-[28px] font-extrabold tracking-tight">
              {category ? `${category}` : "Phần mềm nổi bật"}
            </h3>
            {!category && (
              <Link to="/softwares" className="text-primary text-sm font-bold hover:underline">
                Xem tất cả →
              </Link>
            )}
          </div>

          {filteredSoftwares.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredSoftwares.map((s) => (
                <div key={s?.id} className="bg-[#141414] border border-[#222] rounded-[24px] p-5 transition-all hover:-translate-y-1 hover:border-primary/25 group">
                  <div 
                    className="size-[72px] rounded-[20px] mb-4 flex items-center justify-center text-2xl font-black text-white"
                    style={{ background: s?.color ? `linear-gradient(135deg, ${s.color}, oklch(from ${s.color} l c h / 0.7))` : 'var(--primary)' }}
                  >
                    {s?.letter || '?'}
                  </div>
                  <div className="font-bold mb-1 truncate">{s?.name || 'Chưa đặt tên'}</div>
                  <div className="text-muted-foreground text-[13px] mb-4">{s?.category || 'Chưa phân loại'}</div>
                  <Link
                    to="/software/$id"
                    params={{ id: s?.id || '' }}
                    onClick={handleDownload}
                    className="w-full h-11 rounded-[14px] bg-primary text-white font-bold flex items-center justify-center group-hover:bg-primary/90 transition-colors"
                  >
                    Tải xuống
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="text-muted-foreground text-lg italic">Không tìm thấy phần mềm nào trong danh mục này.</div>
            </div>
          )}
        </section>

      </div>

      {/* SUPPORT MODAL */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsSupportModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsSupportModalOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="size-6" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <MessageSquare className="size-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">Yêu cầu hỗ trợ</h3>
                <p className="text-muted-foreground text-sm font-medium">Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("Đã gửi yêu cầu thành công!"); setIsSupportModalOpen(false); }} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Người gửi</label>
                <input 
                  disabled
                  value={user?.name || ""}
                  className="w-full h-14 px-5 bg-white/[0.03] border border-border rounded-xl text-muted-foreground font-bold cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tên lỗi / Vấn đề</label>
                <input 
                  required
                  placeholder="VD: Không tải được phần mềm Photoshop"
                  className="w-full h-14 px-5 bg-[#111] border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Mô tả chi tiết</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Vui lòng mô tả chi tiết lỗi bạn gặp phải..."
                  className="w-full p-5 bg-[#111] border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all font-medium resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full h-[56px] rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-4 flex items-center justify-center gap-2"
              >
                Gửi yêu cầu ngay
                <ChevronRight className="size-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOGIN ERROR POPUP */}
      {loginError && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-8 duration-500">
          <div className="bg-[#1A1A1A] border border-primary/50 rounded-2xl px-6 py-4 shadow-[0_0_40px_rgba(197,164,126,0.15)] flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <X className="size-5" />
            </div>
            <div>
              <div className="text-primary font-black text-sm uppercase tracking-widest">Thông báo lỗi</div>
              <div className="text-white font-bold">{loginError}</div>
            </div>
            <button 
              onClick={() => setLoginError(null)}
              className="ml-4 size-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}



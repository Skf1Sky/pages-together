import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Zap, Shield, Laptop, LayoutGrid, Upload, User, Lock, ChevronRight } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { softwares } from "@/lib/software-data";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ 
    meta: [
      { title: "X Apps — Modern Software Hub" }, 
      { name: "description", content: "High-performance software upload & download platform." }
    ] 
  }),
});

function Index() {
  const [active, setActive] = useState("Tất cả danh mục");

  const rightPanel = (
    <div className="flex flex-col gap-5">
      {/* LOGIN CARD */}
      <div className="bg-card border border-border rounded-[28px] p-7 flex flex-col gap-6">
        <div>
          <h3 className="text-[24px] font-extrabold tracking-tight mb-1">Chào mừng!</h3>
          <p className="text-muted-foreground text-sm">Đăng nhập để quản lý phần mềm của bạn.</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="size-[18px]" />
            </div>
            <input
              placeholder="Email hoặc Tên đăng nhập"
              className="w-full h-[52px] pl-12 pr-4 bg-[#151515] border border-border rounded-[14px] focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="size-[18px]" />
            </div>
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full h-[52px] pl-12 pr-4 bg-[#151515] border border-border rounded-[14px] focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <button className="w-full h-[54px] rounded-[14px] bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
          Đăng nhập
          <ChevronRight className="size-[18px]" />
        </button>

        <div className="text-center">
          <span className="text-muted-foreground text-sm">Chưa có tài khoản? </span>
          <button className="text-primary text-sm font-bold hover:underline">Đăng ký ngay</button>
        </div>
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
    <AppLayout activeTab="Trang chủ" rightPanel={rightPanel}>
      <div className="flex flex-col gap-5">
        
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[30px] border border-primary/20 p-10 lg:p-16 bg-[#1A1A1A] bg-[radial-gradient(circle_at_top_right,rgba(197,164,126,0.15),transparent_40%)]">
          <div className="absolute top-[-180px] right-[-180px] size-[500px] border border-primary/10 rounded-full" />
          <div className="absolute top-[-120px] right-[-120px] size-[380px] border border-primary/10 rounded-full" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center h-[34px] px-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-[13px] font-bold mb-6">
              MODERN MINIMALIST
            </div>
            
            <h2 className="text-[60px] lg:text-[82px] font-black leading-none tracking-tighter mb-5">
              X <span className="text-primary">APPS</span>
            </h2>
            
            <p className="text-muted-foreground text-lg max-w-[700px] leading-relaxed mb-10">
              Hệ thống upload & download phần mềm với giao diện dark mode hiện đại,
              tối ưu trải nghiệm người dùng và tốc độ tải.
            </p>
            
            <div className="flex flex-wrap gap-3.5">
              <button className="h-[54px] px-8 rounded-[16px] bg-primary text-white font-bold text-[15px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                Khám phá ngay
              </button>
              <button className="h-[54px] px-8 rounded-[16px] bg-[#191919] border border-border text-white font-bold text-[15px] hover:bg-white/[0.05] transition-all">
                Tải phần mềm
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Modern Design", icon: LayoutGrid, desc: "Giao diện tối giản, hiện đại và dễ sử dụng." },
            { title: "Fast Download", icon: Zap, desc: "Hệ thống tối ưu tốc độ upload & download." },
            { title: "Secure System", icon: Shield, desc: "Kiểm soát dữ liệu và upload an toàn." },
            { title: "Developer Focus", icon: Laptop, desc: "Thiết kế dành cho cộng đồng developer." },
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

        {/* APPS SECTION */}
        <section className="bg-card border border-border rounded-[28px] p-7">
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-[28px] font-extrabold tracking-tight">Phần mềm nổi bật</h3>
            <Link to="/" className="text-primary text-sm font-bold hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {softwares.slice(0, 4).map((s) => (
              <div key={s.id} className="bg-[#141414] border border-[#222] rounded-[24px] p-5 transition-all hover:-translate-y-1 hover:border-primary/25 group">
                <div 
                  className="size-[72px] rounded-[20px] mb-4 flex items-center justify-center text-2xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${s.color}, oklch(from ${s.color} l c h / 0.7))` }}
                >
                  {s.letter}
                </div>
                <div className="font-bold mb-1 truncate">{s.name}</div>
                <div className="text-muted-foreground text-[13px] mb-4">{s.category}</div>
                <Link
                  to="/software/$id"
                  params={{ id: s.id }}
                  className="w-full h-11 rounded-[14px] bg-primary text-white font-bold flex items-center justify-center group-hover:bg-primary/90 transition-colors"
                >
                  Tải xuống
                </Link>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}

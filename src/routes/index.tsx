import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Star, RefreshCw, ArrowRight, Zap, Shield, MousePointer2 } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { softwares, categories } from "@/lib/software-data";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [{ title: "KTNET — Tìm kiếm. Tải về. Chia sẻ." }, { name: "description", content: "Kho phần mềm an toàn cho Windows: trình duyệt, công cụ lập trình, ảo hóa và hơn thế nữa." }] }),
});

function Index() {
  const [active, setActive] = useState("Tất cả danh mục");
  const list = active === "Tất cả danh mục" ? softwares : softwares.filter((s) => s.category === active);

  return (
    <AppLayout activeTab="Trang chủ">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30">
          <div className="absolute top-0 right-0 size-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 size-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
            <Zap className="size-3" /> Nền tảng phần mềm thế hệ mới
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8">
            Tìm kiếm. Tải về. <br />
            <span className="text-gradient">Trải nghiệm đỉnh cao.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12 leading-relaxed">
            Khám phá kho ứng dụng đồ sộ, được kiểm duyệt nghiêm ngặt. <br className="hidden md:block" />
            An toàn tuyệt đối, tốc độ tối đa cho mọi nhu cầu của bạn.
          </p>

          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-[oklch(0.55_0.22_270)] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-6 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm phần mềm, công cụ và hơn thế nữa..."
                className="w-full pl-16 pr-32 h-18 rounded-2xl border border-border/50 bg-card shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-lg transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                Tìm ngay
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-muted-foreground font-medium">Xu hướng:</span>
            {["Adobe 2024", "Office 365", "AutoCAD", "SketchUp", "Visual Studio"].map((t) => (
              <button key={t} className="px-4 py-1.5 rounded-full bg-card border border-border hover:border-primary/50 hover:text-primary transition-all text-xs font-medium">
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        {/* Category Filters */}
        <div className="sticky top-20 z-40 py-4 glass rounded-2xl mb-12 flex flex-wrap gap-2 justify-center border border-border/50 shadow-premium">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${active === c ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105" : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Software Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {list.map((s) => (
            <Link
              key={s.id}
              to="/software/$id"
              params={{ id: s.id }}
              className="group relative flex flex-col bg-card border border-border/50 rounded-[2rem] p-6 transition-all hover:border-primary/30 hover:shadow-hover hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowRight className="size-4" />
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div
                  className="size-20 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl group-hover:rotate-6 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${s.color}, oklch(from ${s.color} l c h / 0.7))` }}
                >
                  {s.letter}
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 font-medium bg-secondary/50 inline-block px-3 py-1 rounded-full">{s.version} · {s.size}</p>
                
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`size-3 ${i <= 4 ? "fill-orange-400 text-orange-400" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold ml-1">{s.rating}</span>
                  <span className="text-xs text-muted-foreground">({s.reviews})</span>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <div className="h-10 flex-1 bg-primary text-primary-foreground font-bold text-sm rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                    Tải về ngay
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Section */}
        <div className="mt-16 text-center">
          <button className="group px-8 py-4 rounded-2xl bg-card border border-border font-bold hover:border-primary transition-all inline-flex items-center gap-3">
            <RefreshCw className="size-5 group-hover:rotate-180 transition-transform duration-700" />
            Khám phá thêm ứng dụng
          </button>
        </div>

        {/* Trust Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-12 border-t border-border/50 pt-20">
          {[
            { icon: Shield, title: "An toàn tuyệt đối", desc: "Mọi tệp tin đều được quét virus bởi 50+ công cụ bảo mật hàng đầu thế giới." },
            { icon: Zap, title: "Tải về siêu tốc", desc: "Hệ thống CDN toàn cầu giúp bạn tải phần mềm với tốc độ đường truyền tối đa." },
            { icon: MousePointer2, title: "Cài đặt 1-Click", desc: "Hỗ trợ cài đặt tự động, không quảng cáo, không phần mềm rác đi kèm." },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                <f.icon className="size-7" />
              </div>
              <h4 className="font-bold text-xl mb-3">{f.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

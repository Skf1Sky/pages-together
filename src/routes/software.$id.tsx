import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ShieldCheck, Download, Check, AlertCircle, Star, MessageSquare, Users, Copy, ChevronRight, HardHat, Cpu, Monitor, Save, Share2, Eye, Database } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { getSoftwareBySlug, getSoftwares } from "@/lib/api/softwares";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/software/$id")({
  component: SoftwareDetail,
  loader: async ({ params }) => {
    try {
      const sw = await getSoftwareBySlug(params.id);
      if (!sw) throw notFound();
      
      // Also fetch related softwares
      const related = await getSoftwares(sw?.category);
      
      return { 
        software: sw, 
        related: related.filter((r: any) => r.id !== sw.id).slice(0, 4) 
      };
    } catch (e) {
      throw notFound();
    }
  },
  notFoundComponent: () => (
    <AppLayout>
      <div className="px-10 py-20 text-center">
        <div className="size-24 bg-white/[0.03] border border-border rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
          <AlertCircle className="size-12" />
        </div>
        <h1 className="text-3xl font-black mb-4">Không tìm thấy phần mềm</h1>
        <p className="text-muted-foreground mb-8">Phần mềm bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link to="/" className="h-12 px-8 rounded-xl bg-primary text-white font-bold inline-flex items-center justify-center">
          Quay lại trang chủ
        </Link>
      </div>
    </AppLayout>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-red-500 font-bold">{error.message}</div>,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.software?.name ?? "Phần mềm"} — X Apps` },
      { name: "description", content: loaderData?.software?.description ?? "Chi tiết phần mềm và link tải an toàn." },
    ],
  }),
});

function SoftwareDetail() {
  const loaderData = Route.useLoaderData();
  if (!loaderData || !loaderData.software) return null;
  
  const { software: s, related: relatedSoftwares } = loaderData;
  const [activeImg, setActiveImg] = useState(0);
  
  // Mock screenshots if missing
  const screenshots = (s as any).screenshots?.length > 0 ? (s as any).screenshots : [
    `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80`,
    `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80`,
    `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80`
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép link trang này!");
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-3 text-sm font-bold text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="size-4 shrink-0" />
          <Link to="/softwares" search={{ category: s?.category }} className="hover:text-primary transition-colors">{s?.category || 'Phần mềm'}</Link>
          <ChevronRight className="size-4 shrink-0" />
          <span className="text-white truncate">{s.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* HERO CARD */}
            <div className="bg-card border border-border rounded-[32px] p-8 lg:p-12 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 size-64 bg-primary/5 blur-[100px] -z-10" />
              
              <div className="flex flex-col md:flex-row gap-10">
                <div
                  className="size-32 lg:size-40 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl shrink-0 mx-auto md:mx-0"
                  style={{ background: `linear-gradient(135deg, ${s.color}, oklch(from ${s.color} l c h / 0.7))` }}
                >
                  {s.letter}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                    <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest border border-primary/20">{s?.category || 'Phần mềm'}</span>
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-green-500/10 text-green-500 text-[11px] font-black uppercase tracking-widest border border-green-500/20">
                      <ShieldCheck className="size-3.5" /> An toàn
                    </span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">{s.name}</h1>
                  
                  <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground font-bold mb-8">
                    <div className="flex items-center gap-2">
                      <Star className="size-4 text-primary fill-primary" />
                      <span className="text-white">{s.rating}</span>
                      <span>({s.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="size-4" />
                      <span className="text-white">{s.downloads || "1.2K+"} tải</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="size-4" />
                      <span className="text-white">5.4K xem</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <button 
                      onClick={() => toast.success("Đang chuẩn bị link tải xuống...")}
                      className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-lg hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all flex items-center gap-3"
                    >
                      <Download className="size-6" />
                      Tải về ngay
                    </button>
                    <button 
                      onClick={handleCopyLink}
                      className="size-14 rounded-2xl bg-white/[0.03] border border-border flex items-center justify-center text-white hover:bg-white/[0.08] transition-all"
                      title="Chia sẻ link"
                    >
                      <Share2 className="size-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SCREENSHOT GALLERY */}
            <div className="bg-card border border-border rounded-[32px] p-8 overflow-hidden">
              <h3 className="text-2xl font-black mb-6">Ảnh chụp màn hình</h3>
              <div className="flex flex-col gap-4">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-border">
                  <img src={screenshots[activeImg]} alt="Screenshot" className="size-full object-cover animate-in fade-in duration-500" loading="lazy" />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {screenshots.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImg(i)}
                      className={`relative size-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${activeImg === i ? "border-primary scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt="Thumb" className="size-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* VERSIONS */}
            <div className="bg-card border border-border rounded-[32px] overflow-hidden">
              <div className="p-8 border-b border-border flex items-center justify-between">
                <h2 className="text-2xl font-black">Danh sách phiên bản</h2>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-white/[0.03] px-3 py-1 rounded-lg border border-border">Cập nhật: {s.versions[0]?.d}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-border">
                    {s.versions.map((ver, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">{ver.v}</span>
                            {i === 0 && <span className="px-2 py-0.5 rounded-md bg-primary text-[10px] font-black uppercase text-white shadow-lg shadow-primary/20">Mới</span>}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 font-medium">{ver.d} • {ver.s}</div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => toast.success(`Đang tải phiên bản ${ver.v}...`)}
                            className="h-10 px-6 rounded-xl bg-white/[0.05] border border-border text-white font-bold text-sm hover:bg-primary hover:border-primary transition-all"
                          >
                            Tải về
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="bg-card border border-border rounded-[32px] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Đánh giá người dùng</h3>
                <button className="text-primary font-bold text-sm hover:underline">Viết đánh giá</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                <div className="md:col-span-4 flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-border rounded-[24px]">
                  <div className="text-6xl font-black text-white mb-2">{s.rating}</div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`size-5 ${i <= Math.floor(s.rating) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <div className="text-muted-foreground text-sm font-bold">{s.reviews} nhận xét</div>
                </div>

                <div className="md:col-span-8 flex flex-col justify-center gap-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-4">
                      <div className="w-6 text-sm font-bold text-muted-foreground">{star}★</div>
                      <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${star === 5 ? 85 : star === 4 ? 12 : 3}%` }} 
                        />
                      </div>
                      <div className="w-10 text-xs font-bold text-muted-foreground text-right">{star === 5 ? "85%" : star === 4 ? "12%" : "3%"}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { user: "Thành Đạt", date: "02/05/2024", comment: "Bản này cài đặt rất ổn định, không bị lỗi crack. Cảm ơn admin!", rating: 5 },
                  { user: "Minh Quân", date: "28/04/2024", comment: "Tốc độ tải nhanh thật sự, 3GB mà tải mất có 5 phút.", rating: 5 },
                ].map((rev, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-border rounded-[24px]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {rev.user.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{rev.user}</div>
                          <div className="text-[11px] text-muted-foreground font-medium">{rev.date}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`size-3 ${j < rev.rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* SYSTEM REQUIREMENTS */}
            <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <Monitor className="size-5 text-primary" />
                Yêu cầu hệ thống
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="size-10 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center shrink-0">
                    <Cpu className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">CPU</div>
                    <div className="text-sm font-bold text-white">{s.requirements?.cpu || "Core i5 Gen 10 hoặc tương đương"}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-10 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center shrink-0">
                    <Save className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">RAM</div>
                    <div className="text-sm font-bold text-white">{s.requirements?.ram || "8 GB RAM trở lên"}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-10 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center shrink-0">
                    <Database className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Disk</div>
                    <div className="text-sm font-bold text-white">{s.requirements?.disk || "Ít nhất 10 GB trống"}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-10 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center shrink-0">
                    <Users className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Hệ điều hành</div>
                    <div className="text-sm font-bold text-white">{s.requirements?.os || "Windows 10/11 64-bit"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* INSTALLATION GUIDE MINI */}
            <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <AlertCircle className="size-5 text-primary" />
                Hướng dẫn nhanh
              </h3>
              <ul className="space-y-4">
                {[
                  "Tải và giải nén tệp tin",
                  "Chạy file setup.exe",
                  "Copy file crack vào thư mục cài",
                  "Mở app và sử dụng"
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="size-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5">{i+1}</div>
                    <span className="text-sm font-medium text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RELATED SOFTWARES */}
            <div className="bg-card border border-border rounded-[32px] p-8">
              <h3 className="text-xl font-black mb-6">Phần mềm liên quan</h3>
              <div className="flex flex-col gap-5">
                {relatedSoftwares.map((sw) => (
                  <Link 
                    key={sw.id} 
                    to="/software/$id" 
                    params={{ id: sw.id }}
                    className="flex items-center gap-4 group p-2 -m-2 rounded-2xl hover:bg-white/[0.03] transition-all"
                  >
                    <div 
                      className="size-14 rounded-xl flex items-center justify-center text-xl font-black text-white shrink-0 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${sw.color}, oklch(from ${sw.color} l c h / 0.7))` }}
                    >
                      {sw.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">{sw.name}</div>
                      <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{sw?.category || 'Phần mềm'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

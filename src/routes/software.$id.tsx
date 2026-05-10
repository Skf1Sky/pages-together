import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ShieldCheck, Download, Check, AlertCircle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { softwares } from "@/lib/software-data";

export const Route = createFileRoute("/software/$id")({
  component: SoftwareDetail,
  loader: ({ params }) => {
    const sw = softwares.find((s) => s.id === params.id);
    if (!sw) throw notFound();
    return sw;
  },
  notFoundComponent: () => (
    <AppLayout>
      <div className="px-10 py-20 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy phần mềm</h1>
        <Link to="/" className="text-primary underline mt-4 inline-block">Quay lại trang chủ</Link>
      </div>
    </AppLayout>
  ),
  errorComponent: ({ error }) => <div className="p-10">{error.message}</div>,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Phần mềm"} — KTNET` },
      { name: "description", content: loaderData?.description ?? "Chi tiết phần mềm" },
    ],
  }),
});

function StatBox({ icon: Icon, value, label, accent }: { icon: any; value: string; label: string; accent?: string }) {
  return (
    <div className="flex-1 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors">
      <div className={`size-12 rounded-xl bg-secondary flex items-center justify-center ${accent ?? "text-primary"}`}>
        <Icon className="size-6 shrink-0" />
      </div>
      <div>
        <div className="font-bold text-lg">{value}</div>
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

function SoftwareDetail() {
  const s = Route.useLoaderData();

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-12 group">
          <div className="size-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="size-4" />
          </div>
          Quay lại khám phá
        </Link>

        <div className="bg-card border border-border/50 rounded-[3rem] p-10 lg:p-16 shadow-premium relative overflow-hidden">
          {/* Background Decorative Glow */}
          <div className="absolute top-0 right-0 size-64 bg-primary/5 blur-[100px] -z-10" />
          
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
            <div
              className="size-40 lg:size-48 rounded-[3rem] flex items-center justify-center text-7xl font-black text-white shadow-2xl shrink-0 animate-float"
              style={{ background: `linear-gradient(135deg, ${s.color}, oklch(from ${s.color} l c h / 0.7))` }}
            >
              {s.letter}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">{s.category}</span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 text-xs font-black uppercase tracking-widest">
                  <ShieldCheck className="size-4" /> An toàn tuyệt đối
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">{s.name}</h1>
              
              <p className="text-muted-foreground leading-relaxed text-xl mb-10 max-w-2xl">
                {s.description || "Một trong những công cụ hàng đầu giúp tối ưu hóa hiệu suất làm việc và giải trí trên Windows."}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-5">
                <button className="px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-xl hover:shadow-hover hover:-translate-y-1 transition-all flex items-center gap-3">
                  <Download className="size-6" />
                  Tải về ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Versions Table */}
        <div className="mt-16 bg-card border border-border/50 rounded-[2.5rem] overflow-hidden shadow-premium">
          <div className="p-8 border-b border-border/50 bg-secondary/20">
            <h2 className="text-2xl font-black">Danh sách phiên bản</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">Chọn phiên bản phù hợp nhất với nhu cầu của bạn.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/30 text-xs font-black uppercase tracking-wider text-muted-foreground border-b border-border/50">
                  <th className="px-8 py-5">Phiên bản</th>
                  <th className="px-8 py-5">Ngày phát hành</th>
                  <th className="px-8 py-5">Dung lượng</th>
                  <th className="px-8 py-5 text-right">Tải về</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {s.versions.map((ver, i) => (
                  <tr key={i} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{ver.v}</span>
                        {i === 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-primary text-[10px] font-black uppercase tracking-widest text-primary-foreground">Mới nhất</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-muted-foreground">{ver.d}</td>
                    <td className="px-8 py-5 text-sm font-medium text-muted-foreground">{ver.s}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                        <Download className="size-4" />
                        Tải về
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Installation/Crack Guide Section */}
        <div className="mt-20 bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-premium">
          <div className="flex items-center gap-4 mb-8">
            <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <AlertCircle className="size-6" />
            </div>
            <h2 className="text-3xl font-black">Hướng dẫn kích hoạt</h2>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border/50">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-medium">
                Vui lòng làm theo các bước dưới đây để cài đặt và kích hoạt phần mềm thành công. 
                Đảm bảo bạn đã tắt các phần mềm diệt virus trước khi thực hiện.
              </p>
              
              <div className="space-y-6">
                {[
                  "Tải file về và giải nén bằng WinRAR hoặc 7-Zip.",
                  "Chạy tệp setup.exe để cài đặt phần mềm như bình thường.",
                  "Sau khi cài đặt xong, không khởi động phần mềm ngay lập tức.",
                  "Copy nội dung trong thư mục 'Crack' dán vào thư mục cài đặt gốc.",
                  "Khởi động phần mềm và tận hưởng thành quả!"
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <div className="text-lg font-bold text-foreground pt-1.5">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-red-500/5 border border-red-500/10 flex gap-4 items-center">
            <ShieldCheck className="size-6 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-bold">
              Lưu ý: Mọi tệp tin đều được quét sạch mã độc, tuy nhiên một số trình diệt virus có thể nhận nhầm file kích hoạt là mối đe dọa.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

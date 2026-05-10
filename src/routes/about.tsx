import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Shield, Zap, Heart, Users, Globe, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "Giới thiệu — X Apps" },
      { name: "description", content: "Tìm hiểu thêm về X Apps - Hệ thống phân phối phần mềm hiện đại." }
    ]
  }),
});

function About() {
  return (
    <AppLayout activeTab="Giới thiệu">
      <div className="flex flex-col gap-16 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#1A1A1A] to-black border border-border p-12 lg:p-24 text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(197,164,126,0.1),transparent_50%)]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Về X <span className="text-brand-primary">Apps</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Chúng tôi là nền tảng phân phối phần mềm hiện đại, được thiết kế để mang lại trải nghiệm tải xuống an toàn, nhanh chóng và mượt mà nhất cho người dùng Việt Nam.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-[32px] p-10 flex flex-col gap-6">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Globe className="size-8" />
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight">Tầm nhìn</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Trở thành kho lưu trữ và phân phối phần mềm lớn nhất và đáng tin cậy nhất, nơi mọi người có thể tìm thấy mọi công cụ cần thiết cho công việc và sáng tạo chỉ trong vài click.
            </p>
          </div>

          <div className="bg-card border border-border rounded-[32px] p-10 flex flex-col gap-6">
            <div className="size-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Heart className="size-8" />
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight">Sứ mệnh</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Đơn giản hóa việc tiếp cận công nghệ thông qua việc tối ưu hóa tốc độ đường truyền và đảm bảo tính nguyên bản, sạch sẽ của mọi tệp tin được đăng tải trên hệ thống.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Phần mềm", value: "10,000+", icon: Zap },
            { label: "Người dùng", value: "500K+", icon: Users },
            { label: "Lượt tải", value: "2M+", icon: Award },
            { label: "An toàn", value: "100%", icon: Shield },
          ].map((stat) => (
            <div key={stat.label} className="bg-card/50 border border-border rounded-3xl p-8 text-center group hover:border-primary/30 transition-all">
              <div className="size-12 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors">
                <stat.icon className="size-6" />
              </div>
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <section className="bg-card border border-border rounded-[40px] p-12 lg:p-20">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <h2 className="text-4xl font-black mb-10 text-white">Tại sao chọn X Apps?</h2>
            
            <div className="space-y-12">
              <div className="flex gap-8">
                <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 font-black text-2xl shadow-lg shadow-primary/30">01</div>
                <div>
                  <h4 className="text-2xl font-bold mb-4 text-white">Tốc độ vượt trội</h4>
                  <p className="text-muted-foreground">Sử dụng hạ tầng CDN toàn cầu giúp việc tải các phần mềm dung lượng lớn như AutoCAD, Adobe Suite trở nên cực kỳ nhanh chóng mà không bị giới hạn băng thông.</p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 font-black text-2xl shadow-lg shadow-primary/30">02</div>
                <div>
                  <h4 className="text-2xl font-bold mb-4 text-white">Cập nhật liên tục</h4>
                  <p className="text-muted-foreground">Đội ngũ kỹ thuật của chúng tôi kiểm tra và cập nhật các phiên bản phần mềm mới nhất hàng ngày, đảm bảo bạn luôn có trong tay những công cụ tối tân nhất.</p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 font-black text-2xl shadow-lg shadow-primary/30">03</div>
                <div>
                  <h4 className="text-2xl font-bold mb-4 text-white">Cộng đồng hỗ trợ</h4>
                  <p className="text-muted-foreground">Không chỉ là nơi tải về, X Apps còn là cộng đồng nơi người dùng có thể trao đổi kinh nghiệm cài đặt và sử dụng phần mềm hiệu quả thông qua hệ thống hỗ trợ 24/7.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

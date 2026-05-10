import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  ChevronRight,
  Search
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/support")({
  component: PublicSupport,
});

function PublicSupport() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Lỗi link tải");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
      loading: 'Đang gửi yêu cầu...',
      success: 'Yêu cầu của bạn đã được gửi thành công!',
      error: 'Có lỗi xảy ra, vui lòng thử lại.',
    });
    setTimeout(() => setSubmitted(true), 1500);
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto px-6 py-24 text-center animate-in fade-in zoom-in duration-500">
          <div className="size-24 rounded-[32px] bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8 text-green-500">
            <CheckCircle2 className="size-12" />
          </div>
          <h1 className="text-4xl font-black mb-4">Gửi yêu cầu thành công!</h1>
          <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
            Cảm ơn bạn đã liên hệ. Mã yêu cầu của bạn là <span className="text-primary font-bold">#XAPP-{Math.floor(1000 + Math.random() * 9000)}</span>. 
            Chúng tôi sẽ phản hồi qua email <span className="text-white font-bold">{email}</span> trong vòng 24h tới.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="h-14 px-10 rounded-2xl bg-white/[0.03] border border-border text-white font-bold hover:bg-white/[0.08] transition-all"
          >
            Gửi yêu cầu khác
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: CONTENT */}
          <div className="lg:col-span-7">
            <header className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                <HelpCircle className="size-3" /> Trung tâm hỗ trợ
              </div>
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">Chúng tôi có thể giúp gì cho bạn?</h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                Gặp khó khăn khi cài đặt hay phát hiện link hỏng? Hãy gửi yêu cầu cho đội ngũ kỹ thuật của X Apps.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border rounded-[40px] p-8 lg:p-12 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 size-64 bg-primary/5 blur-[100px] -z-10" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email của bạn</label>
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-14 px-6 bg-white/[0.02] border border-border rounded-2xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                    placeholder="name@example.com"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Loại yêu cầu</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full h-14 px-6 bg-white/[0.02] border border-border rounded-2xl focus:border-primary/50 focus:outline-none transition-all font-bold appearance-none cursor-pointer text-white"
                  >
                    <option>Lỗi link tải</option>
                    <option>Hỗ trợ cài đặt</option>
                    <option>Báo lỗi phần mềm</option>
                    <option>Yêu cầu app mới</option>
                    <option>Góp ý hệ thống</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tiêu đề</label>
                <input 
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full h-14 px-6 bg-white/[0.02] border border-border rounded-2xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                  placeholder="VD: Không thể giải nén AutoCAD 2024"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nội dung chi tiết</label>
                <textarea 
                  required
                  rows={6}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-6 bg-white/[0.02] border border-border rounded-2xl focus:border-primary/50 focus:outline-none transition-all font-medium resize-none leading-relaxed"
                  placeholder="Mô tả kỹ lỗi bạn gặp phải (kèm cấu hình máy nếu là lỗi cài đặt)..."
                />
              </div>

              <button 
                type="submit"
                className="w-full h-16 rounded-[24px] bg-primary text-white font-black text-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <Send className="size-6" />
                Gửi yêu cầu hỗ trợ
              </button>
            </form>
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-card border border-border rounded-[40px] p-10 flex flex-col gap-8 shadow-premium">
              <h3 className="text-2xl font-black tracking-tight">Theo dõi yêu cầu</h3>
              <p className="text-muted-foreground font-medium">Nếu bạn đã gửi yêu cầu, hãy nhập mã để theo dõi trạng thái xử lý.</p>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input 
                  placeholder="Nhập mã yêu cầu (VD: #XAPP-1234)"
                  className="w-full h-14 pl-12 pr-4 bg-white/[0.03] border border-border rounded-2xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                />
              </div>
              <button className="h-14 rounded-2xl bg-white/[0.05] border border-border text-white font-bold hover:bg-white/[0.1] transition-all">
                Kiểm tra trạng thái
              </button>
            </div>

            <div className="space-y-6 px-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-primary">Câu hỏi thường gặp</h4>
              {[
                "Làm sao để giải nén file có mật khẩu?",
                "Tại sao link Google Drive bị giới hạn 24h?",
                "Cách tắt Windows Defender để cài Crack?",
                "Tôi có thể yêu cầu phần mềm Mac không?"
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <span className="text-muted-foreground font-bold group-hover:text-white transition-colors">{q}</span>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-[40px] p-10">
              <ShieldCheck className="size-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-4">Cam kết bảo mật</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Mọi thông tin bạn gửi đi đều được mã hóa và chỉ có đội ngũ quản trị viên được phép truy cập để hỗ trợ bạn.
              </p>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}

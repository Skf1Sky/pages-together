import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Liên hệ & Hỗ trợ — X Apps" },
      { name: "description", content: "Gửi yêu cầu hỗ trợ hoặc liên hệ với đội ngũ X Apps." }
    ]
  }),
});

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <AppLayout activeTab="Liên hệ / Hỗ trợ">
      <div className="flex flex-col gap-10 pb-20">
        {/* Header Section */}
        <section className="text-center py-10">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">Liên hệ <span className="text-primary">Hỗ trợ</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bạn gặp vấn đề khi tải hoặc cài đặt phần mềm? Đừng ngần ngại gửi yêu cầu cho chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Info Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-card border border-border rounded-[28px] p-8 flex items-start gap-5">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Email</h4>
                <p className="text-muted-foreground text-sm">support@xapps.com</p>
                <p className="text-muted-foreground text-sm">contact@xapps.com</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[28px] p-8 flex items-start gap-5">
              <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Phone className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Điện thoại</h4>
                <p className="text-muted-foreground text-sm">0123 456 789</p>
                <p className="text-muted-foreground text-sm">(+84) 987 654 321</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[28px] p-8 flex items-start gap-5">
              <div className="size-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                <MapPin className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Địa chỉ</h4>
                <p className="text-muted-foreground text-sm">123 Đường ABC, Quận X</p>
                <p className="text-muted-foreground text-sm">TP. Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[28px] p-8 flex items-start gap-5">
              <div className="size-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Clock className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Giờ làm việc</h4>
                <p className="text-muted-foreground text-sm">Thứ 2 - Thứ 7: 8:00 - 18:00</p>
                <p className="text-muted-foreground text-sm">Chủ nhật: Nghỉ</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-card border border-border rounded-[32px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-primary opacity-5">
                <MessageSquare className="size-64 -mr-20 -mt-20" />
              </div>

              {submitted ? (
                <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                  <div className="size-20 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Send className="size-10" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Gửi yêu cầu thành công!</h3>
                  <p className="text-muted-foreground text-lg mb-10">Cảm ơn bạn đã liên hệ. Chúng tôi đã nhận được thông tin và sẽ phản hồi qua email trong vòng 24 giờ.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="h-14 px-10 rounded-2xl bg-white/[0.05] border border-border font-bold hover:bg-white/[0.08] transition-all"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-muted-foreground ml-1">Họ và tên</label>
                      <input 
                        required
                        type="text"
                        placeholder="Nhập tên của bạn"
                        className="w-full h-14 px-6 bg-[#111] border border-border rounded-2xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-muted-foreground ml-1">Email liên hệ</label>
                      <input 
                        required
                        type="email"
                        placeholder="example@gmail.com"
                        className="w-full h-14 px-6 bg-[#111] border border-border rounded-2xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-muted-foreground ml-1">Chủ đề</label>
                    <select className="w-full h-14 px-6 bg-[#111] border border-border rounded-2xl focus:border-primary/50 focus:outline-none transition-all font-medium appearance-none">
                      <option>Hỗ trợ kỹ thuật / Lỗi cài đặt</option>
                      <option>Yêu cầu phần mềm mới</option>
                      <option>Báo cáo tệp tin bị lỗi / virus</option>
                      <option>Vấn đề về tài khoản</option>
                      <option>Hợp tác / Khác</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-muted-foreground ml-1">Nội dung chi tiết</label>
                    <textarea 
                      required
                      rows={6}
                      placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                      className="w-full p-6 bg-[#111] border border-border rounded-2xl focus:border-primary/50 focus:outline-none transition-all font-medium resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[64px] rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Gửi tin nhắn ngay
                        <Send className="size-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

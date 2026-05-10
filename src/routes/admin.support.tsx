import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Clock, CheckCircle2, User, Send, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/support")({
  component: AdminSupport,
});

type Ticket = {
  id: string;
  user: string;
  subject: string;
  status: "pending" | "resolved";
  time: string;
  message: string;
};

const INITIAL_TICKETS: Ticket[] = [
  { id: "1", user: "xhome", subject: "Lỗi link tải AutoCAD 2024", status: "pending", time: "5 phút trước", message: "Chào admin, link tải bản 2024.1 bị lỗi 404 rồi ạ." },
  { id: "2", user: "nva", subject: "Hỗ trợ cài Photoshop", status: "pending", time: "1 giờ trước", message: "Mình cài xong dán crack rồi mà mở không lên." },
  { id: "3", user: "user_test", subject: "Yêu cầu phần mềm Revit", status: "resolved", time: "Hôm qua", message: "Admin cho mình xin bản Revit 2024 nhé." },
];

function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-[32px] font-black tracking-tight flex items-center gap-3">
          <MessageSquare className="size-8 text-primary" />
          Yêu cầu hỗ trợ
        </h2>
        <p className="text-muted-foreground">Phản hồi và hỗ trợ người dùng giải quyết các vấn đề.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold">Tất cả</button>
              <button className="px-4 py-1.5 rounded-full bg-white/[0.03] text-muted-foreground text-xs font-bold hover:text-white transition-all">Đang chờ</button>
              <button className="px-4 py-1.5 rounded-full bg-white/[0.03] text-muted-foreground text-xs font-bold hover:text-white transition-all">Đã giải quyết</button>
            </div>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-all">
              <Filter className="size-4" />
              Lọc theo ngày
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-card border border-border rounded-[24px] p-6 hover:border-primary/20 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-border">
                      <User className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-bold">{ticket.user}</div>
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{ticket.time}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    ticket.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/10' : 'bg-green-500/10 text-green-500 border border-green-500/10'
                  }`}>
                    {ticket.status === 'pending' ? 'Đang chờ' : 'Đã giải quyết'}
                  </span>
                </div>
                <h4 className="font-bold text-lg mb-2">{ticket.subject}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{ticket.message}</p>
                <div className="flex items-center gap-3">
                  <button className="flex-1 h-11 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                    <Send className="size-4" />
                    Phản hồi ngay
                  </button>
                  <button className="size-11 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center text-muted-foreground hover:text-green-500 hover:border-green-500/20 transition-all">
                    <CheckCircle2 className="size-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6">
          <div className="bg-card border border-border rounded-[32px] p-8">
            <h3 className="text-xl font-bold mb-6">Thống kê hỗ trợ</h3>
            <div className="space-y-6">
              {[
                { label: "Tổng yêu cầu", value: "142", color: "bg-blue-500" },
                { label: "Đã xử lý", value: "128", color: "bg-green-500" },
                { label: "Tỷ lệ phản hồi", value: "98%", color: "bg-primary" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span>{s.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: s.value.includes('%') ? s.value : '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-[32px] p-8 flex flex-col gap-4">
            <div className="size-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-2">
              <Clock className="size-6" />
            </div>
            <h3 className="text-xl font-bold">Thời gian phản hồi TB</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Trung bình bạn phản hồi yêu cầu trong vòng 15 phút.</p>
            <div className="text-3xl font-black text-primary">00:15:32</div>
          </div>
        </div>
      </div>
    </div>
  );
}

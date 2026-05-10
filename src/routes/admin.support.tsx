import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Clock, CheckCircle2, User, Send, Filter, MoreVertical, X, AlertCircle, Hash, UserCheck, MessageCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Pagination } from "@/components/Pagination";

export const Route = createFileRoute("/admin/support")({
  component: AdminSupport,
});

type TicketStatus = "pending" | "processing" | "resolved";

type Ticket = {
  id: string;
  user: string;
  email: string;
  subject: string;
  category: "Lỗi link" | "Cài đặt" | "Báo lỗi" | "Yêu cầu";
  status: TicketStatus;
  time: string;
  message: string;
  assignedTo?: string;
};

const INITIAL_TICKETS: Ticket[] = [
  { id: "1024", user: "xhome", email: "xhome@gmail.com", subject: "Lỗi link tải AutoCAD 2024", category: "Lỗi link", status: "pending", time: "5 phút trước", message: "Chào admin, link tải bản 2024.1 bị lỗi 404 rồi ạ." },
  { id: "1025", user: "nva", email: "nva@example.com", subject: "Hỗ trợ cài Photoshop", category: "Cài đặt", status: "processing", time: "1 giờ trước", message: "Mình cài xong dán crack rồi mà mở không lên.", assignedTo: "Admin Vinh" },
  { id: "1026", user: "test_user", email: "test@xapps.com", subject: "Yêu cầu phần mềm Revit", category: "Yêu cầu", status: "resolved", time: "Hôm qua", message: "Admin cho mình xin bản Revit 2024 nhé.", assignedTo: "Admin Vinh" },
];

const ITEMS_PER_PAGE = 5;

function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => filter === 'all' || t.status === filter);
  }, [tickets, filter]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = (id: string, next: TicketStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: next } : t));
    toast.success(`Đã chuyển trạng thái sang ${next}`);
  };

  const handleAssign = (id: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, assignedTo: "Bạn (Admin)", status: "processing" } : t));
    toast.info("Đã gán yêu cầu này cho bạn");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-black tracking-tight flex items-center gap-3">
            <MessageSquare className="size-8 text-primary" />
            Trung tâm hỗ trợ
          </h2>
          <p className="text-muted-foreground font-medium">Bạn có <span className="text-orange-500 font-bold">{tickets.filter(t => t.status !== 'resolved').length}</span> yêu cầu chưa xử lý.</p>
        </div>
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-border">
          {(["all", "pending", "processing", "resolved"] as const).map(f => (
            <button 
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"}`}
            >
              {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Chờ' : f === 'processing' ? 'Xử lý' : 'Xong'}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ticket List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-4">
            {paginatedTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`bg-card border rounded-[32px] p-8 transition-all hover:shadow-premium group ${selectedTicket?.id === ticket.id ? "border-primary/50 bg-primary/[0.02]" : "border-border/50"}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-[18px] bg-white/[0.03] border border-border flex items-center justify-center text-primary shrink-0">
                      <Hash className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-lg">#{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          ticket.category === 'Lỗi link' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          ticket.category === 'Cài đặt' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-white/[0.05] text-muted-foreground border-border'
                        }`}>
                          {ticket.category}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-bold">{ticket.user} • {ticket.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      ticket.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      ticket.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-green-500/10 text-green-500 border-green-500/20'
                    }`}>
                      {ticket.status === 'pending' ? 'Đang chờ' : ticket.status === 'processing' ? 'Đang xử lý' : 'Đã xong'}
                    </span>
                    {ticket.assignedTo && (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                        <UserCheck className="size-3" />
                        {ticket.assignedTo}
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="text-xl font-black mb-3">{ticket.subject}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-2">{ticket.message}</p>

                <div className="flex items-center justify-between border-t border-border/50 pt-6">
                  <div className="text-[11px] text-muted-foreground font-bold flex items-center gap-2">
                    <Clock className="size-3.5" /> {ticket.time}
                  </div>
                  <div className="flex items-center gap-2">
                    {!ticket.assignedTo && (
                      <button 
                        onClick={() => handleAssign(ticket.id)}
                        className="h-10 px-5 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all"
                      >
                        Nhận xử lý
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      className="h-10 px-5 rounded-xl bg-white/[0.03] border border-border text-white font-bold text-xs hover:bg-white/[0.08] transition-all flex items-center gap-2"
                    >
                      <MessageCircle className="size-4" />
                      Mở cuộc hội thoại
                    </button>
                    <button 
                      onClick={() => handleStatusChange(ticket.id, 'resolved')}
                      className="size-10 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center text-muted-foreground hover:text-green-500 hover:border-green-500/20 transition-all"
                      title="Đánh dấu đã xong"
                    >
                      <CheckCircle2 className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Sidebar stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium">
            <h3 className="text-lg font-black mb-6">Phân loại yêu cầu</h3>
            <div className="space-y-4">
              {[
                { label: "Lỗi link tải", count: 42, color: "bg-red-500" },
                { label: "Hỗ trợ cài đặt", count: 85, color: "bg-blue-500" },
                { label: "Báo lỗi app", count: 12, color: "bg-yellow-500" },
                { label: "Yêu cầu app mới", count: 3, color: "bg-green-500" },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`size-2 rounded-full ${c.color}`} />
                    <span className="text-sm font-bold text-muted-foreground">{c.label}</span>
                  </div>
                  <span className="text-sm font-black text-white">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8">
            <div className="size-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-4">
              <AlertCircle className="size-5" />
            </div>
            <h4 className="font-bold text-white mb-2">Quy trình xử lý</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Luôn phản hồi người dùng một cách lịch sự. Ưu tiên các yêu cầu báo lỗi link tải để duy trì chất lượng hệ thống.</p>
          </div>
        </div>
      </div>

      {/* CONVERSATION MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedTicket(null)} />
          <div className="relative w-full max-w-2xl h-[80vh] bg-card border border-border rounded-[40px] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <header className="p-8 border-b border-border flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-[18px] bg-primary/10 flex items-center justify-center text-primary">
                  <User className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Hội thoại với {selectedTicket.user}</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">#{selectedTicket.id} • {selectedTicket.subject}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="size-10 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all">
                <X className="size-5" />
              </button>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="bg-white/[0.03] border border-border p-5 rounded-[24px] rounded-tl-none text-sm font-medium leading-relaxed">
                  {selectedTicket.message}
                </div>
                <span className="text-[10px] text-muted-foreground font-bold px-1">{selectedTicket.time}</span>
              </div>

              <div className="flex flex-col gap-2 max-w-[85%] self-end">
                <div className="bg-primary text-white p-5 rounded-[24px] rounded-tr-none text-sm font-medium leading-relaxed shadow-lg shadow-primary/20">
                  Chào {selectedTicket.user}, chúng tôi đã nhận được thông tin. Đội ngũ kỹ thuật đang kiểm tra lại link tải AutoCAD 2024. Vui lòng đợi trong giây lát.
                </div>
                <span className="text-[10px] text-muted-foreground font-bold px-1 text-right">Vừa xong</span>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white/[0.01] border-t border-border">
              <div className="relative">
                <input 
                  placeholder="Nhập nội dung phản hồi..."
                  className="w-full h-16 pl-6 pr-20 bg-white/[0.03] border border-border rounded-[24px] focus:border-primary/50 focus:outline-none transition-all font-medium"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  <Send className="size-4" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button className="text-[10px] font-black text-muted-foreground uppercase hover:text-primary transition-colors">Dùng câu trả lời mẫu</button>
                <div className="h-3 w-px bg-border" />
                <button className="text-[10px] font-black text-muted-foreground uppercase hover:text-primary transition-colors">Đính kèm ảnh</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

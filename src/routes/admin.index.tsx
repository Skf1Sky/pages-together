import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Users, 
  Package, 
  Download, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  Plus, 
  ArrowUpRight,
  MessageSquare,
  Activity,
  HardDrive
} from "lucide-react";
import { softwares } from "@/lib/software-data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = [
    { label: "Tổng người dùng", value: "1,284", icon: Users, change: "+12%", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Số lượng Apps", value: softwares.length.toString(), icon: Package, change: "+3", color: "text-primary", bg: "bg-primary/10" },
    { label: "Lượt tải về", value: "45.2K", icon: Download, change: "+18%", color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Dung lượng hệ thống", value: "128 GB", icon: HardDrive, change: "85%", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Chào mừng quay trở lại! Đây là tóm tắt hoạt động của hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/softwares" className="h-11 px-5 rounded-xl border border-border bg-white/[0.02] flex items-center gap-2 font-bold hover:bg-white/[0.05] transition-all">
            Xem tất cả Apps
          </Link>
          <Link to="/admin/upload" className="h-11 px-5 rounded-xl bg-primary text-white flex items-center gap-2 font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Plus className="size-4" />
            Đăng phần mềm
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-[28px] p-6 hover:border-primary/20 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="size-6" />
              </div>
              <div className="flex items-center gap-1 text-[13px] font-bold text-green-500">
                {stat.change}
                <ArrowUpRight className="size-3" />
              </div>
            </div>
            <div className="text-[32px] font-black leading-none mb-1">{stat.value}</div>
            <div className="text-muted-foreground text-sm font-bold uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Main Chart/Table Area */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-6 min-h-[400px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Activity className="size-5" />
                </div>
                <h3 className="text-xl font-bold">Biểu đồ lượt tải</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold">7 Ngày qua</button>
                <button className="px-3 py-1 rounded-lg bg-white/[0.03] text-muted-foreground text-xs font-bold hover:text-white">30 Ngày</button>
              </div>
            </div>
            
            {/* Mock Chart Area */}
            <div className="flex-1 flex items-end gap-2 pt-10">
              {[45, 78, 56, 92, 43, 67, 85, 45, 78, 56, 92, 43].map((h, i) => (
                <div key={i} className="flex-1 bg-white/[0.03] rounded-t-lg relative group transition-all hover:bg-primary/20">
                  <div 
                    className="absolute bottom-0 w-full bg-primary/40 rounded-t-lg transition-all group-hover:bg-primary" 
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Clock className="size-5 text-primary" />
              Cập nhật gần đây
            </h3>
            <div className="flex flex-col divide-y divide-border/50">
              {softwares.slice(0, 3).map((s) => (
                <div key={s.id} className="py-5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl flex items-center justify-center text-white font-black" style={{ background: s.color }}>
                      {s.letter}
                    </div>
                    <div>
                      <div className="font-bold">{s.name}</div>
                      <div className="text-sm text-muted-foreground font-medium">Phiên bản {s.version} • {s.size}</div>
                    </div>
                  </div>
                  <Link to="/admin/softwares" className="size-10 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight className="size-5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-[32px] p-8 flex flex-col gap-6">
            <h3 className="text-xl font-bold">Hỗ trợ mới</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Bạn có 3 yêu cầu hỗ trợ mới cần được xử lý ngay.</p>
            <Link to="/admin/support" className="h-[52px] rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              Xem yêu cầu
              <TrendingUp className="size-[18px]" />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-6">
            <h3 className="text-xl font-bold">Tin nhắn hệ thống</h3>
            <div className="flex flex-col gap-5">
              {[
                { user: "xhome", msg: "Lỗi link tải AutoCAD 2024", time: "5 phút trước" },
                { user: "nva", msg: "Cần hỗ trợ cài Photoshop", time: "1 giờ trước" },
                { user: "admin", msg: "Đã cập nhật server", time: "2 giờ trước" },
              ].map((m, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-primary">{m.user}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">{m.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{m.msg}</p>
                </div>
              ))}
            </div>
            <Link to="/admin/support" className="text-center text-xs font-bold text-primary hover:underline">
              Xem tất cả tin nhắn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

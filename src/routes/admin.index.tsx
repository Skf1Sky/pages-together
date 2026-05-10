import { createFileRoute, Link } from "@tanstack/react-router";
import React from "react";
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
  HardDrive,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { getSoftwares } from "@/lib/api/softwares";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const Route = createFileRoute("/admin/")({
  loader: () => getSoftwares(),
  component: AdminDashboard,
});

const chartData = [
  { name: 'Mon', downloads: 2400, views: 4000 },
  { name: 'Tue', downloads: 1398, views: 3000 },
  { name: 'Wed', downloads: 9800, views: 2000 },
  { name: 'Thu', downloads: 3908, views: 2780 },
  { name: 'Fri', downloads: 4800, views: 1890 },
  { name: 'Sat', downloads: 3800, views: 2390 },
  { name: 'Sun', downloads: 4300, views: 3490 },
];

function AdminDashboard() {
  const softwares = Route.useLoaderData() || [];
  
  const topAppsData = React.useMemo(() => (
    Array.isArray(softwares) ? softwares
      .map((s: any) => ({ name: s.name, value: parseInt(s.downloads?.replace(/[^0-9]/g, '') || "0") }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) : []
  ), [softwares]);

  const totalDownloads = React.useMemo(() => (
    Array.isArray(softwares) ? softwares.reduce((acc, curr: any) => acc + parseInt(curr.downloads?.replace(/[^0-9]/g, '') || "0"), 0) : 0
  ), [softwares]);

  const stats = [
    { label: "Tổng người dùng", value: "1,284", icon: Users, change: "+12%", color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Số lượng Apps", value: softwares?.length?.toString() || "0", icon: Package, change: "+3", color: "text-primary", bg: "bg-primary/10" },
    { label: "Lượt tải về", value: `${(totalDownloads / 1000).toFixed(1)}K`, icon: Download, change: "+18%", color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Lượt tải hôm nay", value: "842", icon: Activity, change: "+5.4%", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const activityLog = [
    { type: 'upload', user: 'Admin', target: 'AutoCAD 2024', time: '10 phút trước', icon: Package, color: 'text-blue-500' },
    { type: 'delete', user: 'Admin', target: 'Old Version 1.2', time: '1 giờ trước', icon: AlertTriangle, color: 'text-red-500' },
    { type: 'update', user: 'Admin', target: 'System Settings', time: '3 giờ trước', icon: CheckCircle2, color: 'text-green-500' },
    { type: 'login', user: 'Admin', target: 'New Session', time: '5 giờ trước', icon: Users, color: 'text-primary' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground font-medium">Hệ thống đang hoạt động ổn định. <span className="text-green-500">99.9% Uptime.</span></p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-8 min-h-[450px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Thống kê truy cập & Tải về</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">Dữ liệu được cập nhật theo thời gian thực</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-border rounded-xl">
                <button className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-lg">7 Ngày</button>
                <button className="px-4 py-1.5 rounded-lg text-muted-foreground text-xs font-bold hover:text-white transition-colors">30 Ngày</button>
              </div>
            </div>
            
            <div className="flex-1 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c5a47e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#c5a47e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#555" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#555" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                    itemStyle={{ color: '#c5a47e' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="downloads" 
                    stroke="#c5a47e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorDownloads)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-card border border-border rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Activity className="size-5 text-primary" />
                Hoạt động gần đây
              </h3>
              <Link to="/admin" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Xem tất cả</Link>
            </div>
            <div className="space-y-6">
              {activityLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center ${log.color}`}>
                      <log.icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                        {log.user} <span className="text-muted-foreground font-medium">đã {log.type === 'upload' ? 'đăng' : log.type === 'delete' ? 'xóa' : log.type === 'update' ? 'cập nhật' : 'đăng nhập'}</span> {log.target}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">{log.time}</div>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Stats Area */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Top Softwares Bar Chart */}
          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-6">
            <h3 className="text-xl font-bold">Top phần mềm tải nhiều</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAppsData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80} 
                    fontSize={10} 
                    stroke="#888" 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" fill="#c5a47e" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Support Badge */}
          <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-[32px] p-8 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold">Hỗ trợ mới</h3>
              <div className="px-2 py-1 bg-primary text-white text-[10px] font-black rounded-lg animate-pulse">3 MỚI</div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">Hệ thống nhận được 3 yêu cầu hỗ trợ mới chưa được phản hồi.</p>
            <Link to="/admin/support" className="h-[52px] rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Phản hồi ngay
              <MessageSquare className="size-[18px]" />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-6">
            <h3 className="text-xl font-bold">Thông báo hệ thống</h3>
            <div className="flex flex-col gap-5">
              {[
                { user: "System", msg: "Sao lưu định kỳ hoàn tất", icon: CheckCircle2, color: 'text-green-500' },
                { user: "Security", msg: "Phát hiện đăng nhập lạ", icon: AlertTriangle, color: 'text-red-500' },
                { user: "Update", msg: "Phiên bản v2.4 đã sẵn sàng", icon: Activity, color: 'text-blue-500' },
              ].map((m, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`size-10 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center shrink-0 ${m.color}`}>
                    <m.icon className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-white">{m.msg}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">{m.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

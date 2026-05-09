import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Edit, Trash2, Search, Filter, MoreVertical } from "lucide-react";
import { useState } from "react";
import { softwares } from "@/lib/software-data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = softwares.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <header className="h-16 border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10 px-8 flex items-center justify-between">
        <h1 className="font-black text-xl">Quản lý phần mềm</h1>
        <div className="flex items-center gap-4">
          <Link to="/admin/upload" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
            <Plus className="size-4" />
            Thêm phần mềm mới
          </Link>
          <div className="size-9 rounded-full bg-gradient-to-br from-primary to-[oklch(0.55_0.22_270)]" />
        </div>
      </header>

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Tổng phần mềm", value: softwares.length.toString(), color: "text-blue-500" },
            { label: "Lượt tải tháng này", value: "24.5K", color: "text-green-500" },
            { label: "Đánh giá trung bình", value: "4.8", color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 shadow-premium">
              <div className="text-sm font-bold text-muted-foreground mb-2">{stat.label}</div>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Table Controls */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-premium">
          <div className="p-6 border-b border-border/50 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm trong danh sách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 h-11 bg-secondary/50 rounded-xl border border-transparent focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 h-11 bg-card border border-border/50 rounded-xl text-sm font-bold hover:bg-secondary/50 transition-all">
                <Filter className="size-4 text-muted-foreground" />
                Bộ lọc
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/30 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Phần mềm</th>
                  <th className="px-6 py-4">Danh mục</th>
                  <th className="px-6 py-4">Phiên bản</th>
                  <th className="px-6 py-4">Dung lượng</th>
                  <th className="px-6 py-4">Đánh giá</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ background: s.color }}>
                          {s.letter}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.publisher || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-secondary text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{s.version}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{s.size}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold">{s.rating}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`size-1.5 rounded-full ${i <= Math.round(s.rating) ? "bg-orange-400" : "bg-muted"}`} />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                          <Edit className="size-4" />
                        </button>
                        <button className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all">
                          <Trash2 className="size-4" />
                        </button>
                        <button className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                          <MoreVertical className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

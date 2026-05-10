import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Edit, Trash2, Search, Filter, MoreVertical } from "lucide-react";
import { useState } from "react";
import { softwares } from "@/lib/software-data";

export const Route = createFileRoute("/admin/softwares")({
  component: AdminSoftwares,
});

function AdminSoftwares() {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = softwares.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black tracking-tight flex items-center gap-3">
            Quản lý phần mềm
          </h1>
          <p className="text-muted-foreground text-sm">Danh sách toàn bộ ứng dụng trên hệ thống.</p>
        </div>
        <Link to="/admin/upload" className="h-[52px] px-6 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus className="size-4" />
          Thêm phần mềm mới
        </Link>
      </header>

      {/* Table Controls */}
      <div className="bg-card border border-border/50 rounded-[28px] overflow-hidden shadow-premium">
        <div className="p-6 border-b border-border/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm phần mềm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 h-12 bg-[#111] rounded-xl border border-border focus:border-primary/50 transition-all text-sm font-medium focus:outline-none"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 h-12 bg-white/[0.03] border border-border rounded-xl text-sm font-bold hover:bg-white/[0.06] transition-all">
              <Filter className="size-4 text-muted-foreground" />
              Bộ lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="px-6 py-5">Phần mềm</th>
                <th className="px-6 py-5">Danh mục</th>
                <th className="px-6 py-5">Số phiên bản</th>
                <th className="px-6 py-5">Bản mới nhất</th>
                <th className="px-6 py-5">Dung lượng</th>
                <th className="px-6 py-5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ background: s.color }}>
                        {s.letter}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.publisher || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-bold text-primary">{s.versions.length} phiên bản</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium">{s.version}</td>
                  <td className="px-6 py-5 text-sm text-muted-foreground font-medium">{s.size}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/admin/edit/$id"
                        params={{ id: s.id }}
                        className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <Edit className="size-4" />
                      </Link>
                      <button className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Trash2 className="size-4" />
                      </button>
                      <button className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
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
  );
}

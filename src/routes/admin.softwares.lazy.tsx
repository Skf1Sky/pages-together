import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Plus, Edit, Trash2, Search, Filter, MoreVertical, Eye, EyeOff, CheckSquare, Square, ArrowUpDown, ExternalLink, ChevronDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { softwares } from "@/lib/software-data";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { SoftwareSkeleton } from "@/components/Skeleton";
import { Pagination } from "@/components/Pagination";

export const Route = createLazyFileRoute("/admin/softwares")({
  component: AdminSoftwares,
});

type SortConfig = {
  key: "name" | "category" | "downloads" | "version";
  direction: "asc" | "desc";
};

const ITEMS_PER_PAGE = 8;

function AdminSoftwares() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{ id?: string, type: 'single' | 'bulk' }>({ type: 'single' });
  const [currentPage, setCurrentPage] = useState(1);
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(
    Object.fromEntries(softwares.map(s => [s.id, true]))
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = softwares.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      const valA = a[sortConfig.key] || "";
      const valB = b[sortConfig.key] || "";
      
      if (sortConfig.direction === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    return result;
  }, [searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map(s => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSort = (key: SortConfig["key"]) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const toggleVisibility = (id: string) => {
    setVisibilityMap(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success(`Đã ${visibilityMap[id] ? "ẩn" : "hiện"} phần mềm thành công!`);
  };

  const handleBulkDelete = () => {
    setConfirmData({ type: 'bulk' });
    setIsConfirmOpen(true);
  };

  const handleSingleDelete = (id: string) => {
    setConfirmData({ id, type: 'single' });
    setIsConfirmOpen(true);
  };

  const executeDelete = () => {
    if (confirmData.type === 'bulk') {
      toast.success(`Đã xóa ${selectedIds.length} phần mềm!`);
      setSelectedIds([]);
    } else {
      toast.success(`Đã xóa phần mềm thành công!`);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => <SoftwareSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black tracking-tight">Quản lý phần mềm</h1>
          <p className="text-muted-foreground text-sm font-medium">Bạn có <span className="text-primary font-black">{softwares.length}</span> ứng dụng đang hoạt động.</p>
        </div>
        <Link to="/admin/upload" className="h-[52px] px-6 rounded-2xl bg-primary text-white font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus className="size-5" />
          Thêm phần mềm mới
        </Link>
      </header>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-primary px-6 py-3 rounded-[24px] flex items-center justify-between animate-in zoom-in duration-300 shadow-lg shadow-primary/20">
          <div className="flex items-center gap-4">
            <span className="text-white font-black text-sm uppercase tracking-widest">Đã chọn {selectedIds.length} mục</span>
            <div className="h-4 w-px bg-white/20" />
            <button onClick={() => setVisibilityMap(prev => {
              const next = { ...prev };
              selectedIds.forEach(id => next[id] = true);
              return next;
            })} className="text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">Hiện tất cả</button>
            <button onClick={() => setVisibilityMap(prev => {
              const next = { ...prev };
              selectedIds.forEach(id => next[id] = false);
              return next;
            })} className="text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">Ẩn tất cả</button>
          </div>
          <button 
            onClick={handleBulkDelete}
            className="h-10 px-5 rounded-xl bg-white text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:shadow-lg transition-all"
          >
            Xóa vĩnh viễn
          </button>
        </div>
      )}

      {/* Table Controls */}
      <div className="bg-card border border-border/50 rounded-[32px] overflow-hidden shadow-premium">
        <div className="p-8 border-b border-border/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc danh mục..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 h-14 bg-secondary/50 rounded-2xl border border-border focus:border-primary/50 transition-all text-sm font-medium focus:outline-none"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 h-14 bg-secondary/50 border border-border rounded-2xl text-sm font-bold hover:bg-secondary transition-all">
              <Filter className="size-4 text-muted-foreground" />
              Bộ lọc nâng cao
            </button>
          </div>
        </div>

        {/* Table */}
        {paginatedData.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/20 text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="px-8 py-5 w-12">
                    <button onClick={toggleSelectAll} className="size-5 flex items-center justify-center rounded-lg border border-border hover:border-primary transition-colors bg-secondary">
                      {selectedIds.length === paginatedData.length && paginatedData.length > 0 ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4" />}
                    </button>
                  </th>
                  <th className="px-8 py-5 cursor-pointer hover:text-foreground transition-colors group" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-2">
                      Phần mềm
                      <ArrowUpDown className={`size-3 opacity-0 group-hover:opacity-100 transition-opacity ${sortConfig.key === "name" ? "opacity-100 text-primary" : ""}`} />
                    </div>
                  </th>
                  <th className="px-8 py-5 cursor-pointer hover:text-foreground transition-colors group" onClick={() => handleSort("category")}>
                    <div className="flex items-center gap-2">
                      Danh mục
                      <ArrowUpDown className={`size-3 opacity-0 group-hover:opacity-100 transition-opacity ${sortConfig.key === "category" ? "opacity-100 text-primary" : ""}`} />
                    </div>
                  </th>
                  <th className="px-8 py-5">Lượt tải</th>
                  <th className="px-8 py-5">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedData.map((s) => (
                  <tr key={s.id} className={`hover:bg-primary/[0.02] transition-colors group ${selectedIds.includes(s.id) ? "bg-primary/[0.04]" : ""} ${!visibilityMap[s.id] ? "opacity-60" : ""}`}>
                    <td className="px-8 py-6">
                      <button onClick={() => toggleSelect(s.id)} className="size-5 flex items-center justify-center rounded-lg border border-border hover:border-primary transition-colors bg-secondary">
                        {selectedIds.includes(s.id) ? <CheckSquare className="size-4 text-primary" /> : <Square className="size-4" />}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg" style={{ background: s.color }}>
                          {s.letter}
                        </div>
                        <div>
                          <div className="font-bold text-[15px] group-hover:text-primary transition-colors">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">v{s.version} • {s.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-secondary border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[15px] font-black">{s.downloads?.toLocaleString() || "0"}</div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleVisibility(s.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${visibilityMap[s.id] ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-secondary border-border text-muted-foreground"}`}
                      >
                        {visibilityMap[s.id] ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                        <span className="text-[10px] font-black uppercase tracking-wider">{visibilityMap[s.id] ? "Công khai" : "Đã ẩn"}</span>
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/software/$id"
                          params={{ id: s.id }}
                          className="size-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                          title="Xem trước"
                        >
                          <ExternalLink className="size-5" />
                        </Link>
                        <Link
                          to="/admin/edit/$id"
                          params={{ id: s.id }}
                          className="size-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit className="size-5" />
                        </Link>
                        <button 
                          onClick={() => handleSingleDelete(s.id)}
                          className="size-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            title="Không tìm thấy phần mềm" 
            description={`Không có kết quả nào khớp với từ khóa "${searchTerm}". Vui lòng thử lại với tên khác.`}
            icon="search"
            action={{ label: "Xóa tìm kiếm", onClick: () => setSearchTerm("") }}
          />
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        title={confirmData.type === 'bulk' ? "Xóa hàng loạt?" : "Xác nhận xóa?"}
        description={confirmData.type === 'bulk' 
          ? `Bạn có chắc chắn muốn xóa ${selectedIds.length} phần mềm đã chọn? Hành động này không thể hoàn tác.`
          : "Phần mềm này sẽ bị gỡ bỏ vĩnh viễn khỏi hệ thống và người dùng không thể tải xuống nữa."}
      />
    </div>
  );
}

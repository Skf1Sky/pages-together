import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { softwares } from "@/lib/software-data";
import { ChevronLeft, ChevronRight, Search, LayoutGrid, List } from "lucide-react";

type SoftwaresSearch = {
  category?: string;
  q?: string;
  page?: number;
};

export const Route = createFileRoute("/softwares")({
  validateSearch: (search: Record<string, unknown>): SoftwaresSearch => {
    return {
      category: (search.category as string) || undefined,
      q: (search.q as string) || undefined,
      page: Number(search.page) || 1,
    };
  },
  component: SoftwaresList,
  head: () => ({
    meta: [
      { title: "Tất cả phần mềm — X Apps" },
      { name: "description", content: "Danh sách đầy đủ các phần mềm trên hệ thống X Apps." }
    ]
  }),
});

function SoftwaresList() {
  const { category, q, page = 1 } = Route.useSearch();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 8;

  const filteredData = useMemo(() => {
    return softwares.filter((s) => {
      const matchesCategory = !category || s.category.toLowerCase() === category.toLowerCase();
      const matchesSearch = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.description?.toLowerCase().includes(q.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, q]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <AppLayout activeTab={category || "Tất cả phần mềm"}>
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="bg-card border border-border rounded-[28px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              {category ? `Danh mục: ${category}` : "Tất cả phần mềm"}
            </h1>
            <p className="text-muted-foreground font-medium">
              Tìm thấy <span className="text-white">{filteredData.length}</span> sản phẩm phù hợp
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex p-1 bg-white/[0.03] border border-border rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
              >
                <LayoutGrid className="size-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
              >
                <List className="size-5" />
              </button>
            </div>
            
            <div className="h-10 w-px bg-border mx-2" />

            <div className="flex items-center gap-2">
              <Link
                disabled={currentPage <= 1}
                search={(prev) => ({ ...prev, page: currentPage - 1 })}
                className={`size-10 flex items-center justify-center rounded-xl border border-border transition-all ${currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "bg-white/[0.03] hover:border-primary/50 text-white"}`}
              >
                <ChevronLeft className="size-5" />
              </Link>
              <div className="px-4 font-bold text-sm">
                Trang {currentPage} / {totalPages || 1}
              </div>
              <Link
                disabled={currentPage >= totalPages}
                search={(prev) => ({ ...prev, page: currentPage + 1 })}
                className={`size-10 flex items-center justify-center rounded-xl border border-border transition-all ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "bg-white/[0.03] hover:border-primary/50 text-white"}`}
              >
                <ChevronRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* List Content */}
        {currentData.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "flex flex-col gap-4"
          }>
            {currentData.map((s) => (
              <div key={s.id} className={`bg-card border border-border rounded-[24px] overflow-hidden transition-all hover:border-primary/30 group ${viewMode === 'list' ? "flex items-center p-4 gap-6" : "p-6"}`}>
                <div 
                  className={`rounded-[20px] flex items-center justify-center text-2xl font-black text-white shrink-0 ${viewMode === 'list' ? "size-16" : "size-[72px] mb-5"}`}
                  style={{ background: `linear-gradient(135deg, ${s.color}, oklch(from ${s.color} l c h / 0.7))` }}
                >
                  {s.letter}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1 truncate">{s.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-border text-[11px] font-bold uppercase tracking-wider">{s.category}</span>
                    <span>•</span>
                    <span>{s.version}</span>
                    <span>•</span>
                    <span>{s.size}</span>
                  </div>
                  {viewMode === 'list' && (
                    <p className="text-muted-foreground text-sm line-clamp-1 mb-0 italic">
                      {s.description || "Phần mềm chuyên dụng cho chuyên gia..."}
                    </p>
                  )}
                </div>

                <div className={viewMode === 'list' ? "shrink-0" : "mt-2"}>
                  <Link
                    to="/software/$id"
                    params={{ id: s.id }}
                    className="h-11 px-6 rounded-[14px] bg-primary text-white font-bold flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-[28px] py-32 text-center">
            <div className="size-20 bg-white/[0.03] border border-border rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="size-10 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-bold mb-2">Không tìm thấy kết quả</h3>
            <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác hoặc thay đổi danh mục.</p>
            <Link to="/softwares" className="inline-flex mt-8 text-primary font-bold hover:underline">Xóa tất cả bộ lọc</Link>
          </div>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-10">
             <Link
                disabled={currentPage <= 1}
                search={(prev) => ({ ...prev, page: currentPage - 1 })}
                className={`h-12 px-6 flex items-center gap-2 rounded-xl border border-border transition-all ${currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "bg-white/[0.03] hover:border-primary/50 text-white"}`}
              >
                <ChevronLeft className="size-4" />
                <span>Trước</span>
              </Link>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    search={(prev) => ({ ...prev, page: p })}
                    className={`size-12 flex items-center justify-center rounded-xl border transition-all font-bold ${currentPage === p ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/[0.03] border-border text-muted-foreground hover:text-white hover:border-white/20"}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>

              <Link
                disabled={currentPage >= totalPages}
                search={(prev) => ({ ...prev, page: currentPage + 1 })}
                className={`h-12 px-6 flex items-center gap-2 rounded-xl border border-border transition-all ${currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "bg-white/[0.03] hover:border-primary/50 text-white"}`}
              >
                <span>Sau</span>
                <ChevronRight className="size-4" />
              </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

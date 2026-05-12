import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getSoftwares } from "@/lib/api/softwares";
import { ChevronLeft, ChevronRight, Search, LayoutGrid, List, MoreVertical } from "lucide-react";

type SoftwaresSearch = {
  category?: string;
  q?: string;
  page?: number;
};

export const Route = createFileRoute("/softwares")({
  validateSearch: (search: Record<string, unknown>): SoftwaresSearch => {
    return {
      category: search.category ? String(search.category) : undefined,
      q: search.q ? String(search.q) : undefined,
      page: Number(search.page) || 1,
    };
  },
  loader: ({ search }) => getSoftwares(search?.category, search?.q),
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
  const softwares = (Route.useLoaderData() as any[]) || [];
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 8;
  const filteredBySearchAndCategory = useMemo(() => {
    if (!category || category.toLowerCase() === 'all' || category === 'Tất cả danh mục') return softwares;
    return softwares.filter((s: any) => s.category?.trim().toLowerCase() === category.trim().toLowerCase());
  }, [softwares, category]);

  const totalPages = Math.ceil((filteredBySearchAndCategory?.length || 0) / itemsPerPage);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return Array.isArray(filteredBySearchAndCategory) ? filteredBySearchAndCategory.slice(start, start + itemsPerPage) : [];
  }, [filteredBySearchAndCategory, currentPage]);

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
              Tìm thấy <span className="text-white">{filteredBySearchAndCategory.length}</span> sản phẩm phù hợp
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
              <div key={s?.id} className={`bg-card border border-border rounded-[28px] overflow-hidden transition-all hover:-translate-y-1.5 hover:border-primary/30 group shadow-sm hover:shadow-xl ${viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'p-6 flex flex-col'}`}>
                <div 
                  className={`rounded-[24px] flex items-center justify-center text-3xl font-black text-white shadow-lg shrink-0 ${viewMode === 'list' ? 'size-[80px]' : 'size-[100px] mx-auto mb-6'}`}
                  style={{ background: s?.color ? `linear-gradient(135deg, ${s.color}, oklch(from ${s.color} l c h / 0.7))` : 'var(--primary)' }}
                >
                  {s?.letter || '?'}
                </div>
                
                <div className={`flex-1 ${viewMode === 'list' ? '' : 'text-center'}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-3 justify-center md:justify-start">
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-border text-[11px] font-bold uppercase tracking-wider">{s?.category || 'Phần mềm'}</span>
                    <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-[11px] font-black uppercase tracking-wider border border-green-500/10">v{s?.versions?.[0]?.v || '1.0'}</span>
                  </div>
                  
                  <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors truncate">{s?.name || 'Phần mềm mới'}</h3>
                  <p className="text-muted-foreground text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                    {s?.description || "Phiên bản phần mềm mới nhất, tải về nhanh chóng và an toàn."}
                  </p>
                  
                  <div className={`flex items-center gap-3 ${viewMode === 'list' ? '' : 'justify-center'}`}>
                    <Link 
                      to="/software/$id" 
                      params={{ id: s?.slug || '' }}
                      className="h-11 px-6 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center hover:bg-primary/90 transition-all flex-1 shadow-glow"
                    >
                      Tải về
                    </Link>
                    <button className="size-11 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center hover:bg-white/[0.08] transition-all text-muted-foreground hover:text-white">
                      <MoreVertical className="size-5" />
                    </button>
                  </div>
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

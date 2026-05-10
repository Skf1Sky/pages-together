import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages.map((page, index) => (
      <button
        key={index}
        onClick={() => typeof page === 'number' && onPageChange(page)}
        disabled={page === '...'}
        className={`size-11 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${
          currentPage === page 
            ? "bg-primary text-white shadow-lg shadow-primary/20" 
            : page === '...' 
              ? "text-muted-foreground cursor-default" 
              : "bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
        }`}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="size-11 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center"
      >
        <ChevronLeft className="size-5" />
      </button>

      <div className="flex items-center gap-2 mx-2">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="size-11 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmLabel = "Xác nhận",
  variant = "danger"
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
          <AlertTriangle className="size-7" />
        </div>
        
        <h3 className="text-2xl font-black mb-3">{title}</h3>
        <p className="text-muted-foreground font-medium leading-relaxed mb-10">
          {description}
        </p>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl bg-secondary border border-border font-bold hover:bg-muted transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 h-14 rounded-2xl text-white font-black hover:shadow-xl transition-all ${variant === 'danger' ? 'bg-red-500 hover:shadow-red-500/20' : 'bg-primary hover:shadow-primary/20'}`}
          >
            {confirmLabel}
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
        >
          <X className="size-6" />
        </button>
      </div>
    </div>
  );
}

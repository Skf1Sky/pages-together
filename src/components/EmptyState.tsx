import { Ghost, Search, PackageX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "search" | "package" | "ghost";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon = "ghost", action }: EmptyStateProps) {
  const Icon = icon === "search" ? Search : icon === "package" ? PackageX : Ghost;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="size-24 rounded-[40px] bg-secondary border border-border flex items-center justify-center mb-8 text-muted-foreground/50">
        <Icon className="size-12" />
      </div>
      <h3 className="text-2xl font-black mb-3">{title}</h3>
      <p className="text-muted-foreground font-medium max-w-md mx-auto leading-relaxed mb-10">
        {description}
      </p>
      {action && (
        <button 
          onClick={action.onClick}
          className="h-14 px-8 rounded-2xl bg-primary text-white font-black hover:shadow-xl hover:shadow-primary/20 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

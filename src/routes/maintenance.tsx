import { createFileRoute } from "@tanstack/react-router";
import { Hammer, AlertTriangle, Clock } from "lucide-react";

export const Route = createFileRoute("/maintenance")({
  component: MaintenancePage,
});

function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-1000">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
          <div className="relative size-24 lg:size-32 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-8 animate-bounce-slow">
            <Hammer className="size-12 lg:size-16" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white uppercase">
            Hệ thống đang <span className="text-primary">Bảo trì</span>
          </h1>
          <p className="text-muted-foreground text-lg lg:text-xl font-medium max-w-lg mx-auto leading-relaxed">
            Chúng tôi đang nâng cấp hệ thống để mang lại trải nghiệm tốt nhất. 
            Vui lòng quay lại sau ít phút.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-border flex flex-col items-center gap-3">
            <Clock className="size-6 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Thời gian</span>
            <span className="text-sm font-bold text-white">~ 30 phút</span>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-border flex flex-col items-center gap-3">
            <AlertTriangle className="size-6 text-yellow-500" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Trạng thái</span>
            <span className="text-sm font-bold text-white">Nâng cấp DB</span>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-border flex flex-col items-center gap-3">
            <Hammer className="size-6 text-blue-500" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tiến độ</span>
            <span className="text-sm font-bold text-white">85%</span>
          </div>
        </div>

        <div className="pt-10">
          <p className="text-muted-foreground text-sm font-medium">
            Mọi thắc mắc vui lòng liên hệ <a href="mailto:support@xapps.com" className="text-primary hover:underline font-bold">support@xapps.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Globe, Image as ImageIcon, Mail, Phone, MapPin, Shield, Bell, Database } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});
function AdminSettings() {
  const [siteName, setSiteName] = useState("X Apps");
  const [siteDescription, setSiteDescription] = useState("Hệ thống download phần mềm hàng đầu");
  const [email, setEmail] = useState("support@xapps.com");
  const [phone, setPhone] = useState("0123 456 789");
  const [address, setAddress] = useState("123 Đường ABC, Quận X, TP. HCM");
  const [isMaintenance, setIsMaintenance] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('is_maintenance_mode') === 'true';
    }
    return false;
  });

  const toggleMaintenance = () => {
    const newState = !isMaintenance;
    setIsMaintenance(newState);
    localStorage.setItem('is_maintenance_mode', String(newState));
    if (newState) {
      toast.warning("Hệ thống đã chuyển sang chế độ bảo trì!");
    } else {
      toast.success("Hệ thống đã hoạt động trở lại bình thường.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đã cập nhật cài đặt hệ thống thành công!");
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <h1 className="text-[32px] font-black tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground font-medium">Cấu hình thông tin cơ bản và bảo mật cho website.</p>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* General Settings */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Globe className="size-5 text-primary" />
              Thông tin chung
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tên Website</label>
                <input 
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full h-12 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Slogan / Title</label>
                <input 
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="w-full h-12 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Logo URL</label>
              <div className="flex gap-4">
                <input 
                  placeholder="https://example.com/logo.png"
                  className="flex-1 h-12 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                />
                <button type="button" className="h-12 px-6 rounded-xl bg-white/[0.05] border border-border flex items-center gap-2 font-bold hover:bg-white/[0.08] transition-all">
                  <ImageIcon className="size-4" />
                  Tải lên
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Mail className="size-5 text-primary" />
              Thông tin liên hệ (Footer)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email hỗ trợ</label>
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Số điện thoại</label>
                <input 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Địa chỉ văn phòng</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full p-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 focus:outline-none transition-all font-medium resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-6">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <Shield className="size-5 text-primary" />
              Bảo mật & Hệ thống
            </h3>
            
            <div className="space-y-4">
              <button 
                type="button"
                onClick={toggleMaintenance}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-border hover:bg-white/[0.05] transition-all text-left"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Chế độ bảo trì</span>
                  <span className={`text-[10px] font-black uppercase ${isMaintenance ? "text-yellow-500" : "text-muted-foreground"}`}>
                    {isMaintenance ? "Đang bật" : "Đang tắt"}
                  </span>
                </div>
                <div className={`w-14 h-8 rounded-full border border-border p-1 transition-all ${isMaintenance ? "bg-primary/20 border-primary" : "bg-white/[0.05]"}`}>
                  <div className={`size-5.5 rounded-full transition-all ${isMaintenance ? "bg-primary translate-x-6" : "bg-muted-foreground"}`} />
                </div>
              </button>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-border">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Đăng ký người dùng</span>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase">Active</span>
                </div>
                <div className="size-10 rounded-full bg-primary" />
              </div>
            </div>

            <button type="button" className="w-full h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
              <Database className="size-4" />
              Xóa Cache Hệ Thống
            </button>
          </div>

          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-6">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <Bell className="size-5 text-primary" />
              Thông báo
            </h3>
            <p className="text-sm text-muted-foreground font-medium">Nhận thông báo qua Email khi có yêu cầu hỗ trợ mới.</p>
            <div className="h-12 px-5 bg-white/[0.03] border border-border rounded-xl flex items-center justify-between">
              <span className="text-sm font-bold">Email Notifications</span>
              <div className="size-6 rounded-full bg-primary" />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-16 rounded-[24px] bg-primary text-white font-black text-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <Save className="size-6" />
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}

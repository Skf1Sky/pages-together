import { createFileRoute } from "@tanstack/react-router";
import { UserCircle, Shield, Key, Mail, Camera, Save, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/profile")({
  component: AdminProfile,
});

function AdminProfile() {
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
      loading: 'Đang cập nhật mật khẩu...',
      success: 'Mật khẩu đã được thay đổi thành công!',
      error: 'Lỗi khi cập nhật mật khẩu.',
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h2 className="text-[32px] font-black tracking-tight flex items-center gap-3">
          <UserCircle className="size-8 text-primary" />
          Hồ sơ quản trị viên
        </h2>
        <p className="text-muted-foreground font-medium">Quản lý thông tin cá nhân và cài đặt bảo mật của bạn.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-border rounded-[32px] p-8 shadow-premium text-center">
            <div className="relative inline-block mb-6">
              <div className="size-32 rounded-[40px] bg-primary/10 border-2 border-primary/20 p-1.5 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt="Avatar" 
                  className="size-full object-cover rounded-[28px]"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 size-10 rounded-xl bg-primary text-white flex items-center justify-center border-4 border-[#0a0a0a] hover:scale-110 transition-all">
                <Camera className="size-5" />
              </button>
            </div>
            
            <h3 className="text-2xl font-black mb-1">{user?.name}</h3>
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-6">Hệ thống Quản trị viên</p>
            
            <div className="space-y-4 pt-6 border-t border-border/50 text-left">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center text-muted-foreground">
                  <Mail className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Email</span>
                  <span className="text-sm font-bold">{user?.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center text-muted-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Vai trò</span>
                  <span className="text-sm font-bold">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="lg:col-span-7">
          <div className="bg-card border border-border rounded-[32px] p-8 lg:p-10 shadow-premium">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Key className="size-5" />
              </div>
              <h3 className="text-xl font-black">Thay đổi mật khẩu</h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Mật khẩu hiện tại</label>
                <input 
                  required
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full h-14 px-5 bg-white/[0.02] border border-border rounded-xl focus:border-primary/50 transition-all outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Mật khẩu mới</label>
                  <input 
                    required
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full h-14 px-5 bg-white/[0.02] border border-border rounded-xl focus:border-primary/50 transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Xác nhận mật khẩu</label>
                  <input 
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full h-14 px-5 bg-white/[0.02] border border-border rounded-xl focus:border-primary/50 transition-all outline-none font-medium"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                <AlertCircle className="size-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Đảm bảo mật khẩu mới có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt để đảm bảo an toàn cho tài khoản của bạn.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full h-14 rounded-2xl bg-primary text-white font-black hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <Save className="size-5" />
                Cập nhật mật khẩu ngay
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

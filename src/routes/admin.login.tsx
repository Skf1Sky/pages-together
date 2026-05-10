import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, User, ShieldCheck, ArrowRight, Github } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate login delay
    setTimeout(() => {
      if (username === "admin" && password === "Thienvip1") {
        setLoading(false);
        login({ username, rememberMe });
        toast.success(`Chào mừng trở lại, ${username}!`);
        navigate({ to: "/admin" });
      } else {
        setLoading(false);
        setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
        toast.error("Đăng nhập thất bại");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.1),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.05),transparent_40%)]">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6 shadow-[0_0_40px_-10px_rgba(225,29,72,0.3)]">
            <ShieldCheck className="size-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Quản trị hệ thống</h1>
          <p className="text-muted-foreground font-medium">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[32px] p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold animate-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Tên đăng nhập</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="size-[18px]" />
                </div>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-[54px] pl-12 pr-4 bg-secondary/30 border border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-muted-foreground">Mật khẩu</label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Quên mật khẩu?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="size-[18px]" />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[54px] pl-12 pr-4 bg-secondary/30 border border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="size-4 accent-primary rounded-lg"
              />
              <label htmlFor="remember" className="text-sm font-bold text-muted-foreground cursor-pointer">Duy trì đăng nhập</label>
            </div>

            <button
              disabled={loading}
              className="w-full h-[58px] mt-2 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng nhập ngay
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50">
            <button className="w-full h-12 rounded-xl bg-white/[0.03] border border-border/50 flex items-center justify-center gap-3 text-sm font-bold hover:bg-white/[0.06] transition-colors">
              <Github className="size-5" />
              Đăng nhập với GitHub
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
            ← Quay lại trang người dùng
          </Link>
        </div>
      </div>
    </div>
  );
}

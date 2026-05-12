import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, User, ShieldCheck, ArrowRight, Github } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch() as any;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error("Đăng nhập thất bại: " + error.message);
      } else {
        toast.success("Đăng nhập thành công!");
        const redirectTo = search.redirect || "/admin";
        navigate({ to: redirectTo });
      }
    } catch (err: any) {
      setError("Đã xảy ra lỗi không xác định.");
      toast.error("Đã xảy ra lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.1),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.05),transparent_40%)]">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6 shadow-[0_0_40px_-10px_rgba(225,29,72,0.3)]">
            <ShieldCheck className="size-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Đăng nhập hệ thống</h1>
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
              <label className="text-sm font-bold text-muted-foreground ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="size-[18px]" />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[54px] pl-12 pr-4 bg-secondary/30 border border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  placeholder="admin@example.com"
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
            <button 
              type="button"
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
              className="w-full h-12 rounded-xl bg-white/[0.03] border border-border/50 flex items-center justify-center gap-3 text-sm font-bold hover:bg-white/[0.06] transition-colors"
            >
              <Github className="size-5" />
              Đăng nhập với GitHub
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

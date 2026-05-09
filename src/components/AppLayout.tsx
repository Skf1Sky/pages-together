import { Link } from "@tanstack/react-router";
import { LogIn, Heart, Github, Twitter, Mail } from "lucide-react";

export function AppLayout({ children, activeTab }: { children: React.ReactNode; activeTab?: string }) {
  const tabs = ["Trang chủ", "Danh mục", "Phần mềm", "Cộng đồng", "Quản trị"];
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-50 glass border-b border-border/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16 w-full">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.55_0.22_270)] flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">K</div>
                <span className="font-bold text-xl tracking-tight">KT<span className="text-primary">NET</span></span>
              </Link>
              <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
                {[
                  { name: "Trang chủ", path: "/" },
                  { name: "Phần mềm", path: "/" },
                ].map((t) => (
                  <Link key={t.name} to={t.path} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === t.name ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                    {t.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin" className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all">
                <LogIn className="size-4" />
                Đăng nhập
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">K</div>
                  <span className="font-bold text-lg tracking-tight">KTNET</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Nền tảng chia sẻ phần mềm an toàn, chất lượng hàng đầu Việt Nam. Tải xuống nhanh chóng, cập nhật liên tục.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-4">Sản phẩm</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><button className="hover:text-primary transition">Phần mềm mới</button></li>
                  <li><button className="hover:text-primary transition">Phần mềm hot</button></li>
                  <li><button className="hover:text-primary transition">Bộ sưu tập</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-4">Hỗ trợ</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><button className="hover:text-primary transition">Hướng dẫn sử dụng</button></li>
                  <li><button className="hover:text-primary transition">Điều khoản dịch vụ</button></li>
                  <li><button className="hover:text-primary transition">Chính sách bảo mật</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-4">Kết nối</h4>
                <div className="flex gap-4">
                  <button className="size-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"><Github className="size-4" /></button>
                  <button className="size-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"><Twitter className="size-4" /></button>
                  <button className="size-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"><Mail className="size-4" /></button>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-muted-foreground">© 2024 KTNET. Tất cả quyền được bảo lưu.</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                Được làm với <Heart className="size-3 text-red-500 fill-red-500" /> tại Việt Nam
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

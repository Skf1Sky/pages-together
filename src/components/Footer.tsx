import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-10 bg-card border-t border-border rounded-t-[32px] p-10 lg:p-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand & Description */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative size-[34px]">
              <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-2 w-full bg-[#d4d4d8] rounded-full rotate-45 transition-transform group-hover:rotate-[225deg] duration-500" />
              <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-2 w-full bg-brand-primary rounded-full -rotate-45 transition-transform group-hover:-rotate-[135deg] duration-500" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter">
              X <span className="text-brand-primary">Apps</span>
            </h2>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Nền tảng chia sẻ phần mềm hàng đầu với tốc độ tải cực nhanh, giao diện hiện đại và bảo mật tuyệt đối.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="size-10 rounded-full bg-white/[0.03] border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
              <Facebook className="size-5" />
            </a>
            <a href="#" className="size-10 rounded-full bg-white/[0.03] border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
              <Twitter className="size-5" />
            </a>
            <a href="#" className="size-10 rounded-full bg-white/[0.03] border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
              <Instagram className="size-5" />
            </a>
            <a href="#" className="size-10 rounded-full bg-white/[0.03] border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
              <Youtube className="size-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6">Liên kết nhanh</h4>
          <ul className="flex flex-col gap-4">
            <li><Link to="/softwares" className="text-muted-foreground hover:text-primary transition-colors text-sm">Tất cả phần mềm</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">Giới thiệu</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Liên hệ & Hỗ trợ</Link></li>
            <li><Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors text-sm">Quản trị viên</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-lg font-bold mb-6">Danh mục</h4>
          <ul className="flex flex-col gap-4">
            <li><Link to="/softwares" search={{ category: "Xây Dựng" }} className="text-muted-foreground hover:text-primary transition-colors text-sm">Xây Dựng</Link></li>
            <li><Link to="/softwares" search={{ category: "Đồ Hoạ" }} className="text-muted-foreground hover:text-primary transition-colors text-sm">Đồ Hoạ</Link></li>
            <li><Link to="/softwares" search={{ category: "Văn Phòng" }} className="text-muted-foreground hover:text-primary transition-colors text-sm">Văn Phòng</Link></li>
            <li><Link to="/softwares" className="text-muted-foreground hover:text-primary transition-colors text-sm">Ứng dụng khác</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-6">Thông tin liên hệ</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <MapPin className="size-5 text-primary shrink-0" />
              <span className="text-muted-foreground text-sm">123 Đường ABC, Quận X, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-5 text-primary shrink-0" />
              <span className="text-muted-foreground text-sm">0123 456 789</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-5 text-primary shrink-0" />
              <span className="text-muted-foreground text-sm">support@xapps.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted-foreground text-[13px]">
          © {new Date().getFullYear()} X Apps. All rights reserved.
        </p>
        <div className="flex items-center gap-8">
          <a href="#" className="text-muted-foreground hover:text-white transition-colors text-[13px]">Điều khoản sử dụng</a>
          <a href="#" className="text-muted-foreground hover:text-white transition-colors text-[13px]">Chính sách bảo mật</a>
          <a href="#" className="text-muted-foreground hover:text-white transition-colors text-[13px]">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}

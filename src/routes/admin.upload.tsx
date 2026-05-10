import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Save, X, Plus, Info, ListOrdered, Download, Image as ImageIcon, Upload } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/admin/upload")({
  component: UploadSoftware,
});

function FormSection({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: any }) {
  return (
    <div className="bg-card border border-border rounded-[28px] p-8 mb-6 shadow-premium">
      <div className="flex items-center gap-3.5 mb-8">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Icon className="size-5" />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", value, onChange, className = "" }: any) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <label className="text-sm font-bold text-muted-foreground ml-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-5 h-14 bg-[#151515] rounded-[16px] border border-border focus:border-primary/50 focus:outline-none transition-all font-medium text-white placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

function UploadSoftware() {
  const [versions, setVersions] = useState([{ v: "", d: "", s: "" }]);
  const [iconUrl, setIconUrl] = useState("");

  const addVersion = () => setVersions([...versions, { v: "", d: "", s: "" }]);
  const removeVersion = (index: number) => setVersions(versions.filter((_, i) => i !== index));

  const rightPanel = (
    <div className="bg-card border border-border rounded-[28px] p-7 flex flex-col gap-6">
      <h3 className="text-xl font-extrabold tracking-tight">Trạng thái</h3>
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="text-sm text-primary font-bold mb-1">Đang soạn thảo</div>
        <div className="text-xs text-muted-foreground leading-relaxed">Phần mềm chưa được công khai. Nhấn "Lưu" để cập nhật.</div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ngày tạo:</span>
          <span className="font-medium text-white">10/05/2024</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Người đăng:</span>
          <span className="font-medium text-white">Admin</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="size-10 rounded-xl bg-[#1a1a1a] border border-border flex items-center justify-center hover:bg-white/[0.05] transition-all group">
            <ArrowLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <h1 className="text-2xl font-black tracking-tight">Đăng phần mềm mới</h1>
        </div>
        <div className="flex gap-3">
          <button className="h-11 px-6 rounded-xl bg-[#1a1a1a] border border-border font-bold text-sm hover:bg-white/[0.05] transition-all">
            Huỷ
          </button>
          <button className="h-11 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
            <Save className="size-4" />
            Lưu dữ liệu
          </button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="mt-2">
        {/* Basic Info */}
        <FormSection title="Thông tin cơ bản" icon={Info}>
          <InputField label="Tên phần mềm" placeholder="VD: Visual Studio Code" className="md:col-span-2" />
          
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-muted-foreground ml-1">Icon phần mềm</label>
            <div className="flex gap-4">
              <div 
                onClick={() => document.getElementById("icon-upload")?.click()}
                className="size-[120px] rounded-[24px] bg-[#151515] border-2 border-dashed border-border flex flex-col items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                {iconUrl ? (
                  <img src={iconUrl} alt="Icon preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="size-6 text-muted-foreground/30 group-hover:text-primary group-hover:scale-110 transition-all mb-2" />
                    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Tải lên</span>
                  </>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Hoặc dán URL icon tại đây (https://...)"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    className="w-full px-5 h-14 bg-[#151515] rounded-[16px] border border-border focus:border-primary/50 focus:outline-none transition-all font-medium text-white"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => document.getElementById("icon-upload")?.click()}
                  className="h-12 px-6 rounded-xl bg-white/[0.03] border border-border text-sm font-bold hover:bg-white/[0.06] transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="size-4" />
                  Chọn ảnh từ máy tính
                </button>
                <input 
                  id="icon-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setIconUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-bold text-muted-foreground ml-1">Danh mục</label>
            <div className="relative">
              <select className="w-full px-5 h-14 bg-[#151515] rounded-[16px] border border-border focus:border-primary/50 focus:outline-none transition-all font-bold appearance-none text-white cursor-pointer">
                <option>Xây Dựng</option>
                <option>Đồ Hoạ</option>
                <option>Văn Phòng</option>
                <option>Developer Tools</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <Plus className="size-4 rotate-45" />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Versions */}
        <div className="bg-card border border-border rounded-[28px] p-8 mb-6 shadow-premium">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Download className="size-5" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">Danh sách phiên bản</h2>
            </div>
            <button 
              type="button"
              onClick={addVersion}
              className="flex items-center gap-2 h-11 px-5 rounded-xl bg-[#1a1a1a] border border-border text-sm font-bold hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              <Plus className="size-4" /> Thêm bản mới
            </button>
          </div>
          
          <div className="space-y-4">
            {versions.map((v, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-white/[0.02] border border-border rounded-[24px] relative group">
                <InputField label="Phiên bản" placeholder="1.89.1" />
                <InputField label="Link tải về" placeholder="https://..." />
                {versions.length > 1 && (
                  <button 
                    onClick={() => removeVersion(i)}
                    className="absolute -top-2.5 -right-2.5 size-9 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all z-10"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Installation Guide */}
        <div className="bg-card border border-border rounded-[28px] p-8 mb-6 shadow-premium">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <ListOrdered className="size-5" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Hướng dẫn cài đặt / Crack</h2>
          </div>
          <textarea 
            rows={8} 
            placeholder="Nhập các bước hướng dẫn, mỗi bước một dòng..."
            className="w-full p-6 bg-[#151515] rounded-[24px] border border-border focus:border-primary/50 focus:outline-none transition-all font-medium leading-relaxed text-white placeholder:text-muted-foreground/30 resize-none"
          />
        </div>
      </form>
    </div>
  );
}


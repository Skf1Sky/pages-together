import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Save, X, Plus, Info, FileText, ListOrdered, Download } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/admin/upload")({
  component: UploadSoftware,
});

function FormSection({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: any }) {
  return (
    <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-premium mb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="size-5" />
        </div>
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", value, onChange, className = "" }: any) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-bold text-muted-foreground ml-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-5 h-14 bg-secondary/50 rounded-2xl border border-transparent focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium"
      />
    </div>
  );
}

function UploadSoftware() {
  const [versions, setVersions] = useState([{ v: "", d: "", s: "" }]);

  const addVersion = () => setVersions([...versions, { v: "", d: "", s: "" }]);
  const removeVersion = (index: number) => setVersions(versions.filter((_, i) => i !== index));

  return (
    <div className="pb-20">
      {/* Header - Local to this child page */}
      <header className="h-16 bg-card/30 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50 mb-8 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="size-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all group">
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <h1 className="font-black text-lg tracking-tight">Đăng phần mềm mới</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-lg border border-border font-bold text-xs hover:bg-secondary/50 transition-all">Hủy</button>
          <button className="px-5 py-1.5 rounded-lg bg-primary text-primary-foreground font-black text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <Save className="size-3.5" />
            Lưu
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Basic Info */}
          <FormSection title="Thông tin cơ bản" icon={Info}>
            <InputField label="Tên phần mềm" placeholder="VD: Visual Studio Code" className="md:col-span-2" />
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Danh mục</label>
              <select className="w-full px-5 h-12 bg-secondary/50 rounded-xl border border-transparent focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold appearance-none">
                <option>Xây Dựng</option>
                <option>Đồ Hoạ</option>
                <option>Văn Phòng</option>
              </select>
            </div>
          </FormSection>

          {/* Versions */}
          <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-premium mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Download className="size-5" />
                </div>
                <h2 className="text-xl font-black">Danh sách phiên bản</h2>
              </div>
              <button 
                type="button"
                onClick={addVersion}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Plus className="size-4" /> Thêm bản mới
              </button>
            </div>
            
            <div className="space-y-4">
              {versions.map((v, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-secondary/30 rounded-2xl relative group">
                  <InputField label="Phiên bản" placeholder="1.89.1" />
                  <InputField label="Link tải về" placeholder="https://..." />
                  {versions.length > 1 && (
                    <button 
                      onClick={() => removeVersion(i)}
                      className="absolute -top-2 -right-2 size-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Installation Guide */}
          <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-premium">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ListOrdered className="size-5" />
              </div>
              <h2 className="text-xl font-black">Hướng dẫn cài đặt / Crack</h2>
            </div>
            <textarea 
              rows={8} 
              placeholder="Nhập các bước hướng dẫn, mỗi bước một dòng..."
              className="w-full p-6 bg-secondary/50 rounded-[2rem] border border-transparent focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium leading-relaxed"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

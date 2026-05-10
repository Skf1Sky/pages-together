import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Save, X, Plus, Info, ListOrdered, Download, Image as ImageIcon, Upload } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { softwares } from "@/lib/software-data";

export const Route = createFileRoute("/admin/edit/$id")({
  component: EditSoftware,
  loader: ({ params }) => {
    const sw = softwares.find((s) => s.id === params.id);
    if (!sw) throw notFound();
    return sw;
  },
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

function EditSoftware() {
  const s = Route.useLoaderData();
  
  // Initialize state with existing data
  const [name, setName] = useState(s.name);
  const [category, setCategory] = useState(s.category);
  const [description, setDescription] = useState(s.description || "");
  const [versions, setVersions] = useState(s.versions.map(v => ({ v: v.v, d: v.d, s: v.s })));
  const [iconUrl, setIconUrl] = useState(""); // Simplified for demo

  const addVersion = () => setVersions([...versions, { v: "", d: new Date().toLocaleDateString('vi-VN'), s: "" }]);
  const removeVersion = (index: number) => setVersions(versions.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-5 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Link to="/admin/softwares" className="size-10 rounded-xl bg-[#1a1a1a] border border-border flex items-center justify-center hover:bg-white/[0.05] transition-all group">
            <ArrowLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight">Chỉnh sửa phần mềm</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{s.name} (ID: {s.id})</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/softwares" className="h-11 px-6 rounded-xl bg-[#1a1a1a] border border-border font-bold text-sm hover:bg-white/[0.05] transition-all flex items-center">
            Huỷ
          </Link>
          <button className="h-11 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
            <Save className="size-4" />
            Cập nhật
          </button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="mt-2">
        {/* Basic Info */}
        <FormSection title="Thông tin cơ bản" icon={Info}>
          <InputField 
            label="Tên phần mềm" 
            placeholder="VD: Visual Studio Code" 
            className="md:col-span-2" 
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-muted-foreground ml-1">Icon phần mềm</label>
            <div className="flex gap-4">
              <div 
                className="size-[120px] rounded-[24px] bg-[#151515] border-2 border-dashed border-border flex flex-col items-center justify-center shrink-0 overflow-hidden"
              >
                <div 
                  className="size-full flex items-center justify-center text-4xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${s.color}, oklch(from ${s.color} l c h / 0.7))` }}
                >
                  {s.letter}
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Thay đổi URL icon (https://...)"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    className="w-full px-5 h-14 bg-[#151515] rounded-[16px] border border-border focus:border-primary/50 focus:outline-none transition-all font-medium text-white"
                  />
                </div>
                <button 
                  type="button"
                  className="h-12 px-6 rounded-xl bg-white/[0.03] border border-border text-sm font-bold hover:bg-white/[0.06] transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="size-4" />
                  Thay đổi ảnh từ máy tính
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-bold text-muted-foreground ml-1">Danh mục</label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 h-14 bg-[#151515] rounded-[16px] border border-border focus:border-primary/50 focus:outline-none transition-all font-bold appearance-none text-white cursor-pointer"
              >
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

          <div className="md:col-span-2 space-y-2.5">
            <label className="text-sm font-bold text-muted-foreground ml-1">Mô tả ngắn</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-6 bg-[#151515] rounded-[24px] border border-border focus:border-primary/50 focus:outline-none transition-all font-medium leading-relaxed text-white h-32"
            />
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
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 bg-white/[0.02] border border-border rounded-[24px] relative group">
                <InputField 
                  label="Phiên bản" 
                  placeholder="1.89.1" 
                  value={v.v}
                  onChange={(e: any) => {
                    const newV = [...versions];
                    newV[i].v = e.target.value;
                    setVersions(newV);
                  }}
                />
                <InputField 
                  label="Dung lượng" 
                  placeholder="VD: 1.2 GB" 
                  value={v.s}
                  onChange={(e: any) => {
                    const newV = [...versions];
                    newV[i].s = e.target.value;
                    setVersions(newV);
                  }}
                />
                <InputField 
                  label="Ngày phát hành" 
                  placeholder="VD: 05/05/2024" 
                  value={v.d}
                  onChange={(e: any) => {
                    const newV = [...versions];
                    newV[i].d = e.target.value;
                    setVersions(newV);
                  }}
                />
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

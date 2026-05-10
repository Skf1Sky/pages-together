import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save, X, Plus, Info, ListOrdered, Download, Image as ImageIcon, Upload, FileArchive, CheckCircle2, AlertCircle, Trash2, Layout, Type, Bold, Italic, Link as LinkIcon, List } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { softwares } from "@/lib/software-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/edit/$id")({
  component: EditSoftware,
  loader: ({ params }) => {
    const sw = softwares.find((s) => s.id === params.id);
    if (!sw) throw notFound();
    return sw;
  },
});

// --- COMPONENTS ---

function FormSection({ title, children, icon: Icon, fullWidth = false }: any) {
  return (
    <div className="bg-card border border-border rounded-[32px] p-8 mb-8 shadow-premium overflow-hidden">
      <div className="flex items-center gap-3.5 mb-8">
        <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Icon className="size-5" />
        </div>
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
      </div>
      <div className={`grid grid-cols-1 ${fullWidth ? "" : "md:grid-cols-2"} gap-8`}>
        {children}
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", value, onChange, error }: any) {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center px-1">
        <label className="text-sm font-bold text-muted-foreground">{label}</label>
        {error && <span className="text-[10px] font-black text-red-500 uppercase">{error}</span>}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-5 h-14 bg-white/[0.02] rounded-2xl border transition-all font-medium text-white placeholder:text-muted-foreground/30 focus:outline-none ${error ? "border-red-500/50 bg-red-500/5" : "border-border focus:border-primary/50 focus:bg-primary/[0.02]"}`}
      />
    </div>
  );
}

function EditSoftware() {
  const s = Route.useLoaderData();
  const navigate = useNavigate();
  
  const [name, setName] = useState(s.name);
  const [category, setCategory] = useState(s.category);
  const [iconUrl, setIconUrl] = useState(s.color); // Mocking icon
  const [screenshots, setScreenshots] = useState<string[]>(s.screenshots || []);
  const [versions, setVersions] = useState(s.versions.map(v => ({ ...v, file: null as File | null, uploading: false, progress: 100 })));
  const [description, setDescription] = useState(s.description || "");
  const [guide, setGuide] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    toast.success("Đã cập nhật phần mềm thành công!");
    setTimeout(() => navigate({ to: "/admin/softwares" }), 1000);
  };

  const handleScreenshotDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setScreenshots(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/softwares" className="size-11 rounded-2xl bg-white/[0.03] border border-border flex items-center justify-center hover:bg-white/[0.08] transition-all group">
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Chỉnh sửa phần mềm</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{s.name} (ID: {s.id})</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="h-12 px-6 rounded-2xl bg-white/[0.03] border border-border font-bold text-sm hover:bg-red-500/10 transition-all">Huỷ</button>
          <button 
            onClick={handleSave}
            className="h-12 px-8 rounded-2xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Save className="size-5" />
            Lưu thay đổi
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col">
          <FormSection title="Thông tin cơ bản" icon={Info}>
            <div className="md:col-span-2">
              <InputField label="Tên phần mềm" value={name} onChange={(e: any) => setName(e.target.value)} />
            </div>
            
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-muted-foreground ml-1">Icon</label>
              <div 
                className="aspect-square size-32 rounded-[32px] border-2 border-dashed border-primary bg-primary/5 flex items-center justify-center overflow-hidden"
              >
                <div className="size-full flex items-center justify-center text-4xl font-black text-white" style={{ background: s.color }}>
                  {s.letter}
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-bold text-muted-foreground ml-1">Danh mục</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-5 h-14 bg-white/[0.02] rounded-2xl border border-border focus:border-primary/50 transition-all font-bold text-white appearance-none cursor-pointer">
                <option value="Xây Dựng">Xây Dựng</option>
                <option value="Đồ Hoạ">Đồ Hoạ</option>
                <option value="Văn Phòng">Văn Phòng</option>
              </select>
            </div>
          </FormSection>

          <FormSection title="Screenshot Gallery" icon={ImageIcon} fullWidth>
            <div 
              onDragOver={e => e.preventDefault()}
              onDrop={handleScreenshotDrop}
              className="w-full min-h-[200px] rounded-[32px] border-2 border-dashed border-border bg-white/[0.01] flex flex-col items-center justify-center p-8 group hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {screenshots.map((src, i) => (
                  <div key={i} className="relative size-24 rounded-2xl overflow-hidden border border-border">
                    <img src={src} className="size-full object-cover" />
                    <button className="absolute top-1 right-1 size-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                <div className="size-24 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                  <Plus className="size-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Kéo thả hoặc nhấn để tải lên nhiều ảnh màn hình</p>
            </div>
          </FormSection>

          <FormSection title="Mô tả & Hướng dẫn" icon={Type} fullWidth>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground ml-1">Giới thiệu phần mềm</label>
                <div className="border border-border rounded-[24px] overflow-hidden focus-within:border-primary/50 transition-all">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-border">
                    <Bold className="size-4" /><Italic className="size-4" /><LinkIcon className="size-4" /><List className="size-4" />
                  </div>
                  <textarea rows={6} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-6 bg-transparent focus:outline-none font-medium leading-relaxed resize-none" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground ml-1">Các bước cài đặt</label>
                <textarea rows={4} value={guide} onChange={e => setGuide(e.target.value)} className="w-full p-6 bg-white/[0.02] border border-border rounded-[24px] focus:outline-none font-medium leading-relaxed resize-none transition-all" />
              </div>
            </div>
          </FormSection>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-8 shadow-premium">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">Phiên bản</h3>
              <button className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary transition-all">
                <Plus className="size-5" />
              </button>
            </div>
            <div className="space-y-6">
              {versions.map((v, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-border rounded-[28px] space-y-4 relative group">
                  <InputField label="Version" value={v.v} onChange={(e: any) => {
                    const next = [...versions];
                    next[i].v = e.target.value;
                    setVersions(next);
                  }} />
                  <div className="h-14 px-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between text-xs font-bold text-primary">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="size-4" />
                      Đã có tệp ({v.s})
                    </div>
                    <button className="text-[10px] uppercase hover:underline">Thay đổi</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

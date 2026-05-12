import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save, X, Plus, Info, ListOrdered, Download, Image as ImageIcon, Upload, FileArchive, CheckCircle2, AlertCircle, Trash2, Layout, Type, Bold, Italic, Link as LinkIcon, List } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { createSoftware, createVersion } from "@/lib/api/softwares";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/upload")({
  component: UploadSoftware,
});

// --- COMPONENTS ---

function FormSection({ title, children, icon: Icon, fullWidth = false }: { title: string; children: React.ReactNode; icon: any; fullWidth?: boolean }) {
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

// --- MAIN COMPONENT ---

function UploadSoftware() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Xây Dựng");
  const [iconUrl, setIconUrl] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [versions, setVersions] = useState([{ v: "", s: "", d: new Date().toLocaleDateString('vi-VN'), link: "" }]);
  const [description, setDescription] = useState("");
  const [guide, setGuide] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Simulation: File Upload (Removed as per user request to use links)
  
  const handleIconDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setIconUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
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

  const validate = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên phần mềm!");
      return false;
    }
    
    const hasLink = versions.some(v => v.link && v.link.trim());
    if (!hasLink) {
      toast.error("Vui lòng nhập ít nhất 1 link download!");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (isSaving) return;

    if (validate()) {
      setIsSaving(true);
      
      const savePromise = async () => {
        // 1. Prepare software data
        const finalIcon = iconUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
        const slug = name.toLowerCase()
          .trim()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '');

        // 2. Create software record
        const software = await createSoftware({
          name,
          slug,
          letter: name.charAt(0).toUpperCase(),
          icon_url: finalIcon,
          category,
          description,
          system_requirements: {
            cpu: "Core i5 Gen 10",
            ram: "8 GB",
            disk: "10 GB",
            os: "Windows 10/11 64-bit"
          },
          is_active: true
        } as any);

        // 3. Create versions
        if (software && software.id) {
          const versionPromises = versions
            .filter(v => v.link && v.link.trim())
            .map(v => createVersion({
              software_id: software.id,
              version: v.v || "1.0.0",
              size: v.s || "Unknown size",
              release_date: new Date().toISOString().split('T')[0],
              download_url: v.link,
              is_latest: true
            }));
          
          if (versionPromises.length > 0) {
            await Promise.all(versionPromises);
          }
        }
        
        setIsSaving(false);
      };

      toast.promise(savePromise(), {
        loading: 'Đang lưu dữ liệu lên hệ thống...',
        success: 'Đã đăng phần mềm thành công!',
        error: (err) => {
          console.error("Save error:", err);
          setIsSaving(false);
          return `Lỗi: ${err.message || 'Không thể lưu dữ liệu'}`;
        },
      });

      setTimeout(() => navigate({ to: "/admin/softwares" }), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/softwares" className="size-11 rounded-2xl bg-white/[0.03] border border-border flex items-center justify-center hover:bg-white/[0.08] transition-all group">
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Đăng phần mềm mới</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Trạng thái: <span className="text-primary">Bản nháp</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="h-12 px-6 rounded-2xl bg-white/[0.03] border border-border font-bold text-sm hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all">Huỷ</button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`h-12 px-8 rounded-2xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Save className="size-5" />
            {isSaving ? "Đang xử lý..." : "Publish ngay"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col">
          {/* Section 1: Info */}
          <FormSection title="Thông tin cơ bản" icon={Info}>
            <div className="md:col-span-2">
              <InputField 
                label="Tên phần mềm (Bắt buộc)" 
                placeholder="VD: AutoCAD 2024" 
                value={name} 
                onChange={(e: any) => setName(e.target.value)}
                error={errors.name}
              />
            </div>
            
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-muted-foreground ml-1">Icon (Tùy chọn)</label>
              <div 
                onDragOver={e => e.preventDefault()}
                onDrop={handleIconDrop}
                onClick={() => document.getElementById("icon-input")?.click()}
                className={`aspect-square size-32 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative ${iconUrl ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
              >
                {iconUrl ? (
                  <img src={iconUrl} className="size-full object-cover" alt="Icon" />
                ) : (
                  <>
                    <Upload className="size-7 text-muted-foreground/30 group-hover:text-primary group-hover:scale-110 transition-all" />
                    <span className="text-[10px] font-black text-muted-foreground/40 mt-2 uppercase">Icon</span>
                  </>
                )}
                <input id="icon-input" type="file" hidden onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setIconUrl(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-bold text-muted-foreground ml-1">Danh mục (Tùy chọn)</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-5 h-14 bg-white/[0.02] rounded-2xl border border-border focus:border-primary/50 transition-all font-bold text-white appearance-none cursor-pointer"
              >
                <option value="Xây Dựng">Xây Dựng</option>
                <option value="Đồ Hoạ">Đồ Hoạ</option>
                <option value="Văn Phòng">Văn Phòng</option>
              </select>
            </div>
          </FormSection>

          {/* Section 2: Screenshots */}
          <FormSection title="Screenshot Gallery" icon={ImageIcon} fullWidth>
            <div 
              onDragOver={e => e.preventDefault()}
              onDrop={handleScreenshotDrop}
              className="w-full min-h-[200px] rounded-[32px] border-2 border-dashed border-border bg-white/[0.01] flex flex-col items-center justify-center p-8 group hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {screenshots.map((src, i) => (
                  <div key={i} className="relative size-24 rounded-2xl overflow-hidden border border-border animate-in zoom-in">
                    <img src={src} className="size-full object-cover" />
                    <button 
                      onClick={() => setScreenshots(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 size-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                <div onClick={() => document.getElementById("ss-input")?.click()} className="size-24 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                  <Plus className="size-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Kéo thả hoặc nhấn để tải lên nhiều ảnh màn hình</p>
              <input id="ss-input" type="file" multiple hidden onChange={e => {
                const files = Array.from(e.target.files || []);
                files.forEach(file => {
                  const reader = new FileReader();
                  reader.onload = () => setScreenshots(prev => [...prev, reader.result as string]);
                  reader.readAsDataURL(file);
                });
              }} />
            </div>
          </FormSection>

          {/* Section 3: Rich Text Description */}
          <FormSection title="Mô tả & Hướng dẫn" icon={Type} fullWidth>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground ml-1">Giới thiệu phần mềm (Rich Text)</label>
                <div className="border border-border rounded-[24px] overflow-hidden focus-within:border-primary/50 transition-all">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-border">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Bold className="size-4" /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Italic className="size-4" /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><LinkIcon className="size-4" /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><List className="size-4" /></button>
                  </div>
                  <textarea 
                    rows={6}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full p-6 bg-transparent focus:outline-none font-medium leading-relaxed resize-none"
                    placeholder="Nhập giới thiệu chi tiết về phần mềm..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground ml-1">Các bước cài đặt</label>
                <textarea 
                  rows={4}
                  value={guide}
                  onChange={e => setGuide(e.target.value)}
                  className="w-full p-6 bg-white/[0.02] border border-border rounded-[24px] focus:outline-none focus:border-primary/50 font-medium leading-relaxed resize-none transition-all"
                  placeholder="1. Tải về\n2. Giải nén\n3. Chạy setup..."
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Sidebar: Versions & Files */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-card border border-border rounded-[32px] p-8 flex flex-col gap-8 shadow-premium">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">Phiên bản & Tệp</h3>
              <button 
                onClick={() => setVersions([...versions, { v: "", s: "0 MB", d: new Date().toLocaleDateString('vi-VN'), file: null, uploading: false, progress: 0 }])}
                className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                <Plus className="size-5" />
              </button>
            </div>

            <div className="space-y-6">
              {versions.map((v, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-border rounded-[28px] space-y-5 relative group animate-in slide-in-from-right-4">
                  <button 
                    onClick={() => setVersions(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 size-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <X className="size-4" />
                  </button>

                  <InputField 
                    label="Version (Tùy chọn)" 
                    placeholder="VD: 1.0.0" 
                    value={v.v} 
                    onChange={(e: any) => {
                      const next = [...versions];
                      next[i].v = e.target.value;
                      setVersions(next);
                    }}
                    error={errors[`v-${i}`]}
                  />

                  <InputField 
                    label="Link Download (Bắt buộc)" 
                    placeholder="https://link-download.com/file.zip" 
                    value={v.link || ""} 
                    onChange={(e: any) => {
                      const next = [...versions];
                      next[i].link = e.target.value;
                      setVersions(next);
                    }}
                  />

                  <InputField 
                    label="Dung lượng (Tùy chọn)" 
                    placeholder="VD: 1.2 GB" 
                    value={v.s} 
                    onChange={(e: any) => {
                      const next = [...versions];
                      next[i].s = e.target.value;
                      setVersions(next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8">
            <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Lưu ý bảo mật</h4>
            <ul className="space-y-3">
              {[
                "File tối đa 2GB",
                "Chỉ chấp nhận .zip, .rar, .exe",
                "Hệ thống sẽ quét Virus tự động"
              ].map((note, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


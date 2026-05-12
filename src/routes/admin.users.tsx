import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { 
  Users, UserPlus, Search, MoreHorizontal, Trash2, Shield, User as UserIcon,
  Mail, Calendar, X, FileDown, Activity, Ban, CheckCircle2, Clock,
  ExternalLink, ChevronRight, Filter
} from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/Pagination";
import { getUsers, updateUserRole, updateUserStatus, deleteUserProfile } from "@/lib/api/users";

export const Route = createFileRoute("/admin/users")({
  loader: () => getUsers(),
  component: AdminUsers,
});

type UserRole = "admin" | "uploader" | "viewer";
type UserStatus = "active" | "banned" | "pending";

const ITEMS_PER_PAGE = 10;

function AdminUsers() {
  const router = useRouter();
  const initialUsers = Route.useLoaderData() as any[];
  const [users, setUsers] = useState<any[]>(initialUsers || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // User form state (for both Add and Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    email: "",
    role: "viewer" as UserRole,
    password: "" // Only for reference or future use
  });

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({ id: "", full_name: "", email: "", role: "viewer", password: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setModalMode('edit');
    setFormData({ 
      id: user.id, 
      full_name: user.full_name || "", 
      email: user.email || "", 
      role: user.role || "viewer",
      password: "" 
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        // 1. Create Auth User using Admin API (Does NOT logout current admin)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: formData.email,
          password: formData.password || "12345678", 
          email_confirm: true, // Mark as confirmed immediately
          user_metadata: {
            full_name: formData.full_name,
            role: formData.role
          }
        });

        if (authError) throw authError;

        // 2. Profile record update
        if (authData.user) {
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ 
              full_name: formData.full_name,
              role: formData.role 
            })
            .eq('id', authData.user.id);
          
          if (profileError) console.error("Profile update error:", profileError);
        }

        toast.success("Đã tạo tài khoản và tự động xác thực email!");
      } else {
        // Update existing user
        console.log("Updating user:", formData.id, formData.email);
        
        // 1. Update Auth data (Email/Password/Confirm)
        const updateData: any = {
          email: formData.email,
          email_confirm: true 
        };
        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        const { data: authUpdate, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
          formData.id,
          updateData
        );

        if (authError) {
          console.error("Auth Update Error:", authError);
          throw new Error(`Lỗi cập nhật Tài khoản: ${authError.message}`);
        }

        // 2. Update Profile data (Name/Role/Email)
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            full_name: formData.full_name,
            role: formData.role,
            email: formData.email // Sync email to profile
          })
          .eq('id', formData.id);

        if (profileError) {
          console.error("Profile Update Error:", profileError);
          throw new Error(`Lỗi cập nhật Hồ sơ: ${profileError.message}`);
        }
        
        toast.success("Đã cập nhật thông tin và xác thực tài khoản thành công!");
      }

      setIsModalOpen(false);
      // Force a hard refresh of the list data
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      router.invalidate();
    } catch (error: any) {
      console.error("General Error:", error);
      toast.error(error.message || "Đã có lỗi xảy ra");
    }
  };
  
  const filteredUsers = useMemo(() => {
    return (users || []).filter(u => 
      (u.full_name || u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'banned' : 'active';
    try {
      await updateUserStatus(id, nextStatus);
      setUsers(users.map(u => u.id === id ? { ...u, status: nextStatus } : u));
      toast.success(`Đã chuyển trạng thái người dùng sang ${nextStatus}`);
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    // 1. Prevent self-deletion
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user.id === id) {
      toast.error("Bạn không thể tự xóa chính mình!");
      return;
    }

    if (confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa VĨNH VIỄN người dùng này? Thao tác này không thể hoàn tác và sẽ xóa sạch mọi dữ liệu liên quan.")) {
      try {
        // 2. Delete from Auth (This handles cascading delete to profiles if configured, but we do it manually to be sure)
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
        if (authError) throw authError;

        // 3. Delete from Profiles (in case cascade is off)
        await supabase.from('profiles').delete().eq('id', id);

        setUsers(users.filter(u => u.id !== id));
        toast.success("Đã xóa vĩnh viễn người dùng thành công!");
        router.invalidate();
      } catch (error: any) {
        toast.error("Lỗi khi xóa: " + error.message);
      }
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUserRole(id, role);
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      toast.success(`Đã cập nhật quyền thành ${role}`);
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    // For simplicity, we use the same modal or just toast for now, 
    // but the request asks for a modal. I'll update the existing modal to be an edit modal.
  };

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Username", "Role", "Status", "Email", "JoinDate", "Downloads"];
    const rows = users.map(u => [u.id, u.name, u.username, u.role, u.status, u.email, u.joinDate, u.downloads]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    toast.success("Đã xuất danh sách CSV thành công!");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-black tracking-tight">Người dùng</h2>
          <p className="text-muted-foreground font-medium">Hệ thống có <span className="text-primary">{users.length}</span> tài khoản được đăng ký.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="h-[52px] px-6 rounded-2xl bg-white/[0.03] border border-border text-white font-bold flex items-center gap-2 hover:bg-white/[0.08] transition-all"
          >
            <FileDown className="size-5" />
            Xuất CSV
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="h-[52px] px-6 rounded-2xl bg-primary text-white font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <UserPlus className="size-5" />
            Thêm user mới
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {[
          { label: "Tổng Users", value: users.length, icon: Users, color: "text-blue-500" },
          { label: "Uploader", value: users.filter(u => u.role === 'uploader').length, icon: Activity, color: "text-orange-500" },
          { label: "Banned", value: users.filter(u => u.status === 'banned').length, icon: Ban, color: "text-red-500" },
          { label: "Active Today", value: 3, icon: Clock, color: "text-green-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-[28px] p-6 shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-24 bg-white/[0.02] rounded-bl-[64px] -z-10 group-hover:bg-primary/5 transition-colors" />
            <div className={`p-2 rounded-lg inline-block mb-3 ${stat.color} bg-white/[0.03]`}>
              <stat.icon className="size-5" />
            </div>
            <div className="text-3xl font-black mb-1">{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-premium">
        <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Tìm theo tên, email hoặc username..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-12 pl-11 pr-4 bg-white/[0.02] border border-border rounded-xl focus:outline-none focus:border-primary/50 transition-colors font-medium"
            />
          </div>
          <button className="h-12 px-6 rounded-xl bg-white/[0.03] border border-border text-sm font-bold flex items-center gap-2 hover:bg-white/[0.06] transition-all">
            <Filter className="size-4 text-muted-foreground" />
            Bộ lọc
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.01] text-muted-foreground text-[11px] font-black uppercase tracking-widest border-b border-border/50">
                <th className="px-6 py-5">Người dùng</th>
                <th className="px-6 py-5">Phân quyền</th>
                <th className="px-6 py-5">Trạng thái</th>
                <th className="px-6 py-5">Hoạt động</th>
                <th className="px-6 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-primary/[0.02] transition-colors group ${user.status === 'banned' ? "opacity-60" : ""}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl overflow-hidden border border-border bg-secondary shrink-0">
                        <img 
                          src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name || user.email}`} 
                          alt="Avatar" 
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm group-hover:text-primary transition-colors">{user.full_name || "N/A"}</div>
                        <div className="text-[10px] text-muted-foreground font-bold">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border bg-transparent cursor-pointer transition-all focus:outline-none ${
                        user.role === 'admin' 
                          ? "bg-primary/10 text-primary border-primary/20" 
                          : user.role === 'uploader'
                            ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                            : "bg-white/[0.05] text-muted-foreground border-border"
                      }`}
                    >
                      <option value="viewer" className="bg-card text-foreground">Viewer</option>
                      <option value="uploader" className="bg-card text-foreground">Uploader</option>
                      <option value="admin" className="bg-card text-foreground">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                        user.status === 'active' 
                          ? "bg-green-500/10 text-green-500 border-green-500/20" 
                          : user.status === 'pending'
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {user.status === 'active' ? <CheckCircle2 className="size-3" /> : user.status === 'pending' ? <Clock className="size-3" /> : <Ban className="size-3" />}
                      {user.status || 'active'}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Ngày tham gia</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="size-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors text-muted-foreground hover:text-white"
                        title="Xem lịch sử"
                      >
                        <ExternalLink className="size-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenEditModal(user)}
                        className="size-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors text-muted-foreground hover:text-primary"
                        title="Chỉnh sửa"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="size-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors text-muted-foreground hover:text-red-500"
                        title="Xóa"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* MODAL: ACTIVITY LOG */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="size-16 rounded-[24px] overflow-hidden border-2 border-primary/20 p-1">
                   <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`} 
                    className="size-full object-cover rounded-[18px]" 
                    loading="lazy"
                   />
                </div>
                <div>
                  <h3 className="text-2xl font-black">{selectedUser.name}</h3>
                  <p className="text-primary text-xs font-black uppercase tracking-widest">{selectedUser.role} • {selectedUser.downloads} downloads</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="size-12 rounded-2xl bg-white/[0.03] border border-border flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all">
                <X className="size-6" />
              </button>
            </header>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Quản lý tài khoản</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Phân quyền</label>
                  <select 
                    value={selectedUser.role} 
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
                      setSelectedUser({ ...selectedUser, role: newRole });
                      toast.success(`Đã đổi quyền sang ${newRole}`);
                    }}
                    className="w-full h-12 px-4 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 outline-none font-bold text-sm"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="uploader">Uploader</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Trạng thái</label>
                  <select 
                    value={selectedUser.status} 
                    onChange={(e) => {
                      const newStatus = e.target.value as UserStatus;
                      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
                      setSelectedUser({ ...selectedUser, status: newStatus });
                      toast.success(`Đã đổi trạng thái sang ${newStatus}`);
                    }}
                    className="w-full h-12 px-4 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 outline-none font-bold text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>

              <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground pt-4">Lịch sử hoạt động gần đây</h4>
              <div className="space-y-3">
                {[
                  { action: "Tải xuống AutoCAD 2024", time: "2 giờ trước", icon: FileDown },
                  { action: "Đăng nhập từ IP 192.168.1.1", time: "5 giờ trước", icon: Shield },
                  { action: "Tải xuống Photoshop CC 2024", time: "1 ngày trước", icon: FileDown },
                ].map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-border rounded-[24px] group hover:bg-primary/[0.02] hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                        <act.icon className="size-5" />
                      </div>
                      <span className="font-bold text-sm">{act.action}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedUser(null)}
              className="w-full h-14 mt-10 rounded-2xl bg-primary text-white font-black hover:shadow-xl hover:shadow-primary/20 transition-all"
            >
              Lưu và Đóng
            </button>
          </div>
        </div>
      )}

      {/* ADD/EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-card border border-border rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <header className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tight">
                {modalMode === 'add' ? 'Thêm user mới' : 'Chỉnh sửa user'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white"><X className="size-6" /></button>
            </header>

            <form onSubmit={handleSaveUser} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tên hiển thị</label>
                <input 
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full h-12 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 transition-colors font-medium outline-none"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full h-12 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 transition-colors font-medium outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                  {modalMode === 'add' ? 'Mật khẩu' : 'Mật khẩu mới (Để trống nếu không đổi)'}
                </label>
                <input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full h-12 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 transition-colors font-medium outline-none"
                  placeholder={modalMode === 'add' ? "Nhập mật khẩu ít nhất 6 ký tự" : "Nhập mật khẩu mới..."}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phân quyền</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["viewer", "uploader", "admin"] as UserRole[]).map(r => (
                    <button 
                      key={r}
                      type="button"
                      onClick={() => setFormData({...formData, role: r})}
                      className={`h-10 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${formData.role === r ? "bg-primary text-white border-primary" : "bg-white/[0.03] border-border text-muted-foreground hover:bg-white/[0.06]"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-[56px] rounded-[20px] bg-primary text-white font-black text-base hover:shadow-xl hover:shadow-primary/20 transition-all mt-4"
              >
                {modalMode === 'add' ? 'Tạo tài khoản ngay' : 'Lưu thay đổi'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

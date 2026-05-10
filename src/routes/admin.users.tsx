import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Shield, 
  User as UserIcon,
  Mail,
  Calendar,
  X,
  FileDown,
  Activity,
  Ban,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/Pagination";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

type UserRole = "admin" | "uploader" | "viewer";
type UserStatus = "active" | "banned" | "pending";

type UserData = {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  email: string;
  joinDate: string;
  downloads: number;
  lastActive: string;
};

const INITIAL_USERS: UserData[] = [
  { id: "1", name: "Administrator", username: "admin", role: "admin", status: "active", email: "admin@xapps.com", joinDate: "2024-01-10", downloads: 0, lastActive: "Just now" },
  { id: "2", name: "Trần Thế Vinh", username: "vinh.tt", role: "uploader", status: "active", email: "vinh.tt@xapps.com", joinDate: "2024-04-12", downloads: 42, lastActive: "2 hours ago" },
  { id: "3", name: "Nguyễn Văn A", username: "nva", role: "viewer", status: "pending", email: "nva@example.com", joinDate: "2024-05-01", downloads: 5, lastActive: "1 day ago" },
  { id: "4", name: "Lê Minh", username: "leminh", role: "viewer", status: "banned", email: "leminh@spam.com", joinDate: "2024-02-20", downloads: 120, lastActive: "3 months ago" },
];

const ITEMS_PER_PAGE = 10;

function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("viewer");

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserData = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUserName,
      username: newUserUsername,
      role: newUserRole,
      status: "active",
      email: `${newUserUsername}@xapps.com`,
      joinDate: new Date().toISOString().split('T')[0],
      downloads: 0,
      lastActive: "Now"
    };
    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    toast.success("Đã tạo người dùng mới thành công!");
    setNewUserName("");
    setNewUserUsername("");
    setNewUserRole("viewer");
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus: UserStatus = u.status === 'active' ? 'banned' : 'active';
        toast.info(`Đã chuyển trạng thái sang ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
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
            onClick={() => setIsAddModalOpen(true)}
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
                      <div className="size-11 rounded-2xl bg-white/[0.05] border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                          alt="Avatar" 
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm group-hover:text-primary transition-colors">{user.name}</div>
                        <div className="text-[10px] text-muted-foreground font-bold">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'admin' 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : user.role === 'uploader'
                          ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                          : "bg-white/[0.05] text-muted-foreground border-border"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => handleToggleStatus(user.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                        user.status === 'active' 
                          ? "bg-green-500/10 text-green-500 border-green-500/20" 
                          : user.status === 'pending'
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {user.status === 'active' ? <CheckCircle2 className="size-3" /> : user.status === 'pending' ? <Clock className="size-3" /> : <Ban className="size-3" />}
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{user.downloads} lượt tải</span>
                      <span className="text-[10px] text-muted-foreground">{user.lastActive}</span>
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
                      <button className="size-9 flex items-center justify-center rounded-xl hover:bg-white/[0.05] transition-colors text-muted-foreground hover:text-primary">
                        <MoreHorizontal className="size-4" />
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
              <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Lịch sử hoạt động gần đây</h4>
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
            
            <button className="w-full h-14 mt-10 rounded-2xl bg-primary text-white font-black hover:shadow-xl hover:shadow-primary/20 transition-all">
              Gửi tin nhắn cho người dùng
            </button>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-md bg-card border border-border rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <header className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tight">Thêm user mới</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-white"><X className="size-6" /></button>
            </header>

            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tên hiển thị</label>
                <input 
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full h-14 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 transition-colors font-medium outline-none"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                <input 
                  required
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  className="w-full h-14 px-5 bg-white/[0.03] border border-border rounded-xl focus:border-primary/50 transition-colors font-medium outline-none"
                  placeholder="Ví dụ: nva123"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phân quyền</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["viewer", "uploader", "admin"] as UserRole[]).map(r => (
                    <button 
                      key={r}
                      type="button"
                      onClick={() => setNewUserRole(r)}
                      className={`h-11 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${newUserRole === r ? "bg-primary text-white border-primary" : "bg-white/[0.03] border-border text-muted-foreground hover:bg-white/[0.06]"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-[60px] rounded-[24px] bg-primary text-white font-black text-lg hover:shadow-xl hover:shadow-primary/20 transition-all mt-4"
              >
                Tạo tài khoản ngay
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

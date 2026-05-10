import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  X
} from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

type UserData = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "user";
  email: string;
  joinDate: string;
};

const INITIAL_USERS: UserData[] = [
  { id: "1", name: "Administrator", username: "admin", role: "admin", email: "admin@xapps.com", joinDate: "2024-01-10" },
  { id: "2", name: "xhome", username: "xhome", role: "user", email: "xhome@gmail.com", joinDate: "2024-05-01" },
  { id: "3", name: "Nguyễn Văn A", username: "nva", role: "user", email: "nva@example.com", joinDate: "2024-03-15" },
];

function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "user">("user");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserData = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUserName,
      username: newUserUsername,
      role: newUserRole,
      email: `${newUserUsername}@example.com`,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    // Reset form
    setNewUserName("");
    setNewUserUsername("");
    setNewUserRole("user");
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-black tracking-tight flex items-center gap-3">
            <Users className="size-8 text-primary" />
            Quản lý người dùng
          </h2>
          <p className="text-muted-foreground">Quản lý tài khoản và phân quyền hệ thống.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-[52px] px-6 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus className="size-[20px]" />
          Thêm người dùng
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Tổng người dùng", value: users.length, icon: Users, color: "text-blue-500" },
          { label: "Quản trị viên", value: users.filter(u => u.role === 'admin').length, icon: Shield, color: "text-primary" },
          { label: "Người dùng mới", value: 1, icon: Calendar, color: "text-green-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-[24px] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl bg-white/[0.03] ${stat.color}`}>
                <stat.icon className="size-6" />
              </div>
            </div>
            <div className="text-[28px] font-black leading-none mb-1">{stat.value}</div>
            <div className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-card border border-border rounded-[28px] overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Tìm kiếm theo tên hoặc username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[46px] pl-11 pr-4 bg-[#111] border border-border rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-muted-foreground text-[13px] font-bold uppercase tracking-widest border-b border-border">
                <th className="px-6 py-5">Người dùng</th>
                <th className="px-6 py-5">Vai trò</th>
                <th className="px-6 py-5">Ngày tham gia</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-white/[0.05] border border-border flex items-center justify-center overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                          alt="Avatar" 
                          className="size-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-[15px]">{user.name}</div>
                        <div className="text-muted-foreground text-xs">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center h-[26px] px-3 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      user.role === 'admin' 
                        ? "bg-primary/20 text-primary border border-primary/20" 
                        : "bg-blue-500/10 text-blue-500 border border-blue-500/10"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-muted-foreground font-medium">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="size-9 flex items-center justify-center rounded-lg hover:bg-white/[0.05] transition-colors text-muted-foreground">
                        <MoreHorizontal className="size-5" />
                      </button>
                      {user.username !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="size-9 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-md bg-card border border-border rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-white"
            >
              <X className="size-6" />
            </button>

            <h3 className="text-2xl font-black tracking-tight mb-2">Thêm người dùng</h3>
            <p className="text-muted-foreground text-sm mb-8">Tạo tài khoản mới cho hệ thống.</p>

            <form onSubmit={handleAddUser} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tên hiển thị</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input 
                    required
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full h-[52px] pl-11 pr-4 bg-[#111] border border-border rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input 
                    required
                    type="text"
                    placeholder="Ví dụ: nva123"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    className="w-full h-[52px] pl-11 pr-4 bg-[#111] border border-border rounded-xl focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Vai trò</label>
                <select 
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full h-[52px] px-4 bg-[#111] border border-border rounded-xl focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  <option value="user">Người dùng (User)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full h-[54px] rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-4"
              >
                Tạo tài khoản
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

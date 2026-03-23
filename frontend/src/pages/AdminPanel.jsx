import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function AdminPanel() {
  const { role } = useAuth();

  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(true);

  // Load danh sách users từ backend (Firestore)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/list-users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      alert("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tạo user mới
  const handleCreate = async () => {
    if (!email || !password) return alert("Nhập đủ thông tin");

    try {
      const res = await axios.post("http://localhost:5000/api/create-user", {
        email,
        password,
        role: userRole,
      });
      alert(`User created! UID: ${res.data.uid}`);
      setEmail("");
      setPassword("");
      setUserRole("user");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error creating user");
    }
  };

  // Update role
  const handleUpdateRole = async (uid, newRole) => {
    try {
      await axios.post("http://localhost:5000/api/update-role", { uid, role: newRole });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error updating role");
    }
  };

  // Delete user
  const handleDelete = async (uid) => {
    if (!window.confirm("Xóa user này?")) return;
    try {
      await axios.post("http://localhost:5000/api/delete-user", { uid });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (role !== "admin")
    return <div className="p-6 text-red-600">❌ Bạn không có quyền Admin</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👑 Admin Panel</h1>

      {/* ===== CREATE USER ===== */}
      <div className="mb-6 flex gap-2">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-64"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-64"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Thêm user
        </button>
      </div>

      {/* ===== USER LIST ===== */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">
                <select
                  value={u.role}
                  onChange={(e) => handleUpdateRole(u.uid, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(u.uid)}
                  className="text-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

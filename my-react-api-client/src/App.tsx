// src/App.tsx
import { useState, useEffect } from "react";
import "./App.css";
import type { User, ApiResponse } from "./types/User";

const API_URL = "http://localhost:3000/api/users";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const result: ApiResponse<User[]> = await response.json();
        if (result.status === "success") {
          setUsers(result.data);
        } else {
          setError(result.message || "Lỗi không xác định");
        }
      } catch (err) {
        if (err instanceof Error) setError(`Lỗi kết nối: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const fetchUsers = async () => {
    // giữ nguyên như cũ
  };

  const handleDelete = async (userId: number) => {
    if (!confirm(`Bạn có chắc muốn xóa User ID ${userId}?`)) return;

    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
        alert(`Đã xóa thành công.`);
      } else {
        const errorResult = await response.json();
        alert(`Lỗi: ${errorResult.message}`);
      }
    } catch (err) {
      if (err instanceof Error) alert(`Lỗi: ${err.message}`);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;

  return (
    <div className="container">
      <h1>Danh sách Người dùng (React + PostgreSQL)</h1>
      <button onClick={fetchUsers} style={{ marginBottom: "20px" }}>
        Tải lại danh sách
      </button>

      {users.length === 0 ? (
        <p>Không có dữ liệu.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="delete-btn"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

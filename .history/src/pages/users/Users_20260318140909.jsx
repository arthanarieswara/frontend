import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/auth/users");
    setUsers(res.data);
  };

  const handleSubmit = async () => {
    if (!name || !email || (!editingId && !password) || !role) {
      alert("Fill all fields");
      return;
    }

    const data = {
      name,
      email,
      role,
      department_id: department || null,
    };

    if (!editingId) {
      data.password = password;
    }

    if (editingId) {
      await api.put(`/auth/users/${editingId}`, data);
    } else {
      await api.post("/auth/register", data);
    }

    resetForm();
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await api.delete(`/auth/users/${id}`);
    fetchUsers();
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setDepartment("");
    setEditingId(null);
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setDepartment(u.department_id || "");
  };

  return (
    <Layout>
      <div className="users-page">
        <h2>User Management</h2>

        <div className="users-form">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!editingId && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Faculty">Faculty</option>
            <option value="Student">Student</option>
          </select>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select Department</option>

            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button onClick={handleSubmit}>
            {editingId ? "Update User" : "Add User"}
          </button>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.department_name || "-"}</td>

                <td>
                  <button className="edit-btn" onClick={() => handleEdit(u)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Users;

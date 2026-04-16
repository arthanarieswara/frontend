import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Faculty.css";

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");

  const [editingId, setEditingId] = useState(null);

  const fetchFaculty = async () => {
    const res = await api.get("/faculty");
    console.log(res);
    setFaculty(res.data);
  };

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !designation || !department) {
      alert("Please fill all fields");
      return;
    }

    const data = {
      employee_id: employeeId,
      name,
      email,
      phone,
      designation,
      department_id: department,
    };

    if (editingId) {
      await api.put(`/faculty/${editingId}`, data);
    } else {
      await api.post("/faculty", data);
    }

    fetchFaculty();
  };

  const handleEdit = (f) => {
    setEditingId(f.id);
    setEmployeeId(f.employee_id);
    setName(f.name);
    setEmail(f.email);
    setPhone(f.phone);
    setDesignation(f.designation);
    setDepartment(f.department_id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete faculty?")) return;

    await api.delete(`/faculty/${id}`);

    fetchFaculty();
  };

  return (
    <Layout>
      <h2>Faculty</h2>

      <div className="faculty-form">
        <input
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <input
          placeholder="Faculty Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />

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
          {editingId ? "Update Faculty" : "Add Faculty"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Employee_id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {faculty.map((f) => (
            <tr key={f.id}>
              <td>{f.employee_id}</td>
              <td>{f.name}</td>
              <td>{f.email}</td>
              <td>{f.phone}</td>
              <td>{f.department_name}</td>
              <td>{f.designation}</td>

              <td>
                <button className="edit-btn" onClick={() => handleEdit(f)}>Edit</button>

                <button className="delete-btn" onClick={() => handleDelete(f.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default Faculty;

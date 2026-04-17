import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [date, setDate] = useState("");
  const [department, setDepartment] = useState("");
  const [classData, setClassData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!date) return alert("Select date");

    setLoading(true);
    try {
      const classRes = await api.get(
        `/attendance/class-summary?date=${date}&department_id=${department}`
      );

      const deptRes = await api.get(
        `/attendance/department-summary?date=${date}`
      );

      setClassData(classRes.data);
      setDeptData(deptRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <h2>📊 Attendance Analytics (Day-wise)</h2>

      <div className="filters">
        <input type="date" onChange={(e) => setDate(e.target.value)} />
        <input
          placeholder="Department ID"
          onChange={(e) => setDepartment(e.target.value)}
        />
        <button onClick={fetchData}>
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>

      {/* CLASS TABLE */}
      <div className="card">
        <h3>📘 Class-wise</h3>
        <table>
          <thead>
            <tr>
              <th>Sem</th>
              <th>Sec</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {classData.map((c, i) => (
              <tr key={i}>
                <td>{c.semester}</td>
                <td>{c.section}</td>
                <td className="green">{c.present}</td>
                <td className="red">{c.absent}</td>
                <td>{c.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DEPT TABLE */}
      <div className="card">
        <h3>🏫 Department-wise</h3>
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {deptData.map((d, i) => (
              <tr key={i}>
                <td>{d.department}</td>
                <td className="green">{d.present}</td>
                <td className="red">{d.absent}</td>
                <td>{d.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./FacultyAttendance.css";

function FacultyAttendance() {
  const [faculty, setFaculty] = useState([]);
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= LOAD FACULTY ================= */

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await api.get("/faculty");
      setFaculty(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (id, field, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  /* ================= MARK ALL PRESENT ================= */

  const markAllPresent = () => {
    const updated = {};
    faculty.forEach((f) => {
      updated[f.id] = { status: "Present" };
    });
    setAttendance(updated);
  };

  /* ================= SAVE ================= */

  const saveAttendance = async () => {
    if (!date) {
      alert("Please select date");
      return;
    }

    setLoading(true);

    try {
      for (let f of faculty) {
        const data = attendance[f.id];

        if (!data || !data.status) continue;

        await api.post("/faculty-attendance", {
          faculty_id: f.id,
          date,
          status: data.status,
          in_time: data.in_time || null,
          out_time: data.out_time || null,
          half_type: data.half_type || null,
        });
      }

      alert("Attendance saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error saving attendance ❌");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="faculty-attendance">

        {/* HEADER */}
        <div className="header">
          <h2>Faculty Attendance</h2>

          <div className="actions">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button onClick={markAllPresent} className="secondary-btn">
              Mark All Present
            </button>

            <button onClick={saveAttendance} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {faculty.map((f) => {
                const data = attendance[f.id] || {};

                return (
                  <tr key={f.id}>

                    {/* NAME */}
                    <td>{f.name}</td>

                    {/* STATUS */}
                    <td>
                      <select
                        className={`status-dropdown ${data.status}`}
                        value={data.status || ""}
                        onChange={(e) =>
                          handleChange(f.id, "status", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="CL">CL</option>
                        <option value="CML">CML</option>
                        <option value="LOP">LOP</option>
                        <option value="OD">OD</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Permission">Permission</option>
                        <option value="Half Day">Half Day</option>
                      </select>
                    </td>

                    {/* DETAILS */}
                    <td>
                      {data.status === "Permission" && (
                        <div className="time-inputs">
                          <input
                            type="time"
                            onChange={(e) =>
                              handleChange(f.id, "in_time", e.target.value)
                            }
                          />
                          <input
                            type="time"
                            onChange={(e) =>
                              handleChange(f.id, "out_time", e.target.value)
                            }
                          />
                        </div>
                      )}

                      {data.status === "Half Day" && (
                        <select
                          onChange={(e) =>
                            handleChange(f.id, "half_type", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          <option value="First Half">First Half</option>
                          <option value="Second Half">Second Half</option>
                        </select>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  );
}

export default FacultyAttendance;
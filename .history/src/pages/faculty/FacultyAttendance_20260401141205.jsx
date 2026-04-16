import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./FacultyAttendance.css";

function FacultyAttendance() {
  const [faculty, setFaculty] = useState([]);
  const [date, setDate] = useState("");

  const [attendance, setAttendance] = useState({});

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
    setAttendance({
      ...attendance,
      [id]: {
        ...attendance[id],
        [field]: value,
      },
    });
  };

  /* ================= SAVE ================= */

  const saveAttendance = async () => {
    if (!date) {
      alert("Select date");
      return;
    }

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

      alert("Attendance saved ✅");

    } catch (err) {
      console.error(err);
      alert("Error saving attendance");
    }
  };

  return (
    <Layout>
      <div className="faculty-attendance">

        <h2>Faculty Attendance</h2>

        {/* DATE */}
        <div className="top-bar">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={saveAttendance}>Save</button>
        </div>

        {/* LIST */}
        <div className="list">
          {faculty.map((f) => {
            const data = attendance[f.id] || {};

            return (
              <div key={f.id} className="row">

                <div className="name">
                  {f.name}
                </div>

                {/* STATUS */}
                <select
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

                {/* PERMISSION */}
                {data.status === "Permission" && (
                  <>
                    <input
                      type="time"
                      placeholder="In"
                      onChange={(e) =>
                        handleChange(f.id, "in_time", e.target.value)
                      }
                    />

                    <input
                      type="time"
                      placeholder="Out"
                      onChange={(e) =>
                        handleChange(f.id, "out_time", e.target.value)
                      }
                    />
                  </>
                )}

                {/* HALF DAY */}
                {data.status === "Half Day" && (
                  <select
                    onChange={(e) =>
                      handleChange(f.id, "half_type", e.target.value)
                    }
                  >
                    <option value="">Select Half</option>
                    <option value="First Half">First Half</option>
                    <option value="Second Half">Second Half</option>
                  </select>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}

export default FacultyAttendance;
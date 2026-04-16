import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Students.css";

function Students() {

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  const [page, setPage] = useState(1);
  const studentsPerPage = 5;

  /* ================= FETCH ================= */

  const fetchStudents = async () => {
    const res = await api.get("/students");

    // ✅ SORT BY ROLL NUMBER ASCENDING
    const sorted = res.data.sort((a, b) =>
      a.roll_number.localeCompare(b.roll_number)
    );

    setStudents(sorted);
  };

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async () => {

    const data = {
      name,
      roll_number: rollNumber,
      department_id: department,
      semester,
      section,
      start_year: startYear,
      end_year: endYear
    };

    if (editingId) {
      await api.put(`/students/${editingId}`, data);
    } else {
      await api.post("/students", data);
    }

    resetForm();
    fetchStudents();
  };

  const resetForm = () => {
    setName("");
    setRollNumber("");
    setDepartment("");
    setSemester("");
    setSection("");
    setStartYear("");
    setEndYear("");
    setEditingId(null);
  };

  /* ================= EDIT ================= */

  const handleEdit = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setRollNumber(student.roll_number);
    setDepartment(student.department_id);
    setSemester(student.semester);
    setSection(student.section);
    setStartYear(student.start_year);
    setEndYear(student.end_year);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    await api.delete(`/students/${id}`);
    fetchStudents();
  };

  /* ================= FILTER ================= */

  const filteredStudents = students.filter((s) => {
    return (
      (filterDept === "" || s.department_id == filterDept) &&
      (
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.roll_number?.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  /* ================= PAGINATION ================= */

  const indexOfLast = page * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;

  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  /* ================= UI ================= */

  return (
    <Layout>
      <div className="students">

        <h2>Students</h2>

        {/* FORM */}

        <div className="student-form">

          <input
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />

          <input
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <input
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />

          <input
            placeholder="Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />

          {/* ✅ NEW YEAR FIELDS */}

          <input
            type="number"
            placeholder="Start Year"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />

          <input
            type="number"
            placeholder="End Year"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {editingId ? "Update Student" : "Add Student"}
          </button>

        </div>

        {/* FILTERS */}

        <div className="student-filters">

          <input
            placeholder="Search Student by Roll Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

        </div>

        {/* TABLE */}

        <table className="students-table">

          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Section</th>
              <th>Batch</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {currentStudents.map((s) => (

              <tr key={s.id}>
                <td>{s.roll_number}</td>
                <td>{s.name}</td>
                <td>{s.department_name}</td>
                <td>{s.semester}</td>
                <td>{s.section}</td>
                <td>{s.start_year} - {s.end_year}</td>

                <td>
                  <button className="edit-btn" onClick={() => handleEdit(s)}>
                    Edit
                  </button>

                  <button className="delete-btn" onClick={() => handleDelete(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>

            ))}

          </tbody>

        </table>

        {/* PAGINATION */}

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "active-page" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default Students;
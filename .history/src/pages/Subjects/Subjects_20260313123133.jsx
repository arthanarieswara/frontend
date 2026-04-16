import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Subjects.css";

function Subjects() {

  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");

  const [editingId, setEditingId] = useState(null);


  /* FETCH SUBJECTS */

  const fetchSubjects = async () => {

    const res = await api.get("/subjects");
    setSubjects(res.data);

  };


  /* FETCH DEPARTMENTS */

  const fetchDepartments = async () => {

    const res = await api.get("/departments");
    setDepartments(res.data);

  };


  /* FETCH SEMESTERS */

  const fetchSemesters = async () => {

    const res = await api.get("/semesters");
    setSemesters(res.data);

  };


  useEffect(() => {

    fetchSubjects();
    fetchDepartments();
    fetchSemesters();

  }, []);



  /* ADD / UPDATE SUBJECT */

  const handleSubmit = async () => {

    if (!code || !name || !department || !semester) {
      alert("Please fill all fields");
      return;
    }

    const data = {
      code,
      name,
      department_id: department,
      semester_id: semester
    };

    if (editingId) {

      await api.put(`/subjects/${editingId}`, data);

    } else {

      await api.post("/subjects", data);

    }

    setCode("");
    setName("");
    setDepartment("");
    setSemester("");
    setEditingId(null);

    fetchSubjects();

  };


  /* EDIT */

  const handleEdit = (s) => {

    setEditingId(s.id);

    setCode(s.code);
    setName(s.name);
    setDepartment(s.department_id);
    setSemester(s.semester_id);

  };


  /* DELETE */

  const handleDelete = async (id) => {

    if (!window.confirm("Delete subject?")) return;

    await api.delete(`/subjects/${id}`);

    fetchSubjects();

  };


  return (

    <Layout>

      <h2>Subjects</h2>

      <div className="subject-form">

        <input
          placeholder="Subject Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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


        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >

          <option value="">Select Semester</option>

          {semesters.map((s) => (

            <option key={s.id} value={s.id}>
              {s.name}
            </option>

          ))}

        </select>


        <button onClick={handleSubmit}>
          {editingId ? "Update Subject" : "Add Subject"}
        </button>

      </div>


      <table className="subject-table">

        <thead>

          <tr>

            <th>Code</th>
            <th>Name</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {subjects.map((s) => (

            <tr key={s.id}>

              <td>{s.code}</td>
              <td>{s.name}</td>
              <td>{s.department_name}</td>
              <td>{s.semester_name}</td>

              <td>

                <button
                  className="edit-btn"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </Layout>

  );

}

export default Subjects;
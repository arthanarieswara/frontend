import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Students.css";

function Students() {

  const [students,setStudents] = useState([]);
  const [departments,setDepartments] = useState([]);

  const [name,setName] = useState("");
  const [rollNumber,setRollNumber] = useState("");
  const [department,setDepartment] = useState("");
  const [semester,setSemester] = useState("");
  const [section,setSection] = useState("");
  const [admissionYear,setAdmissionYear] = useState("");

  const [editingId,setEditingId] = useState(null);

  /* SEARCH + FILTER */

  const [search,setSearch] = useState("");
  const [filterDept,setFilterDept] = useState("");

  /* PAGINATION */

  const [page,setPage] = useState(1);
  const studentsPerPage = 5;

  /* FETCH STUDENTS */

  const fetchStudents = async () => {

    const res = await api.get("/students");
    setStudents(res.data);

  };

  /* FETCH DEPARTMENTS */

  const fetchDepartments = async () => {

    const res = await api.get("/departments");
    setDepartments(res.data);

  };

  useEffect(()=>{

    fetchStudents();
    fetchDepartments();

  },[]);

  /* ADD OR UPDATE */

  const handleSubmit = async () => {

    const data = {
      name,
      roll_number: rollNumber,
      department_id: department,
      semester,
      section,
      admission_year: admissionYear
    };

    if(editingId){

      await api.put(`/students/${editingId}`,data);

    }else{

      await api.post("/students",data);

    }

    setName("");
    setRollNumber("");
    setDepartment("");
    setSemester("");
    setSection("");
    setAdmissionYear("");
    setEditingId(null);

    fetchStudents();

  };

  /* EDIT */

  const handleEdit = (student)=>{

    setEditingId(student.id);

    setName(student.name);
    setRollNumber(student.roll_number);
    setDepartment(student.department_id);
    setSemester(student.semester);
    setSection(student.section);
    setAdmissionYear(student.admission_year);

  };

  /* DELETE */

  const handleDelete = async(id)=>{

    const confirmDelete = window.confirm(
      "Delete this student?"
    );

    if(!confirmDelete) return;

    await api.delete(`/students/${id}`);

    fetchStudents();

  };

  /* FILTER + SEARCH */

  const filteredStudents = students.filter((s)=>{

    return (
      (filterDept === "" || s.department_id == filterDept) &&
      (
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.roll_number?.toLowerCase().includes(search.toLowerCase())
      )
    );

  });

  /* PAGINATION */

  const indexOfLast = page * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;

  const currentStudents = filteredStudents.slice(indexOfFirst,indexOfLast);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return(

    <Layout>

      <div className="students">

        <h2>Students</h2>

        {/* STUDENT FORM */}

        <div className="student-form">

          <input
            placeholder="Student Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e)=>setRollNumber(e.target.value)}
          />

          <select
            value={department}
            onChange={(e)=>setDepartment(e.target.value)}
          >

            <option value="">Select Department</option>

            {departments.map((d)=>(
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}

          </select>

          <input
            placeholder="Semester"
            value={semester}
            onChange={(e)=>setSemester(e.target.value)}
          />

          <input
            placeholder="Section"
            value={section}
            onChange={(e)=>setSection(e.target.value)}
          />

          <input
            placeholder="Admission Year"
            value={admissionYear}
            onChange={(e)=>setAdmissionYear(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {editingId ? "Update Student" : "Add Student"}
          </button>

        </div>

        {/* SEARCH + FILTER */}

        <div className="student-filters">

          <input
            placeholder="Search Student"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <select
            value={filterDept}
            onChange={(e)=>setFilterDept(e.target.value)}
          >

            <option value="">All Departments</option>

            {departments.map((d)=>(
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}

          </select>

        </div>

        {/* STUDENTS TABLE */}

        <table className="students-table">

          <thead>

            <tr>

              <th>Name</th>
              <th>Roll No</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Section</th>
              <th>Admission Year</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {currentStudents.map((s)=>(

              <tr key={s.id}>

                <td>{s.name}</td>
                <td>{s.roll_number}</td>
                <td>{s.department_name}</td>
                <td>{s.semester}</td>
                <td>{s.section}</td>
                <td>{s.admission_year}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={()=>handleEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={()=>handleDelete(s.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* PAGINATION */}

        <div className="pagination">

          {Array.from({length: totalPages},(_,i)=>(
            <button
              key={i}
              onClick={()=>setPage(i+1)}
              className={page === i+1 ? "active-page" : ""}
            >
              {i+1}
            </button>
          ))}

        </div>

      </div>

    </Layout>

  );

}

export default Students;
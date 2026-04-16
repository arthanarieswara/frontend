import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResultSheet.css";

function ResultSheet() {
  const [data, setData] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [subjects, setSubjects] = useState([]);

  /* 🔥 NEW STATE */
  const [departments, setDepartments] = useState([]);

  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [testType, setTestType] = useState("");

  /* ================= LOAD DEPARTMENTS ================= */
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH MARK DATA ================= */
  const loadData = async () => {
    if (!semester || !department || !testType) {
      return alert("Select required fields");
    }

    let url = `/marks/class?semester=${semester}&department_id=${department}&test_type=${testType}`;
    if (section) url += `&section=${section}`;

    const res = await api.get(url);
    const rows = res.data;

    const map = {};
    const subs = new Set();

    rows.forEach((r) => {
      subs.add(r.subject_name);

      if (!map[r.student_id]) {
        map[r.student_id] = {
          roll: r.roll_number,
          name: r.name,
          marks: {},
        };
      }

      map[r.student_id].marks[r.subject_name] = r.mark || "AB";
    });

    setGrouped(map);
    setSubjects([...subs]);
    setData(rows);
  };

  /* ================= EXPORT PDF ================= */
  const exportPDF = async () => {
    const element = document.getElementById("pdf-content");

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("result.pdf");
  };

  return (
    <Layout>
      <div className="result-page">

        <h2>📄 Result Sheet</h2>

        {/* ================= FILTERS ================= */}
        <div className="filters">

          {/* 🔥 DEPARTMENT FROM API */}
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="">Semester</option>
            {[1,2,3,4,5,6,7,8].map((s) => (
              <option key={s} value={s}>Sem {s}</option>
            ))}
          </select>

          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>

          <select value={testType} onChange={(e) => setTestType(e.target.value)}>
            <option value="">Test Type</option>
            <option value="Internal">Internal</option>
            <option value="Class Test">Class Test</option>
          </select>

          <button onClick={loadData}>Load</button>
          <button onClick={exportPDF}>Export PDF</button>
        </div>

        {/* ================= TABLE ================= */}
        <div id="pdf-content" className="pdf-container">

          <h3 className="college-title">
            STUDY WORLD COLLEGE OF ENGINEERING
          </h3>

          <table className="result-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Register No</th>
                <th>Name</th>

                {subjects.map((sub, i) => (
                  <th key={i}>{sub}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Object.values(grouped).map((s, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{s.roll}</td>
                  <td>{s.name}</td>

                  {subjects.map((sub, i) => (
                    <td key={i}>{s.marks[sub] || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </Layout>
  );
}

export default ResultSheet;
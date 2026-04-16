import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./SubjectMarks.css";

function SubjectMarks() {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [testType, setTestType] = useState("");
  const [testNo, setTestNo] = useState("");

  const [marks, setMarks] = useState({});
  const [analysis, setAnalysis] = useState(null);

  const [editMode, setEditMode] = useState(false); // 🔥 NEW

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await api.get("/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    if (department && semester) {
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [department, semester]);

  const fetchSubjects = async () => {
    const res = await api.get(
      `/subjects/by-semester?semester=${semester}&department_id=${department}`,
    );
    setSubjects(res.data);
  };

  /* ================= LOAD STUDENTS ================= */
  const loadStudents = async () => {
    if (!department || !semester || !subject || !testType) {
      return alert("Fill all required fields");
    }

    let url = `/marks/subject?semester=${semester}&department_id=${department}&subject_id=${subject}&test_type=${testType}`;

    if (section) url += `&section=${section}`;
    if (testNo) url += `&test_no=${testNo}`;

    const res = await api.get(url);
    const data = res.data;

    setStudents(data);

    const initial = {};
    data.forEach((s) => {
      initial[s.student_id] = s.mark || "AB";
    });
    setMarks(initial);

    /* ================= ANALYSIS ================= */
    const total = data.length;
    let absent = 0;
    let pass = 0;
    let fail = 0;
    let marksArr = [];

    data.forEach((s) => {
      if (!s.mark || s.mark === "AB") {
        absent++;
      } else {
        const m = parseInt(s.mark);
        marksArr.push(m);

        if (m >= 50) pass++;
        else fail++;
      }
    });

    const present = total - absent;

    const average =
      marksArr.length > 0
        ? (marksArr.reduce((a, b) => a + b, 0) / marksArr.length).toFixed(2)
        : 0;

    const highest = marksArr.length ? Math.max(...marksArr) : 0;
    const lowest = marksArr.length ? Math.min(...marksArr) : 0;

    setAnalysis({
      total,
      present,
      absent,
      pass,
      fail,
      average,
      highest,
      lowest,
    });
  };

  /* ================= SAVE ================= */
  const saveMarks = async () => {
    const payload = students.map((s) => ({
      student_id: s.student_id,
      subject_id: subject,
      semester,
      section,
      test_type: testType,
      test_no: testNo,
      department_id: department,
      mark: marks[s.student_id] || "AB",
    }));

    await api.post("/marks", payload);
    alert("Marks saved successfully ✅");
  };

  /* ================= PDF ================= */
  const exportPDF = async () => {
    const element = document.getElementById("pdf-content");

    const canvas = await html2canvas(element, {
      scale: 3, // 🔥 higher quality
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 🔥 MULTI PAGE SUPPORT
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("subject-report.pdf");
  };

  return (
    <Layout>
      <div className="subject-page">
        <h2>📘 Subject Marks & Analysis</h2>

        {/* ================= FILTERS ================= */}
        <div className="filters modern">
          <select onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select onChange={(e) => setSemester(e.target.value)}>
            <option value="">Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Sem {s}
              </option>
            ))}
          </select>

          <select onChange={(e) => setSection(e.target.value)}>
            <option value="">Section</option>
            <option>A</option>
            <option>B</option>
          </select>

          <select onChange={(e) => setSubject(e.target.value)}>
            <option value="">Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select onChange={(e) => setTestType(e.target.value)}>
            <option value="">Test Type</option>
            <option>Internal</option>
            <option>Class Test</option>
          </select>

          <select onChange={(e) => setTestNo(e.target.value)}>
            <option value="">Test No</option>
            <option value="1">Test 1</option>
            <option value="2">Test 2</option>
          </select>

          <button onClick={loadStudents}>Load</button>

          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? "View Mode" : "Edit Mode"}
          </button>

          <button className="export-btn" onClick={exportPDF}>
            Export PDF
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        {students.length > 0 && (
          <div id="pdf-content">
            {/* ================= ANALYSIS ================= */}
            {analysis && (
              <div className="analysis-grid">
                <div className="card total">Total: {analysis.total}</div>
                <div className="card present">Present: {analysis.present}</div>
                <div className="card absent">Absent: {analysis.absent}</div>
                <div className="card pass">Pass: {analysis.pass}</div>
                <div className="card fail">Fail: {analysis.fail}</div>
                <div className="card avg">Avg: {analysis.average}</div>
                <div className="card high">High: {analysis.highest}</div>
                <div className="card low">Low: {analysis.lowest}</div>
              </div>
            )}

            {/* ================= TABLE ================= */}
            <div className="table-wrapper">
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Mark</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s) => {
                    const value = marks[s.student_id] || "AB";

                    return (
                      <tr key={s.student_id}>
                        <td>{s.roll_number}</td>
                        <td>{s.name}</td>

                        <td
                          className={
                            !editMode
                              ? value === "AB"
                                ? "mark-absent"
                                : value < 50
                                  ? "mark-fail"
                                  : "mark-pass"
                              : ""
                          }
                        >
                          {editMode ? (
                            <input
                              value={value === "AB" ? "" : value}
                              onChange={(e) =>
                                setMarks({
                                  ...marks,
                                  [s.student_id]: e.target.value || "AB",
                                })
                              }
                            />
                          ) : (
                            value
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {editMode && (
                <button className="save-btn" onClick={saveMarks}>
                  Save Marks
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SubjectMarks;

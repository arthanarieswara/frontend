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
  const [departments, setDepartments] = useState([]);

  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [testType, setTestType] = useState("");

  const [analysis, setAnalysis] = useState(null);

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

  /* ================= FETCH DATA ================= */
  const loadData = async () => {
    if (!semester || !department || !testType) {
      return alert("Select required fields");
    }

    try {
      const params = new URLSearchParams();
      params.append("semester", semester);
      params.append("department_id", department);
      params.append("test_type", testType);

      if (section) params.append("section", section);

      const res = await api.get(`/marks/class?${params.toString()}`);
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

      const subjectArray = [...subs];

      setGrouped(map);
      setSubjects(subjectArray);
      setData(rows);

      calculateAnalysis(map, subjectArray);

    } catch (err) {
      console.error(err);
      alert("Error loading data");
    }
  };

  /* ================= ANALYSIS ================= */
  const calculateAnalysis = (groupedData, subjectsList) => {
    const students = Object.values(groupedData);
    const totalStudents = students.length;

    const subjectStats = subjectsList.map((sub) => {
      let appeared = 0;
      let absent = 0;
      let pass = 0;
      let fail = 0;

      students.forEach((s) => {
        const mark = s.marks[sub];

        if (mark === "AB") {
          absent++;
        } else {
          appeared++;
          const num = Number(mark);

          if (num >= 50) pass++;
          else fail++;
        }
      });

      return {
        total: totalStudents,
        appeared,
        absent,
        pass,
        fail,
        passPercent:
          appeared === 0 ? 0 : ((pass / appeared) * 100).toFixed(2),
      };
    });

    const failDistribution = {};

    students.forEach((s) => {
      let failCount = 0;

      subjectsList.forEach((sub) => {
        const mark = s.marks[sub];
        if (mark !== "AB" && Number(mark) < 50) {
          failCount++;
        }
      });

      failDistribution[failCount] =
        (failDistribution[failCount] || 0) + 1;
    });

    setAnalysis({
      subjectStats,
      failDistribution,
    });
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
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
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

        {/* ================= PDF CONTENT ================= */}
        <div id="pdf-content" className="pdf-container">
          <h3 className="college-title">STUDY WORLD COLLEGE OF ENGINEERING</h3>

          {/* ================= MAIN TABLE ================= */}
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

          {/* ================= ANALYSIS ================= */}
          {analysis && (
            <>
              <br />

              <table className="analysis-table">
                <tbody>
                  <tr>
                    <th>Total Students Registered</th>
                    {analysis.subjectStats.map((s, i) => <td key={i}>{s.total}</td>)}
                  </tr>

                  <tr>
                    <th>Total Students Appeared</th>
                    {analysis.subjectStats.map((s, i) => <td key={i}>{s.appeared}</td>)}
                  </tr>

                  <tr>
                    <th>Total Students Absent</th>
                    {analysis.subjectStats.map((s, i) => <td key={i}>{s.absent}</td>)}
                  </tr>

                  <tr>
                    <th>Total Students Failed</th>
                    {analysis.subjectStats.map((s, i) => <td key={i}>{s.fail}</td>)}
                  </tr>

                  <tr>
                    <th>Total Students Passed</th>
                    {analysis.subjectStats.map((s, i) => <td key={i}>{s.pass}</td>)}
                  </tr>

                  <tr>
                    <th>Pass Percentage</th>
                    {analysis.subjectStats.map((s, i) => (
                      <td key={i}>{s.passPercent}%</td>
                    ))}
                  </tr>
                </tbody>
              </table>

              <br />

              <table className="analysis-table">
                <tbody>
                  <tr>
                    <th>Number of Subjects</th>
                    {subjects.map((_, i) => <td key={i}>{i + 1}</td>)}
                    <td>NIL</td>
                  </tr>

                  <tr>
                    <th>Number of Students Failed</th>
                    {subjects.map((_, i) => (
                      <td key={i}>{analysis.failDistribution[i + 1] || 0}</td>
                    ))}
                    <td>{analysis.failDistribution[0] || 0}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ResultSheet;
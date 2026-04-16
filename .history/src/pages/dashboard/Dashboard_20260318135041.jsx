import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Dashboard.css";

function Dashboard() {

  const [data,setData] = useState({
    students:0,
    faculty:0,
    departments:0,
    fees:0
  });

  useEffect(()=>{

    const fetchDashboard = async ()=>{

      try{

        const res = await api.get("/dashboard/admin");

        setData(res.data);

      }catch(err){

        console.log(err);

      }

    };

    fetchDashboard();

  },[]);

  return(

    <Layout>

      <div className="dashboard">

        <h2>Admin Dashboard</h2>

        <div className="cards">

          <div className="card">
            <h3>Total Students</h3>
            <p>{data.students}</p>
          </div>

          <div className="card">
            <h3>Total Faculty</h3>
            <p>{data.faculty}</p>
          </div>

          <div className="card">
            <h3>Total Departments</h3>
            <p>{data.departments}</p>
          </div>

          {/* <div className="card">
            <h3>Total Fees Collected</h3>
            <p>₹{data.fees}</p>
          </div> */}

        </div>

      </div>

    </Layout>

  );

}

export default Dashboard;
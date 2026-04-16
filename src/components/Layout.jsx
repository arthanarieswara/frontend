import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

  const [collapsed,setCollapsed] = useState(false);

  return (

    <div style={{display:"flex"}}>

      <Sidebar collapsed={collapsed} />

      <div style={{flex:1}}>

        <Navbar toggleSidebar={()=>setCollapsed(!collapsed)} />

        <div style={{padding:"25px"}}>
          {children}
        </div>

      </div>

    </div>

  );

}

export default Layout;
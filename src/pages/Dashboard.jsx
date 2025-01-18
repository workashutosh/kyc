import React, { useEffect, useContext, useState } from "react";
import Header from "@components/common/Header";
import Sidebar from "@components/common/Sidebar";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";


const Dashboard = () => {
  // Sidebar State
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { activeUserData } = useContext(AppContext);
  const navigate = useNavigate();
  if(activeUserData && (activeUserData?.user_position !== '1' || activeUserData?.user_position !== '2')){
    navigate("/userDashhboard");
  }

  return (
    <>
      <Header />
      <main className="flex">
        {/* Sidebar Container */}
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
        <section className="flex-1 my-4 ml-4 mr-7">
          <h1>Lead Dashboard for Admin</h1>
        </section>
      </main>
    </>
  );
};

export default Dashboard;

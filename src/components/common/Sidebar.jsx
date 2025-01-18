import { useLocation, Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import IMAGES from "@images";
import { AppContext } from "@context/AppContext";
import { Home, CircleGauge , UserRound , Tag , LayoutDashboard , WalletCards  } from "lucide-react"; 

// Navigation configuration based on user position
const navigationConfig = {
  admin: [
    {
      path: '/',
      label: 'Dashboard',
      icon: CircleGauge
    },
    {
      path: '/cred',
      label: 'Credentails',
      icon: WalletCards
    },
  ],
  sales: [
    {
      path: '/userDashhboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    }
  ]
};

const NavItem = ({ path, label, icon: Icon, iconWrapper, isSidebarVisible }) => {
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <Link to={path}>
      <div
        className={`cursor-pointer square-box flex group hover:bg-[#0052CC] items-center gap-4 py-2 px-4 ${
          isActive ? "bg-[#0052CC]" : ""
        }`}
      >
        {iconWrapper ? (
          <div className="bg-green-600 rounded-full p-1">
            <Icon size={18} color="white" />
          </div>
        ) : (
          <Icon
            size={20}
            color={isActive ? "white" : "#8A8A8A"}
            className="group-hover:text-white"
          />
        )}
        {isSidebarVisible && (
          <p
            className={`${
              isActive ? "text-white" : "text-[#6F6B6B]"
            } group-hover:text-white`}
          >
            {label}
          </p>
        )}
      </div>
    </Link>
  );
};

const Sidebar = ({ isSidebarVisible, setIsSidebarVisible }) => {
  const { activeUserData } = useContext(AppContext);
  const isAdmin = activeUserData?.user_position === "1";
  const navItems = isAdmin ? navigationConfig.admin : navigationConfig.sales;

  return (
    <aside
      className={`${
        isSidebarVisible ? "min-w-[9vw]" : "w-fit"
      } shadow-md shadow-gray-500 h-screen pt-4 sticky select-none top-[55px] z-[40]`}
    >
      <img
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        src={IMAGES.SidebarToggleIcon}
        alt="sidebar toggle"
        className={`${
          isSidebarVisible ? "" : "rotate-180"
        } absolute -right-3 top-6 cursor-pointer`}
      />

      <div className="overflow-y-scroll text-sm">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            {...item}
            isSidebarVisible={isSidebarVisible}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
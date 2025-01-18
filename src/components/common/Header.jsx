import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { AppContext } from "@context/AppContext";
import { getLocalStorage } from "@utils/getLocalStorage";
import axiosInstance from "@api/axiosInstance";
import { useLoggerStore } from "@store/log.jsx";
import { UserRound, Menu, X } from "lucide-react";
import apiInstance from "@api/apiInstance";
import logo from "../../../public/logo.png";

const Header = () => {
  const { activeUserData, setActiveUserData } = useContext(AppContext);
  const { updateActivityLog, initializeLogData } = useLoggerStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const username = activeUserData?.user_name;

  useEffect(() => {
    initializeLogData(activeUserData);
  }, [activeUserData, initializeLogData]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const lsData = getLocalStorage();

    secureLocalStorage.clear("data");
    setActiveUserData(null);
    navigate("/login");
   
    try {
      if (lsData?.session_id && lsData?.access_token) {
        const response = await apiInstance(`/users.php`, 'DELETE', {"session_id": lsData?.session_id});
        await axiosInstance(
          `/session/logout?session=${lsData.session_id}`,
          "DELETE",
          {},
          lsData.access_token
        );
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };

  return (
    <header className="sticky top-0 left-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="logo" className="h-8 w-auto sm:h-10" />
          </Link>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center">
            {username && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{username}</span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            {username && (
              <>
                <div className="text-sm text-gray-700">
                  Signed in as: <span className="font-medium">{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
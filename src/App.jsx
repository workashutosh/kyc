import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStore from "@store";

// Page imports
import LoginPage from "@pages/LoginPage";
import Dashboard from "@pages/Dashboard";
import SalesDashboard from "@components/Dashboards/SalesDashboard";

// Route configuration
const routes = [
  {
    path: "/login",
    element: LoginPage,
    protected: false
  },
  {
    path: "/",
    element: Dashboard,
    protected: true,
    key: "dashboard-page",
    role: "admin"
  },
  {
    path: "/userDashboard",
    element: SalesDashboard,
    protected: true,
    key: "salesDashboard-page",
    role: "sales"
  }
];

const App = () => {
  const { userDetails } = useStore();

  const renderRoute = (route) => {
    const Component = route.element;
    
    if (!route.protected) {
      return <Route key={route.path} path={route.path} element={<Component />} />;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ProtectedRoute
            element={<Component />}
            key={route.key}
            role={route.role}
          />
        }
      />
    );
  };

  return (
    <AppProvider>
      <ToastContainer 
        autoClose={1000}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
          {routes.map(renderRoute)}
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
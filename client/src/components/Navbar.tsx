import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { FormEvent } from "react";
import { useState } from "react";
import ErrorHandler from "./handler/ErrorHandler";
import SpinnerSmall from "./SpinnerSmall";

// Consider using a dedicated icon library (e.g., react-icons)
// import { FaUsers, FaBox, FaShoppingCart, FaChartBar, FaFileAlt, FaComment } from 'react-icons/fa';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loadingLogout, setLoadingLogout] = useState(false);

  // Memoize user data if it doesn't change frequently to avoid re-parsing localStorage
  // This is a simple example, for more robust solutions, use React Context or a global store
  const getUserData = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  const user = getUserData();
  const userRole = user?.role || "";

  const handleUserFullName = (): string => {
    let fullName = "";
    if (user) {
      if (user.middle_name) {
        fullName = `${user.last_name}, ${user.first_name} ${user.middle_name[0]}.`;
      } else {
        fullName = `${user.last_name}, ${user.first_name}`;
      }
    }
    return fullName;
  };

  const menuItems = [
    {
      route: "/users",
      title: "Users",
      allowedRoles: ["administrator"] /*, icon: <FaUsers />*/,
    },
    {
      route: "/items",
      title: "Items",
      allowedRoles: ["administrator", "manager"] /*, icon: <FaBox />*/,
    },
    {
      route: "/products",
      title: "Products",
      allowedRoles: [
        "administrator",
        "manager",
        "cashier",
      ] /*, icon: <FaShoppingCart />*/,
    },
    {
      route: "/charts",
      title: "Charts",
      allowedRoles: ["administrator", "manager"] /*, icon: <FaChartBar />*/,
    },
    {
      route: "/reports",
      title: "Reports",
      allowedRoles: ["administrator", "manager"] /*, icon: <FaFileAlt />*/,
    },
    {
      route: "/feedback",
      title: "Feedback",
      allowedRoles: ["administrator", "manager"] /*, icon: <FaComment />*/,
    },
  ];

  const accessibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  const handleLogout = (e: FormEvent) => {
    e.preventDefault();
    setLoadingLogout(true);
    logout()
      .then(() => {
        navigate("/");
      })
      .catch((error) => ErrorHandler(error, null))
      .finally(() => setLoadingLogout(false));
  };

  return (
    <>
      <nav // Use <nav> for semantic correctness
        className="d-flex flex-column"
        style={{
          width: "280px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          backgroundColor: "#1a1a1a",
          color: "#fff",
          padding: "24px 16px",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <div className="d-flex align-items-center mb-5">
          <img
            src="src/assets/images/techfour.jpg"
            alt="Logo"
            style={{ width: "48px", height: "48px", marginRight: "12px" }}
          />
          <span
            className="navbar-brand mb-0"
            style={{ color: "#fff", fontWeight: "bold", fontSize: "1.5rem" }}
          >
            TechFour
          </span>
        </div>

        <div className="mb-4">
          <div
            className="text-center mb-3 p-2"
            style={{ backgroundColor: "#2c2c2c", borderRadius: "8px" }}
          >
            <strong style={{ fontSize: "1rem" }}>{handleUserFullName()}</strong>
            {userRole && (
              <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
                ({userRole.charAt(0).toUpperCase() + userRole.slice(1)})
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow-1">
          {accessibleMenuItems.map((menuItem) => (
            <Link
              key={menuItem.route} // Use route as key if unique, or a proper ID
              to={menuItem.route}
              className="d-block text-decoration-none mb-3"
              style={{
                color: "#fff",
                backgroundColor: "#2c2c2c",
                borderRadius: "8px",
                padding: "14px 16px",
                fontWeight: 500,
                fontSize: "1.1rem",
                transition: "all 0.2s",
                borderLeft: "4px solid #4a90e2",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3c3c3c";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2c2c2c";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {/* {menuItem.icon} */} {/* Uncomment and add icons */}
              <span style={{ marginRight: "12px", fontSize: "1.2rem" }}></span>
              {menuItem.title}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-danger mt-auto"
          onClick={handleLogout}
          disabled={loadingLogout}
          style={{
            padding: "14px",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {loadingLogout ? (
            <>
              <SpinnerSmall /> Logging Out...
            </>
          ) : (
            "Logout"
          )}
        </button>
      </nav>
    </>
  );
};

export default Navbar;

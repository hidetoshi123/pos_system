import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { FormEvent } from "react";
import { useState } from "react";
import ErrorHandler from "./handler/ErrorHandler";
import SpinnerSmall from "./SpinnerSmall";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loadingLogout, setLoadingLogout] = useState(false);

  const getUserRole = (): string | null => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    return parsedUser?.role || null;
  };

  const userRole = getUserRole() || "";

  const menuItems = [
    { route: "/users", title: "Users", allowedRoles: ["administrator"] },
    {
      route: "/items",
      title: "Items",
      allowedRoles: ["administrator", "manager"],
    },
    {
      route: "/products",
      title: "Products",
      allowedRoles: ["administrator", "manager", "cashier"],
    },
    {
      route: "/charts",
      title: "Charts",
      allowedRoles: ["administrator", "manager"],
    },
    {
      route: "/reports",
      title: "Reports",
      allowedRoles: ["administrator", "manager"],
    },
    {
      route: "/feedback",
      title: "Feedback",
      allowedRoles: ["administrator", "manager"],
    },
  ];

  const accessibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  const handleLogout = (e: FormEvent) => {
    e.preventDefault();
    setLoadingLogout(true);
    logout()
      .then(() => navigate("/"))
      .catch((error) => ErrorHandler(error, null))
      .finally(() => setLoadingLogout(false));
  };

  const handleUserFullName = () => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    let fullName = "";
    if (parsedUser?.middle_name) {
      fullName = `${parsedUser.last_name}, ${parsedUser.first_name} ${parsedUser.middle_name[0]}.`;
    } else if (parsedUser) {
      fullName = `${parsedUser.last_name}, ${parsedUser.first_name}`;
    }
    return fullName;
  };

  return (
    <nav
      className="d-flex align-items-center justify-content-between mb-3"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: "80px",
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: "#1a1a1a",
        borderBottom: "1px solid #333",
        zIndex: 1000,
      }}
    >
      <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
        <img
          src="src/assets/images/techfour.jpg"
          alt="Logo"
          style={{
            width: "48px",
            height: "48px",
            marginRight: "12px",
            borderRadius: "8px",
          }}
        />
        <span
          style={{
            color: "#fff",
            fontSize: "1.8rem",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          TechFour
        </span>

        {accessibleMenuItems.map((menuItem, index) => (
          <li className="nav-item" key={index}>
            <Link
              className="nav-link"
              to={menuItem.route}
              style={{
                padding: "10px 24px",
                backgroundColor: "#2c2c2c",
                borderRadius: "6px",
                color: "#fff",
                fontWeight: 500,
                fontSize: "1rem",
                textDecoration: "none",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#444")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2c2c2c")
              }
            >
              {menuItem.title}
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", alignItems: "center" }}>
        <strong
          style={{ color: "#fff", marginRight: "12px", fontSize: "1rem" }}
        >
          {handleUserFullName()}
        </strong>
        <button
          type="button"
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #fff",
            backgroundColor: "transparent",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          onClick={handleLogout}
          disabled={loadingLogout}
        >
          {loadingLogout ? (
            <>
              <SpinnerSmall /> Logging Out...
            </>
          ) : (
            "Logout"
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

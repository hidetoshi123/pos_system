// Tibor_pos_system\client\src\components\table\user\UsersTable.tsx
// ...other imports remain unchanged

import AddUserModal from "../../modals/user/AddUserModal";
import Spinner from "../../Spinner";
import UserService from "../../../services/UserService";
import ErrorHandler from "../../handler/ErrorHandler";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  user_image: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  role: string;
  user_status: string;
}

interface UsersTableProps {
  refreshUsers: boolean;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UsersTable = ({
  refreshUsers,
  onEditUser,
  onDeleteUser,
}: UsersTableProps) => {
  const [state, setState] = useState({
    loadingUsers: true,
    users: [] as User[],
  });
  const [filter, setFilter] = useState({ name: "", role: "" });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [internalRefresh, setInternalRefresh] = useState(false);

  const handleLoadUsers = () => {
    setState((prevState) => ({ ...prevState, loadingUsers: true }));
    UserService.loadUsers()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({ ...prevState, users: res.data.users }));
        }
      })
      .catch((error) => ErrorHandler(error, null))
      .finally(() => {
        setState((prevState) => ({ ...prevState, loadingUsers: false }));
      });
  };

  useEffect(() => {
    handleLoadUsers();
  }, [refreshUsers, internalRefresh]);

  const handleRefreshUsers = () => setInternalRefresh((prev) => !prev);

  const filteredUsers = state.users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return (
      (filter.name === "" || fullName.includes(filter.name.toLowerCase())) &&
      (filter.role === "" || user.role === filter.role)
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9f9f9",
        padding: "32px",
        fontSize: "18px", // Increased base font size
      }}
    >
      {/* Top Bar with Filters & Add Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "30px", // Increased margin
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "16px", // Increased gap
            flexWrap: "wrap",
            alignItems: "center",
            background: "#ffffff",
            padding: "16px 20px", // Increased padding
            borderRadius: "12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            border: "1px solid #ddd",
            fontSize: "18px", // Increased font size
          }}
        >
          <input
            type="text"
            className="form-control"
            style={{
              width: "250px", // Increased width
              fontSize: "18px", // Increased font size
              padding: "10px", // Increased padding
            }}
            placeholder="Search by name"
            value={filter.name}
            onChange={(e) => setFilter((f) => ({ ...f, name: e.target.value }))}
          />
          <select
            className="form-select"
            style={{
              width: "200px", // Increased width
              fontSize: "18px", // Increased font size
              padding: "10px", // Increased padding
            }}
            value={filter.role}
            onChange={(e) => setFilter((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="">All Roles</option>
            <option value="administrator">Administrator</option>
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
          </select>
          <button
            className="btn btn-outline-secondary"
            style={{
              fontSize: "18px", // Increased font size
              padding: "10px 20px", // Increased padding
            }}
            onClick={() => setFilter({ name: "", role: "" })}
          >
            Reset
          </button>
        </div>

        {/* Add Button */}
        <button
          className="btn btn-primary"
          style={{
            marginTop: "16px", // Increased margin
            fontSize: "20px", // Increased font size
            padding: "12px 24px", // Increased padding
          }}
          onClick={() => setShowAddUserModal(true)}
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflowX: "auto", // Added for horizontal scrolling if needed
        }}
      >
        <table
          className="table"
          style={{
            width: "100%",
            borderSpacing: "0 16px", // Increased spacing
            fontSize: "18px", // Increased font size
          }}
        >
          <thead>
            <tr
              style={{
                fontSize: "20px", // Increased font size
                color: "#555",
                height: "60px", // Increased row height
              }}
            >
              <th style={{ padding: "16px" }}>No.</th>
              <th style={{ padding: "16px" }}>Image</th>
              <th style={{ padding: "16px" }}>Full Name</th>
              <th style={{ padding: "16px" }}>Username</th>
              <th style={{ padding: "16px" }}>Email</th>
              <th style={{ padding: "16px" }}>Phone</th>
              <th style={{ padding: "16px" }}>Address</th>
              <th style={{ padding: "16px" }}>Role</th>
              <th style={{ padding: "16px" }}>Status</th>
              <th style={{ padding: "16px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.loadingUsers ? (
              <tr>
                <td
                  colSpan={10}
                  className="text-center"
                  style={{ padding: "30px" }}
                >
                  <Spinner />
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.user_id}
                  className="align-middle"
                  style={{
                    background: "#fff",
                    borderBottom: "1px solid #eee",
                    height: "70px", // Increased row height
                  }}
                >
                  <td style={{ padding: "16px" }}>{index + 1}</td>
                  <td style={{ padding: "16px" }}>
                    {user.user_image ? (
                      <Link to={`/users/${user.user_id}`}>
                        <img
                          src={`http://localhost:8000/storage/${user.user_image}`}
                          alt={user.user_name}
                          className="rounded-circle"
                          style={{
                            width: "64px", // Increased size
                            height: "64px", // Increased size
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      </Link>
                    ) : (
                      <div
                        style={{
                          width: "64px", // Increased size
                          height: "64px", // Increased size
                          borderRadius: "50%",
                          backgroundColor: "#ccc",
                          display: "inline-block",
                        }}
                      />
                    )}
                  </td>
                  <td
                    style={{ padding: "16px" }}
                  >{`${user.last_name}, ${user.first_name}`}</td>
                  <td style={{ padding: "16px" }}>{user.user_name}</td>
                  <td style={{ padding: "16px" }}>{user.user_email}</td>
                  <td style={{ padding: "16px" }}>{user.user_phone}</td>
                  <td style={{ padding: "16px" }}>{user.user_address}</td>
                  <td style={{ padding: "16px" }}>{user.role}</td>
                  <td style={{ padding: "16px" }}>
                    <span
                      className={`badge ${
                        user.user_status === "Active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                      style={{
                        fontSize: "1rem", // Increased font size
                        padding: "8px 16px", // Increased padding
                        borderRadius: "20px",
                        textTransform: "uppercase",
                      }}
                    >
                      {user.user_status}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        style={{
                          borderRadius: "20px",
                          marginRight: "10px", // Increased margin
                          fontSize: "18px", // Increased font size
                          padding: "8px 16px", // Increased padding
                        }}
                        onClick={() => onEditUser(user)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        style={{
                          borderRadius: "20px",
                          fontSize: "18px", // Increased font size
                          padding: "8px 16px", // Increased padding
                        }}
                        onClick={() => onDeleteUser(user)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="align-middle">
                <td
                  colSpan={10}
                  className="text-center text-muted"
                  style={{ padding: "30px", fontSize: "20px" }}
                >
                  No Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddUserModal
        showModal={showAddUserModal}
        onRefreshUsers={handleRefreshUsers}
        onClose={() => setShowAddUserModal(false)}
      />
    </div>
  );
};

export default UsersTable;

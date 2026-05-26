// UserManagement.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserManagement.module.css";
import { ENDPOINTS } from "../../endpoints.js";
import commonFunctions from "../commonFunctions.js";

export default function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [typeOfUser, setTypeOfUser] = useState("");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  const [showCreateCard, setShowCreateCard] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const initialForm = {
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    typeOfUser: "student",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleUnauthorized = async (res) => {
    if (res.status === 401 || res.status === 403) {
      await commonFunctions.handleUnauthorizedAccess(navigate);
      return true;
    }

    return false;
  };

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams();

      query.append("page", page);
      query.append("limit", limit);

      if (typeOfUser) {
        query.append("typeOfUser", typeOfUser);
      }

      if (search) {
        query.append("search", search);
      }

      const res = await fetch(
        `${ENDPOINTS.USER.GET}?${query.toString()}`,
        {
          credentials: "include",
        }
      );

      if (await handleUnauthorized(res)) return;

      const data = await res.json();

      setUsers(data.users || []);
      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalUsers: 0,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `${ENDPOINTS.USER.DELETE}/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (await handleUnauthorized(res)) return;

      const data = await res.json();

      alert(data.message || "User Deleted Successfully");

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, typeOfUser, search]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        ENDPOINTS.AUTHENTICATION.REGISTER,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (await handleUnauthorized(res)) return;

      const data = await res.json();

      alert(data.message || "User Created");

      setShowCreateCard(false);
      setFormData(initialForm);

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePatchUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${ENDPOINTS.USER.PATCH}/${editingUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (await handleUnauthorized(res)) return;

      const data = await res.json();

      alert(data.message || "User Updated");

      setEditingUser(null);
      setFormData(initialForm);

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditCard = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      contactNumber: user.contactNumber || "",
      password: "",
      typeOfUser: user.typeOfUser || "student",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>User Management</h1>

        <button
          className={styles.addButton}
          onClick={() => setShowCreateCard(true)}
        >
          <span>+</span> Add New User
        </button>
      </div>

      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search by Name, Email, ID or Contact..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={styles.input}
        />

        <select
          value={typeOfUser}
          onChange={(e) => {
            setTypeOfUser(e.target.value);
            setPage(1);
          }}
          className={styles.select}
        >
          <option value="">All Account Types</option>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <div className={styles.userSection}>
        {users?.map((user) => (
          <div key={user._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.userName}>
                {user.name}
              </span>

              <span
                className={`${styles.roleBadge} ${
                  styles[user.typeOfUser] || ""
                }`}
              >
                {user.typeOfUser}
              </span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.infoLine}>
                <span className={styles.label}>Email:</span>
                <span className={styles.val}>
                  {user.email}
                </span>
              </div>

              <div className={styles.infoLine}>
                <span className={styles.label}>Contact:</span>
                <span className={styles.val}>
                  {user.contactNumber || "—"}
                </span>
              </div>

              <div className={styles.infoLine}>
                <span className={styles.label}>System ID:</span>
                <span className={styles.uid}>
                  {user._id}
                </span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                className={styles.editButton}
                onClick={() => openEditCard(user)}
              >
                Edit Parameters
              </button>

              <button
                className={styles.deleteButton}
                onClick={() =>
                  handleDeleteUser(user._id)
                }
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={styles.pageBtn}
        >
          ← Previous
        </button>

        <span className={styles.pageIndicator}>
          Page <strong>{pagination.currentPage}</strong> of{" "}
          {pagination.totalPages}
        </span>

        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={styles.pageBtn}
        >
          Next →
        </button>
      </div>

      {(showCreateCard || editingUser) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h2 className={styles.modalTitle}>
              {editingUser
                ? "Modify User Account"
                : "Register Campus User"}
            </h2>

            <form
              onSubmit={
                editingUser
                  ? handlePatchUser
                  : handleCreateUser
              }
              className={styles.modalForm}
            >
              <div className={styles.formGroup}>
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="johndoe@campus.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Contact Number</label>

                <input
                  type="text"
                  name="contactNumber"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Account Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder={
                    editingUser
                      ? "Leave blank to preserve current"
                      : "••••••••"
                  }
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role Clearance</label>

                <select
                  name="typeOfUser"
                  value={formData.typeOfUser}
                  onChange={handleInputChange}
                >
                  <option value="student">
                    Student
                  </option>
                  <option value="staff">
                    Staff
                  </option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.saveBtn}
                >
                  {editingUser
                    ? "Save Updates"
                    : "Register Account"}
                </button>

                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowCreateCard(false);
                    setEditingUser(null);
                    setFormData(initialForm);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
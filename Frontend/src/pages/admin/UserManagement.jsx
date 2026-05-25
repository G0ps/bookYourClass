import { useEffect, useState } from "react";
import styles from "./UserManagement.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [typeOfUser, setTypeOfUser] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
    });

  const [showCreateCard, setShowCreateCard] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const initialForm = {
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    typeOfUser: "student",
  };

  const [formData, setFormData] =
    useState(initialForm);

  const fetchUsers = async () => {
    try {
      const query =
        new URLSearchParams();

      query.append("page", page);
      query.append("limit", limit);

      if (typeOfUser) {
        query.append(
          "typeOfUser",
          typeOfUser
        );
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

      const data = await res.json();

      setUsers(data.users || []);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (
  userId
) => {
  const confirmed =
    window.confirm(
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

    const data = await res.json();

    alert(
      data.message ||
        "User Deleted Successfully"
    );

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
      [e.target.name]:
        e.target.value,
    });
  };

  const handleCreateUser =
    async (e) => {
      e.preventDefault();

      try {
        const res = await fetch(
          ENDPOINTS.AUTHENTICATION
            .REGISTER,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
              formData
            ),
          }
        );

        const data =
          await res.json();

        alert(
          data.message ||
            "User Created"
        );

        setShowCreateCard(false);

        setFormData(initialForm);

        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    };

  const handlePatchUser =
    async (e) => {
      e.preventDefault();

      try {
        const res = await fetch(
          `${ENDPOINTS.USER.PATCH}/${editingUser._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
              formData
            ),
          }
        );

        const data =
          await res.json();

        alert(
          data.message ||
            "User Updated"
        );

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
      contactNumber:
        user.contactNumber || "",
      password: "",
      typeOfUser:
        user.typeOfUser ||
        "student",
    });
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.addButton}
        onClick={() =>
          setShowCreateCard(true)
        }
      >
        +
      </button>

      <h1 className={styles.heading}>
        User Management
      </h1>

      <div
        className={
          styles.filterSection
        }
      >
        <input
          type="text"
          placeholder="Search by Name, Email, ID or Contact Number"
          value={search}
          onChange={(e) => {
            setSearch(
              e.target.value
            );
            setPage(1);
          }}
          className={styles.input}
        />

        <select
          value={typeOfUser}
          onChange={(e) => {
            setTypeOfUser(
              e.target.value
            );
            setPage(1);
          }}
          className={styles.select}
        >
          <option value="">
            All Users
          </option>

          <option value="student">
            Student
          </option>

          <option value="staff">
            Staff
          </option>
        </select>
      </div>

      <div
        className={styles.userSection}
      >
        {users?.map((user) => (
          <div
            key={user._id}
            className={styles.card}
          >
            <div>
              <span>Name :</span>{" "}
              {user.name}
            </div>

            <div>
              <span>Email :</span>{" "}
              {user.email}
            </div>

            <div>
              <span>Contact :</span>{" "}
              {
                user.contactNumber
              }
            </div>

            <div>
              <span>
                User Type :
              </span>{" "}
              {user.typeOfUser}
            </div>

            <div>
              <span>ID :</span>{" "}
              {user._id}
            </div>
            <div className={styles.cardActions}>
            <button
              className={styles.editButton}
              onClick={() => openEditCard(user)}
            >
              Edit
            </button>

            <button
              className={styles.editButton}
              onClick={() =>
                handleDeleteUser(user._id)
              }
            >
              Delete
            </button>
          </div>
          </div>  
        ))}
      </div>

      <div
        className={styles.pagination}
      >
        <button
          disabled={page === 1}
          onClick={() =>
            setPage(
              (prev) =>
                prev - 1
            )
          }
        >
          Prev
        </button>

        <span>
          Page{" "}
          {
            pagination.currentPage
          }{" "}
          of{" "}
          {
            pagination.totalPages
          }
        </span>

        <button
          disabled={
            page ===
            pagination.totalPages
          }
          onClick={() =>
            setPage(
              (prev) =>
                prev + 1
            )
          }
        >
          Next
        </button>
      </div>

      {(showCreateCard ||
        editingUser) && (
        <div
          className={
            styles.modalOverlay
          }
        >
          <div
            className={
              styles.modalCard
            }
          >
            <h2>
              {editingUser
                ? "Edit User"
                : "Create User"}
            </h2>

            <form
              onSubmit={
                editingUser
                  ? handlePatchUser
                  : handleCreateUser
              }
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={
                  formData.name
                }
                onChange={
                  handleInputChange
                }
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={
                  formData.email
                }
                onChange={
                  handleInputChange
                }
              />

              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={
                  formData.contactNumber
                }
                onChange={
                  handleInputChange
                }
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={
                  formData.password
                }
                onChange={
                  handleInputChange
                }
              />

              <select
                name="typeOfUser"
                value={
                  formData.typeOfUser
                }
                onChange={
                  handleInputChange
                }
              >
                <option value="student">
                  Student
                </option>

                <option value="staff">
                  Staff
                </option>
              </select>

              <div
                className={
                  styles.modalActions
                }
              >
                <button
                  type="submit"
                >
                  {editingUser
                    ? "Update"
                    : "Create"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateCard(
                      false
                    );
                    setEditingUser(
                      null
                    );
                    setFormData(
                      initialForm
                    );
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
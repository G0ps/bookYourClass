import { useEffect, useState } from "react";
import styles from "./UserManagement.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [typeOfUser, setTypeOfUser] =
    useState("");

  const [search, setSearch] = useState("");

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
    });

  useEffect(() => {
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

    fetchUsers();
  }, [page, limit, typeOfUser, search]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        User Management
      </h2>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search user"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={typeOfUser}
          onChange={(e) => {
            setTypeOfUser(e.target.value);
            setPage(1);
          }}
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

      <div className={styles.table}>
        {users?.map((user) => (
          <div
            key={user._id}
            className={styles.row}
          >
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>
              {user.typeOfUser}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
        >
          Prev
        </button>

        <span>
          Page {pagination.currentPage} of{" "}
          {pagination.totalPages}
        </span>

        <button
          disabled={
            page ===
            pagination.totalPages
          }
          onClick={() =>
            setPage((prev) => prev + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
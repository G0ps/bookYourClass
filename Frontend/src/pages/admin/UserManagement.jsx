import { useEffect, useState } from "react";
import styles from "./UserManagement.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(ENDPOINTS.USER.GET, {
          credentials: "include",
        });
        const data = await res.json();
        setUsers(data.users);
        // console.log("users : " , data)
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Management</h2>

      <div className={styles.table}>
        {(users || users.length > 0) && users.map((user) => (
          <div key={user._id} className={styles.row}>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{user.typeOfUser}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
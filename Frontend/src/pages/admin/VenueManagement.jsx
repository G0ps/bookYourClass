import { useEffect, useState } from "react";
import styles from "./VenueManagement.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function VenueManagement() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch(ENDPOINTS.VENUE.GET, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("venue : dta : " , data);
        setVenues(data.venues);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Venue Management</h2>

      <div className={styles.table}>
        {(venues || venues.length > 0) && venues.map((v) => (
          <div key={v._id} className={styles.row}>
            <div>{v.name}</div>
            <div>{v.block}</div>
            <div>{v.capacity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
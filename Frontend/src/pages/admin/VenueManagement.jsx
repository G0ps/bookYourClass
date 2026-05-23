import { useEffect, useState } from "react";
import styles from "./VenueManagement.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function VenueManagement() {
  const [venues, setVenues] =
    useState([]);

  const [page, setPage] =
    useState(1);

  const [limit] = useState(10);

  const [block, setBlock] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalVenues: 0,
    });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const query =
          new URLSearchParams();

        query.append("page", page);
        query.append("limit", limit);

        if (block) {
          query.append("block", block);
        }

        if (search) {
          query.append("search", search);
        }

        const res = await fetch(
          `${ENDPOINTS.VENUE.GET}?${query.toString()}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        setVenues(data.venues || []);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVenues();
  }, [page, limit, block, search]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Venue Management
      </h2>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search venue"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <input
          type="text"
          placeholder="Filter by block"
          value={block}
          onChange={(e) => {
            setBlock(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className={styles.table}>
        {venues?.map((v) => (
          <div
            key={v._id}
            className={styles.row}
          >
            <div>{v.name}</div>

            <div>{v.block}</div>

            <div>{v.capacity}</div>

            <div>
              {v.inchargeIds
                ?.map(
                  (staff) => staff.name
                )
                .join(", ")}
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
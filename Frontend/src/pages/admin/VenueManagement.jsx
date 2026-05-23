import { useEffect, useState } from "react";
import styles from "./VenueManagement.module.css";
import { ENDPOINTS } from "../../endpoints";

export default function VenueManagement() {
  const [venues, setVenues] =
    useState([]);

  const [page, setPage] =
    useState(1);

  const [limit] = useState(10);

  const [search, setSearch] =
    useState("");

  const [block, setBlock] =
    useState("");

  const [
    inchargeName,
    setInchargeName,
  ] = useState("");

  const [inchargeId, setInchargeId] =
    useState("");

  const [capacity, setCapacity] =
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

        if (search) {
          query.append("search", search);
        }

        if (block) {
          query.append("block", block);
        }

        if (inchargeName) {
          query.append(
            "inchargeName",
            inchargeName
          );
        }

        if (inchargeId) {
          query.append(
            "inchargeId",
            inchargeId
          );
        }

        if (capacity) {
          query.append(
            "capacity",
            capacity
          );
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
  }, [
    page,
    limit,
    search,
    block,
    inchargeName,
    inchargeId,
    capacity,
  ]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Venue Management
      </h1>

      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search Venue Name / ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Block"
          value={block}
          onChange={(e) => {
            setBlock(e.target.value);
            setPage(1);
          }}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Incharge Name"
          value={inchargeName}
          onChange={(e) => {
            setInchargeName(
              e.target.value
            );
            setPage(1);
          }}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Incharge IDs (coma seperated)"
          value={inchargeId}
          onChange={(e) => {
            setInchargeId(
              e.target.value
            );
            setPage(1);
          }}
          className={styles.input}
        />

        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => {
            setCapacity(
              e.target.value
            );
            setPage(1);
          }}
          className={styles.input}
        />
      </div>

      <div className={styles.venueSection}>
        {venues?.map((venue) => (
          <div
            key={venue._id}
            className={styles.card}
          >
            <div>
              <span>Name :</span>{" "}
              {venue.name}
            </div>

            <div>
              <span>Block :</span>{" "}
              {venue.block}
            </div>

            <div>
              <span>Capacity :</span>{" "}
              {venue.capacity}
            </div>

            <div>
              <span>Venue ID :</span>{" "}
              {venue._id}
            </div>

            <div>
              <span>Incharges :</span>{" "}
              {venue.inchargeIds
                ?.map(
                  (staff) =>
                    `${staff.name}`
                )
                .join(", ")}
            </div>

            <div>
              <span>Incharge IDs :</span>{" "}
              {venue.inchargeIds
                ?.map(
                  (staff) => staff._id
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
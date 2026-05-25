import { useEffect, useState } from "react";
import styles from "./VenueManagement.module.css";
import { ENDPOINTS } from "../../endpoints";


export default function VenueManagement() {

  const handleInputChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]:
      e.target.value,
  });
};

const handleCreateVenue =
  async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        capacity: Number(
          formData.capacity
        ),
        inchargeIds:
          formData.inchargeIds
            .split(",")
            .map((id) =>
              id.trim()
            ),
      };

      const res = await fetch(
        ENDPOINTS.VENUE.POST,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify(
            payload
          ),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        let errorMessage =
          data.message || "Request Failed";

        if (
          data.missingFields &&
          data.missingFields.length > 0
        ) {
          errorMessage +=
            "\n\nMissing Fields:\n" +
            data.missingFields.join(
              "\n"
            );
        }

        alert(errorMessage);
        return;
      }

      alert(
        data.message ||
        "Venue Created Successfully"
      );

      setShowCreateCard(false);

      setFormData(initialForm);

      if (
      venues.length === 1 &&
      page > 1
    ) {
      setPage((prev) => prev - 1);
    } else {
      fetchVenues();
    }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditCard = (venue) => {
  setEditingVenue(venue);

  setFormData({
    name: venue.name || "",
    block: venue.block || "",
    capacity:
      venue.capacity || "",
    inchargeIds:
      venue.inchargeIds
        ?.map(
          (staff) => staff._id
        )
        .join(",") || "",
  });
};

const handlePatchVenue =
  async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        block: formData.block,
        capacity: Number(
          formData.capacity
        ),
        inchargeIds:
          formData.inchargeIds
            .split(",")
            .map((id) =>
              id.trim()
            ),
      };

      const res = await fetch(
        ENDPOINTS.VENUE.PATCH(
          editingVenue._id
        ),
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify(
            payload
          ),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        let errorMessage =
          data.message || "Request Failed";

        if (
          data.missingFields &&
          data.missingFields.length > 0
        ) {
          errorMessage +=
            "\n\nMissing Fields:\n" +
            data.missingFields.join(
              "\n"
            );
        }

        alert(errorMessage);
        return;
      }

      alert(
        data.message ||
        "Venue Created Successfully"
      );
      setEditingVenue(null);

      setFormData(initialForm);

    if (
      venues.length === 1 &&
      page > 1
    ) {
      setPage((prev) => prev - 1);
    } else {
      fetchVenues();
    }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVenue =
  async (venueId) => {
    const confirmed =
      window.confirm(
        "Delete this venue?"
      );

    if (!confirmed) return;

    try {
      const res = await fetch(
        ENDPOINTS.VENUE.DELETE(
          venueId
        ),
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data =
        await res.json();

      alert(
        data.message ||
          "Venue Deleted"
      );

      if (
        venues.length === 1 &&
        page > 1
      ) {
        setPage((prev) => prev - 1);
      } else {
        fetchVenues();
      }
    } catch (err) {
      console.error(err);
    }
  };

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


  const [venues, setVenues] =
    useState([]);

  const [page, setPage] =
    useState(1);

  const [limit] = useState(10);

  const [search, setSearch] =
    useState("");

  const [block, setBlock] =
    useState("");

  const [showCreateCard, setShowCreateCard] =
  useState(false);

  const [editingVenue, setEditingVenue] =
    useState(null);

  const initialForm = {
    name: "",
    block: "",
    capacity: "",
    inchargeIds: "",
  };

  const [formData, setFormData] =
    useState(initialForm);

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
    if (
    venues.length === 1 &&
    page > 1
  ) {
    setPage((prev) => prev - 1);
  } else {
    fetchVenues();
  }
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
      <button
      className={styles.addButton}
      onClick={() =>
        setShowCreateCard(true)
      }
    >
      +
    </button>

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
            <div
              className={styles.cardActions}
            >
              <button
                className={styles.editButton}
                onClick={() =>
                  openEditCard(venue)
                }
              >
                Edit
              </button>

              <button
                className={
                  styles.deleteButton
                }
                onClick={() =>
                  handleDeleteVenue(
                    venue._id
                  )
                }
              >
                Delete
              </button>
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
      {(showCreateCard ||
  editingVenue) && (
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
        {editingVenue
          ? "Edit Venue"
          : "Add Venue"}
      </h2>

      <form
        onSubmit={
          editingVenue
            ? handlePatchVenue
            : handleCreateVenue
        }
      >
        <input
          type="text"
          name="name"
          placeholder="Venue Name"
          value={formData.name}
          onChange={
            handleInputChange
          }
        />

        <input
          type="text"
          name="block"
          placeholder="Block"
          value={
            formData.block
          }
          onChange={
            handleInputChange
          }
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={
            formData.capacity
          }
          onChange={
            handleInputChange
          }
        />

        <input
          type="text"
          name="inchargeIds"
          placeholder="Staff IDs comma separated"
          value={
            formData.inchargeIds
          }
          onChange={
            handleInputChange
          }
        />

        <div
          className={
            styles.modalActions
          }
        >
          <button
            type="submit"
          >
            {editingVenue
              ? "Update"
              : "Create"}
          </button>

          <button
                type="button"
                onClick={() => {
                  setShowCreateCard(
                    false
                  );

                  setEditingVenue(
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
// VenueManagement.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VenueManagement.module.css";
import { ENDPOINTS } from "../../endpoints.js";
import commonFunctions from "../commonFunctions.js";

export default function VenueManagement() {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const [block, setBlock] = useState("");
  const [inchargeName, setInchargeName] = useState("");
  const [inchargeId, setInchargeId] = useState("");
  const [capacity, setCapacity] = useState("");

  const [showCreateCard, setShowCreateCard] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVenues: 0,
  });

  const initialForm = {
    name: "",
    block: "",
    capacity: "",
    inchargeIds: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleUnauthorized = async (res) => {
    if (res.status === 401 || res.status === 403) {
      await commonFunctions.handleUnauthorizedAccess(navigate);
      return true;
    }

    return false;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchVenues = async () => {
    try {
      const query = new URLSearchParams();

      query.append("page", page);
      query.append("limit", limit);

      if (search) query.append("search", search);
      if (block) query.append("block", block);
      if (inchargeName) query.append("inchargeName", inchargeName);
      if (inchargeId) query.append("inchargeId", inchargeId);
      if (capacity) query.append("capacity", capacity);

      const res = await fetch(
        `${ENDPOINTS.VENUE.GET}?${query.toString()}`,
        {
          credentials: "include",
        }
      );

      if (await handleUnauthorized(res)) return;

      const data = await res.json();

      setVenues(data.venues || []);

      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalVenues: 0,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateVenue = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        inchargeIds: formData.inchargeIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id !== ""),
      };

      const res = await fetch(ENDPOINTS.VENUE.POST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (await handleUnauthorized(res)) return;

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = data.message || "Request Failed";

        if (
          data.missingFields &&
          data.missingFields.length > 0
        ) {
          errorMessage +=
            "\n\nMissing Fields:\n" +
            data.missingFields.join("\n");
        }

        alert(errorMessage);
        return;
      }

      alert(data.message || "Venue Created Successfully");

      setShowCreateCard(false);
      setFormData(initialForm);

      if (venues.length === 1 && page > 1) {
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
      capacity: venue.capacity || "",
      inchargeIds:
        venue.inchargeIds
          ?.map((staff) => staff._id)
          .join(", ") || "",
    });
  };

  const handlePatchVenue = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        block: formData.block,
        capacity: Number(formData.capacity),
        inchargeIds: formData.inchargeIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id !== ""),
      };

      const res = await fetch(
        ENDPOINTS.VENUE.PATCH(editingVenue._id),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (await handleUnauthorized(res)) return;

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = data.message || "Request Failed";

        if (
          data.missingFields &&
          data.missingFields.length > 0
        ) {
          errorMessage +=
            "\n\nMissing Fields:\n" +
            data.missingFields.join("\n");
        }

        alert(errorMessage);
        return;
      }

      alert(data.message || "Venue Updated Successfully");

      setEditingVenue(null);
      setFormData(initialForm);

      if (venues.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchVenues();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    const confirmed = window.confirm(
      "Delete this venue?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        ENDPOINTS.VENUE.DELETE(venueId),
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (await handleUnauthorized(res)) return;

      const data = await res.json();

      alert(data.message || "Venue Deleted");

      if (venues.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchVenues();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
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
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>
          Venue Management
        </h1>

        <button
          className={styles.addButton}
          onClick={() => setShowCreateCard(true)}
        >
          <span>+</span> Add New Venue
        </button>
      </div>

      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search Venue Name / ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Filter by Block"
          value={block}
          onChange={(e) => {
            setBlock(e.target.value);
            setPage(1);
          }}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Incharge Person Name"
          value={inchargeName}
          onChange={(e) => {
            setInchargeName(e.target.value);
            setPage(1);
          }}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Incharge Staff ID(s)"
          value={inchargeId}
          onChange={(e) => {
            setInchargeId(e.target.value);
            setPage(1);
          }}
          className={styles.input}
        />

        <input
          type="number"
          placeholder="Minimum Capacity"
          value={capacity}
          onChange={(e) => {
            setCapacity(e.target.value);
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
            <div className={styles.cardHeader}>
              <span className={styles.venueName}>
                {venue.name}
              </span>

              <span className={styles.blockBadge}>
                Block {venue.block || "—"}
              </span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.infoLine}>
                <span className={styles.label}>
                  Total Capacity:
                </span>

                <span className={styles.val}>
                  {venue.capacity} Seats
                </span>
              </div>

              <div className={styles.infoLine}>
                <span className={styles.label}>
                  Venue ID:
                </span>

                <span className={styles.uid}>
                  {venue._id}
                </span>
              </div>

              <div className={styles.stackedInfo}>
                <span className={styles.label}>
                  Assigned Incharges:
                </span>

                <p className={styles.textList}>
                  {venue.inchargeIds &&
                  venue.inchargeIds.length > 0
                    ? venue.inchargeIds
                        .map((staff) => staff.name)
                        .join(", ")
                    : "None Assigned"}
                </p>
              </div>

              <div className={styles.stackedInfo}>
                <span className={styles.label}>
                  Staff Reference IDs:
                </span>

                <p className={styles.uidList}>
                  {venue.inchargeIds &&
                  venue.inchargeIds.length > 0
                    ? venue.inchargeIds
                        .map((staff) => staff._id)
                        .join(", ")
                    : "—"}
                </p>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                className={styles.editButton}
                onClick={() =>
                  openEditCard(venue)
                }
              >
                Modify Setup
              </button>

              <button
                className={styles.deleteButton}
                onClick={() =>
                  handleDeleteVenue(venue._id)
                }
              >
                Remove
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
          className={styles.pageBtn}
        >
          ← Previous
        </button>

        <span className={styles.pageIndicator}>
          Page <strong>{pagination.currentPage}</strong>{" "}
          of {pagination.totalPages}
        </span>

        <button
          disabled={
            page === pagination.totalPages
          }
          onClick={() =>
            setPage((prev) => prev + 1)
          }
          className={styles.pageBtn}
        >
          Next →
        </button>
      </div>

      {(showCreateCard || editingVenue) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h2 className={styles.modalTitle}>
              {editingVenue
                ? "Modify Infrastructure Parameters"
                : "Provision New Campus Venue"}
            </h2>

            <form
              onSubmit={
                editingVenue
                  ? handlePatchVenue
                  : handleCreateVenue
              }
              className={styles.modalForm}
            >
              <div className={styles.formGroup}>
                <label>
                  Venue Name / Room Number
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Seminar Hall II, Lab 4"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  Building Block Designation
                </label>

                <input
                  type="text"
                  name="block"
                  placeholder="e.g., A, Tech Core"
                  value={formData.block}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Seating Capacity</label>

                <input
                  type="number"
                  name="capacity"
                  placeholder="e.g., 60"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  Incharge Staff System IDs
                  (Comma-Separated)
                </label>

                <input
                  type="text"
                  name="inchargeIds"
                  placeholder="65eb..., 65ec..."
                  value={formData.inchargeIds}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.saveBtn}
                >
                  {editingVenue
                    ? "Apply Changes"
                    : "Create Facility"}
                </button>

                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowCreateCard(false);
                    setEditingVenue(null);
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
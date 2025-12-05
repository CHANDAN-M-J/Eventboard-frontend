import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EventListPage({ showNotification }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search filters
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchUserId, setSearchUserId] = useState("");

  const categories = ["MUSIC", "CULTURAL", "TECH", "SPORTS", "EDUCATION", "WORKSHOP"];

  // Load all events initially
  const loadEvents = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/events");

      if (!res.ok) {
        const text = await res.text();
        showNotification(text || "Failed to load events", "error");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setEvents(data || []);
    } catch (e) {
      console.error("Error loading event:", e);
      showNotification("Error loading events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // 🔍 Backend Search API Call
  const fetchFilteredEvents = async () => {
    const params = new URLSearchParams();

    if (searchTitle) params.append("title", searchTitle);
    if (selectedCategory) params.append("category", selectedCategory);
    if (searchLocation) params.append("location", searchLocation);
    if (searchUserId) params.append("userId", searchUserId);

    try {
      const res = await fetch(
        `http://localhost:8080/api/events/search?${params.toString()}`
      );

      const data = await res.json();
      setEvents(data);
    } catch (e) {
      console.error("Search error:", e);
      showNotification("Search failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showNotification("Event deleted", "success");
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
      } else {
        const text = await res.text();
        showNotification(text || "Failed to delete", "error");
      }
    } catch (e) {
      showNotification("Error deleting event", "error");
    }
  };

  if (loading) return <div className="container">Loading events...</div>;

  return (
    <div className="container">
      <h2>All Events</h2>

      {/* 🔍 SEARCH FILTERS UI */}
      <div className="search-box" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="search-input"
          style={{
            width: "200px",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            width: "180px",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          style={{
            width: "180px",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="number"
          placeholder="User ID"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          style={{
            width: "120px",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={fetchFilteredEvents}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {events.length === 0 && <p>No events found.</p>}

      {events.map((event) => (
        <div key={event.id} className="card">
          <h3 className="event-title">{event.title}</h3>

          <p><b>Category:</b> {event.category}</p>
          <p><b>Description:</b> {event.description}</p>
          <p><b>Location:</b> {event.location}</p>
          <p><b>Date:</b> {new Date(event.dateTime).toLocaleString()}</p>
          <p><b>Created By:</b> {event.createdBy?.email || "—"}</p>

          <div style={{ marginTop: 8 }}>
            <Link to={`/events/edit/${event.id}`}>
              <button style={{ marginRight: 10 }}>Edit</button>
            </Link>

            <button
              className="delete-btn"
              onClick={() => handleDelete(event.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventListPage;

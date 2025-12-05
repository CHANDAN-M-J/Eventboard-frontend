import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEventPage({ showNotification }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const categories = ["MUSIC", "CULTURAL", "TECH", "SPORTS", "EDUCATION", "WORKSHOP", "WORK"];

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    dateTime: "",
    userId: 1,
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return dateString.slice(0, 16);
  };

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`http://localhost:8080/api/events/${id}`);
        const data = await res.json();

        setForm({
          title: data.title,
          description: data.description,
          location: data.location,
          // ✅ FIX: force exact option match
          category: data.category.trim().toUpperCase(),
          dateTime: formatDateTime(data.dateTime),
          userId: data.userId || 1,
        });
      } catch (err) {
        console.error(err);
        showNotification("Failed to load event", "error");
      }
    }
    loadEvent();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8080/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showNotification("Event updated successfully!", "success");
        setTimeout(() => navigate("/events"), 1200);
      } else {
        showNotification("Failed to update event", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Something went wrong", "error");
    }
  };

  return (
    <div className="container">
      <h2>Edit Event</h2>

      <form onSubmit={handleSubmit} className="event-form">

        <label>Title:</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>Location:</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Date & Time:</label>
        <input
          type="datetime-local"
          name="dateTime"
          value={form.dateTime}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}

export default EditEventPage;

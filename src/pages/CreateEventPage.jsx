import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateEventPage({ showNotification }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    dateTime: "",
    userId: 1, // default valid
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    // 🔒 Validate userId (no negative, no zero)
    if (name === "userId") {
      value = value.replace("-", "");   // block "-" key
      value = value.replace("e", "");   // block "e" key

      const num = Number(value);

      if (num > 1) {
        showNotification("User ID must be positive!", "error");
        value = 1;
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra safety before API call
    if (form.userId > 1) {
      showNotification("User ID cannot be negative or zero!", "error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/events/create?userId=${form.userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            location: form.location,
            category: form.category,
            dateTime: form.dateTime,
          }),
        }
      );

      if (response.ok) {
        showNotification("Event created successfully!", "success");

        // reset form
        setForm({
          title: "",
          description: "",
          location: "",
          category: "",
          dateTime: "",
          userId: 1,
        });

        setTimeout(() => navigate("/events"), 1000);
      } else {
        const text = await response.text();
        showNotification(text || "Failed to create event", "error");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      showNotification("Something went wrong", "error");
    }
  };

  return (
    <div className="container card">
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit} className="event-form">

        <label>User ID:</label>
        <input
          type="number"
          name="userId"
          className="input-field"
          value={form.userId}
          min="1"
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
          }}
          onChange={handleChange}
          required
        />

        <label>Title:</label>
        <input
          type="text"
          name="title"
          className="input-field"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          className="input-field"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          className="input-field"
          value={form.location}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select
          name="category"
          className="input-field"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Work">Work</option>
          <option value="Music">Music</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
          <option value="Other">Other</option>
        </select>

        <label>Date & Time:</label>
        <input
          type="datetime-local"
          name="dateTime"
          className="input-field"
          value={form.dateTime}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          Create Event
        </button>
      </form>
    </div>
  );
}
export default CreateEventPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // notification
  const [type, setType] = useState("");       // success / error
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const msg = await res.text();

    if (msg === "User registered successfully!") {
      setType("success");
      setMessage(msg);

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify({ name, email }));

      // redirect after delay
      setTimeout(() => navigate("/events"), 1200);
    } else {
      setType("error");
      setMessage(msg);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      {/* Notification Box */}
      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            color: type === "success" ? "green" : "red",
            background: type === "success" ? "#e8f5e9" : "#ffebee",
            border: type === "success" ? "1px solid green" : "1px solid red",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default RegisterPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ showNotification }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const msg = await res.text();

    // send notification to App.jsx
    showNotification(
      msg,
      msg === "Login successful!" ? "success" : "error"
    );

    if (msg === "Login successful!") {
      localStorage.setItem("user", JSON.stringify({ email }));
      
      // wait 0.5 sec so user can see success message
      setTimeout(() => {
        navigate("/events");
      }, 500);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        New user? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default LoginPage;

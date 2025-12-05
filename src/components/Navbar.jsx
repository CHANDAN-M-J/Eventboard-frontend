import "../styles.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ toggleTheme, theme }) {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <h2 className="logo">EventBoard</h2>

      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/events">Events</Link>
            <Link to="/events/create">Create Event</Link>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {/* THEME BUTTON */}
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

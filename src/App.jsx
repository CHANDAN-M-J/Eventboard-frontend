import { useState, useEffect } from "react";
import "./styles.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import EventListPage from "./pages/EventListPage"; 
import { Routes, Route } from "react-router-dom";
import Notification from "./components/Notification";

function App() {
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  // THEME STATE
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const showNotification = (msg, type) => {
    setNotification({ message: msg, type });

    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  return (
    <>
      {/* Pass toggleTheme to navbar */}
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <Notification message={notification.message} type={notification.type} />

      <Routes>
        <Route path="/login" element={<Login showNotification={showNotification} />} />
        <Route path="/register" element={<RegisterPage showNotification={showNotification} />} />
        <Route path="/events" element={<EventListPage showNotification={showNotification} />} />
        <Route path="/events/create" element={<CreateEventPage showNotification={showNotification} />} />
        <Route path="/events/edit/:id" element={<EditEventPage showNotification={showNotification} />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// REGISTER
export const registerUser = (data) =>
  API.post("/api/auth/register", data);

// LOGIN
export const loginUser = (data) =>
  API.post("/api/auth/login", data);

// CREATE EVENT
export const createEvent = (data, userId) =>
  API.post(`/api/events/create?userId=${userId}`, data);

// GET EVENTS
export const getAllEvents = () =>
  API.get("/api/events");

// DELETE EVENT
export const deleteEvent = (id) =>
  API.delete(`/api/events/${id}`);

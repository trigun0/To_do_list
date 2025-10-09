import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/tasks/";

// Get all tasks
export const fetchTasks = async (query = "") => {
  const response = await axios.get(`${API_URL}${query}`);
  return response.data;
};


// Create new task
export const addTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}${id}/`, taskData);
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}${id}/`);
};

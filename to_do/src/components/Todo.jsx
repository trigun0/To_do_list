// @ts-nocheck
import React, { useState, useEffect } from "react";
import todo from "../assets/todo.png";
import TodoItems from "./TodoItems";
import { fetchTasks, addTask, updateTask, deleteTask } from "../api";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [alert, setAlert] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("");

  // ---------------- Load tasks from backend ----------------
  useEffect(() => {
    loadTasks(filter);
  }, [filter]);

  const loadTasks = async (statusFilter = "") => {
    try {
      const query = statusFilter ? `?status=${statusFilter}` : "";
      const data = await fetchTasks(query);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ---------------- Show alert ----------------
  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(""), 2000);
  };

  // ---------------- Handle input ----------------
  const handleChange = (e) => setNewTask(e.target.value);

  // ---------------- Add new task ----------------
  const handleAddTask = async () => {
    if (newTask.trim() === "") {
      showAlert("⚠️ Please type something before adding a task!");
      return;
    }
    try {
      await addTask({
        task: newTask,
        description: "",
        status: "Created",
      });
      setNewTask("");
      showAlert("✅ Task added successfully!");
      await loadTasks(filter); // 👈 Auto-refresh list after adding
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ---------------- Confirm Delete ----------------
  const confirmDeleteTask = (index) => {
    setConfirmDelete(index);
  };

  // ---------------- Delete Task ----------------
  const handleDeleteTask = async (index) => {
    const taskToDelete = tasks[index];
    try {
      await deleteTask(taskToDelete.id);
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      showAlert("🗑️ Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setConfirmDelete(null);
    }
  };

  // ---------------- Toggle Completion ----------------
  const handleToggle = async (index) => {
    const taskToUpdate = tasks[index];
    const newStatus =
      taskToUpdate.status === "Completed" ? "Created" : "Completed";
    try {
      const updated = await updateTask(taskToUpdate.id, {
        ...taskToUpdate,
        status: newStatus,
      });
      const updatedTasks = tasks.map((task, i) =>
        i === index ? updated : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // ---------------- Cancel Task ----------------
  const handleCancel = async (index) => {
    const taskToCancel = tasks[index];
    try {
      const updated = await updateTask(taskToCancel.id, {
        ...taskToCancel,
        status: "Cancelled",
      });
      const updatedTasks = tasks.map((t, i) => (i === index ? updated : t));
      setTasks(updatedTasks);
      showAlert("🚫 Task marked as Cancelled!");
    } catch (error) {
      console.error("Error cancelling task:", error);
    }
  };

  // ---------------- Edit Feature ----------------
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditText(tasks[index].task);
  };

  const saveEdit = async (index) => {
    if (editText.trim() === "") {
      showAlert("⚠️ Task cannot be empty!");
      return;
    }
    const taskToEdit = tasks[index];
    try {
      const updated = await updateTask(taskToEdit.id, {
        ...taskToEdit,
        task: editText,
      });
      const updatedTasks = tasks.map((task, i) =>
        i === index ? updated : task
      );
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditText("");
      showAlert("✏️ Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      showAlert("❌ Cannot edit Completed or Cancelled task!");
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  // ---------------- Summary ----------------
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl shadow-lg relative">
      {/* ------- Alert Toast ------ */}
      {alert && (
        <div
          className={`absolute top-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${
            alert ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg text-base w-max mx-auto text-center">
            {alert}
          </div>
        </div>
      )}

      {/* ------- Delete Confirmation Box ------ */}
      {confirmDelete !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-600 border-gray-200 rounded-xl shadow-lg p-6 w-80 text-center z-10">
          <p className="text-gray-800 font-medium text-lg mb-4">
            ⚠️ Are you sure you want to delete this task?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleDeleteTask(confirmDelete)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmDelete(null)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ------- Title ------ */}
      <div className="flex items-center gap-2 mb-8 mt-6">
        <img className="w-8" src={todo} alt="Todo Icon" />
        <h1 className="text-3xl font-semibold text-gray-800">To-Do List</h1>
      </div>

      {/* ------- Input Box ------ */}
      <div className="flex items-center mb-6 bg-gray-100 rounded-full shadow-inner">
        <input
          className="bg-transparent flex-1 h-14 pl-6 pr-2 outline-none text-gray-700 placeholder:text-slate-500"
          type="text"
          placeholder="Add your task"
          value={newTask}
          onChange={handleChange}
        />
        <button
          onClick={handleAddTask}
          className="bg-orange-600 hover:bg-orange-700 transition-all rounded-full w-32 h-14 text-white text-lg font-medium cursor-pointer"
        >
          Add +
        </button>
      </div>

      {/* ------- Status Filter ------ */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-700">
          🗂️ Filter Tasks:

        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-full px-5 py-2 shadow-md hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer focus:outline-none"
        >
          <option value="">All Tasks</option>
          <option value="Created">Created</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ------- Task List ------ */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-64 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-lg">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center italic">No tasks yet...</p>
        ) : (
          tasks.map((task, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-gray-700"
                  />
                  <button
                    onClick={() => saveEdit(index)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <TodoItems
                  text={task.task}
                  completed={task.status === "Completed"}
                  onToggle={() => handleToggle(index)}
                  onDelete={() => confirmDeleteTask(index)}
                  onEdit={() => startEdit(index)}
                  onCancel={() => handleCancel(index)} // 🆕 Cancel button
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* ------- Summary ------ */}
      <div className="mt-auto pt-6 border-t border-gray-200 text-center text-gray-700">
        <p className="font-semibold text-lg mb-3">
          Total: <span className="text-blue-600">{totalTasks}</span> | Completed:{" "}
          <span className="text-green-600">{completedTasks}</span> | Pending:{" "}
          <span className="text-red-500">{pendingTasks}</span>
        </p>
      </div>
    </div>
  );
};

export default Todo;

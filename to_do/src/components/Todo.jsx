// @ts-nocheck
import React, { useState, useEffect } from "react";
import todo from "../assets/todo.png";
import TodoItems from "./TodoItems";
import { fetchTasks, addTask, updateTask, deleteTask } from "../api";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
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

  // ---------------- Handle input ----------------
  const handleChange = (e) => setNewTask(e.target.value);

  // ---------------- Add new task ----------------
  const handleAddTask = async () => {
    if (newTask.trim() === "") {
      Swal.fire("⚠️ Empty Field", "Please type something before adding!", "warning");
      return;
    }
    try {
      await addTask({
        task: newTask,
        description: "",
        status: "Created",
      });
      setNewTask("");
      await loadTasks(filter);
      Swal.fire("✅ Task Added", "Your task has been added successfully!", "success");
    } catch (error) {
      console.error("Error adding task:", error);
      Swal.fire("❌ Error", "Failed to add task.", "error");
    }
  };

  // ---------------- Delete Task ----------------
  const handleDeleteTask = async (index) => {
    const taskToDelete = tasks[index];
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteTask(taskToDelete.id);
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire("Error!", "Something went wrong while deleting.", "error");
      }
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
      Swal.fire("🚫 Task Cancelled", "The task has been marked as cancelled.", "info");
    } catch (error) {
      console.error("Error cancelling task:", error);
      Swal.fire("❌ Error", "Unable to cancel the task.", "error");
    }
  };

  // ---------------- Edit Feature ----------------
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditText(tasks[index].task);
  };

  const saveEdit = async (index) => {
    if (editText.trim() === "") {
      Swal.fire("⚠️ Empty Field", "Task cannot be empty!", "warning");
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
      Swal.fire("✏️ Updated", "Task updated successfully!", "success");
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("❌ Error", "Completed or Cancelled tasks cannot be edited!", "error");
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
                  onDelete={() => handleDeleteTask(index)}
                  onEdit={() => startEdit(index)}
                  onCancel={() => handleCancel(index)}
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

// @ts-nocheck
import React, { useState, useEffect } from "react";
import todo from "../assets/todo.png";
import TodoItems from "./TodoItems";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [alert, setAlert] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // store task index for confirmation

  // ---------------- Load from localStorage ----------------
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  // ---------------- Save to localStorage ----------------
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ---------------- Show alert temporarily ----------------
  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(""), 2000);
  };

  // ---------------- Handle input ----------------
  const handleChange = (e) => setNewTask(e.target.value);

  // ---------------- Add new task ----------------
  const addTask = () => {
    if (newTask.trim() === "") {
      showAlert("⚠️ Please type something before adding a task!");
      return;
    }
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask("");
  };

  // ---------------- Ask for delete confirmation ----------------
  const confirmDeleteTask = (index) => {
    setConfirmDelete(index); // show confirmation box
  };

  // ---------------- Proceed with delete ----------------
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setConfirmDelete(null); // hide confirmation
    showAlert("🗑️ Task deleted successfully!");
  };

  // ---------------- Cancel delete ----------------
  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  // ---------------- Toggle completion ----------------
  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // ---------------- Clear Completed ----------------
  const clearCompleted = () => {
    const remainingTasks = tasks.filter((task) => !task.completed);
    setTasks(remainingTasks);
  };

  // ---------------- Summary ----------------
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-lg p-6 w-80 text-center z-10">
          <p className="text-gray-800 font-medium text-lg mb-4">
            ⚠️ Are you sure you want to delete this task?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => deleteTask(confirmDelete)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              Yes, Delete
            </button>
            <button
              onClick={cancelDelete}
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
          onClick={addTask}
          className="bg-orange-600 hover:bg-orange-700 transition-all rounded-full w-32 h-14 text-white text-lg font-medium cursor-pointer"
        >
          Add +
        </button>
      </div>

      {/* ------- Task List ------ */}
      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center italic">No tasks yet...</p>
        ) : (
          tasks.map((task, index) => (
            <TodoItems
              key={index}
              text={task.text}
              completed={task.completed}
              onToggle={() => toggleTask(index)}
              onDelete={() => confirmDeleteTask(index)} // confirmation first
            />
          ))
        )}
      </div>

      {/* ------- Summary & Clear Button ------ */}
      <div className="mt-auto pt-6 border-t border-gray-200 text-center text-gray-700">
        <p className="font-semibold text-lg mb-3">
          Total: <span className="text-blue-600">{totalTasks}</span> | Completed:{" "}
          <span className="text-green-600">{completedTasks}</span> | Pending:{" "}
          <span className="text-red-500">{pendingTasks}</span>
        </p>

        {completedTasks > 0 && (
          <button
            onClick={clearCompleted}
            className="bg-red-600 hover:bg-red-700 transition-all text-white py-2 px-6 rounded-full text-sm font-medium"
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default Todo;

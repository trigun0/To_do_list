// @ts-nocheck

import React, { useState, useEffect } from "react";
import todo from "../assets/todo.png";
import TodoItems from "./TodoItems";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // ---------------- Load from localStorage ----------------
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  // ---------------- Save to localStorage ----------------
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ---------------- Add / Delete / Toggle ----------------
  const handleChange = (e) => setNewTask(e.target.value);

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask("");
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // ---------------- Task Summary ----------------
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl shadow-lg">
      {/* ------- Title ------ */}
      <div className="flex items-center gap-2 mb-8">
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
              onDelete={() => deleteTask(index)}
            />
          ))
        )}
      </div>

      {/* ------- Task Summary ------ */}
      <div className="mt-auto pt-6 border-t border-gray-200 text-center text-gray-700">
        <p className="font-semibold text-lg">
          Total: <span className="text-blue-600">{totalTasks}</span> | Completed:{" "}
          <span className="text-green-600">{completedTasks}</span> | Pending:{" "}
          <span className="text-red-500">{pendingTasks}</span>
        </p>
      </div>
    </div>
  );
};

export default Todo;

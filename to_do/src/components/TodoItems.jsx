import React from "react";
import tick from "../assets/tick.png";
import not_tick from "../assets/not_tic.png"; // or not_tick.png
import deleteIcon from "../assets/download.png";

const TodoItems = ({ text, completed, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3 my-2 shadow-sm">
      {/* Left side: tick + task name */}
      <div className="flex items-center gap-3">
        <img
          src={completed ? tick : not_tick}
          alt={completed ? "Done" : "Not done"}
          className="w-6 h-6 cursor-pointer"
          onClick={onToggle}
        />
        <p
          className={`font-medium text-gray-700 ${
            completed ? "line-through text-gray-400" : ""
          }`}
        >
          {text}
        </p>
      </div>

      {/* Delete button */}
      <img
        src={deleteIcon}
        alt="Delete"
        onClick={onDelete}
        className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition"
      />
    </div>
  );
};

export default TodoItems;

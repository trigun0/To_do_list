import React from "react";
import tick from "../assets/tick.png";
import not_tick from "../assets/not_tic.png";
import deleteIcon from "../assets/download.png";
import editIcon from "../assets/edit.png";
import cancelIcon from "../assets/cancel.png"; // 🆕 Add cancel icon

const TodoItems = ({ text, completed, onToggle, onDelete, onEdit, onCancel }) => {
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

      {/* Right side: edit, cancel, delete */}
      <div className="flex items-center gap-3">
        <img
          src={editIcon}
          alt="Edit"
          onClick={onEdit}
          className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition"
        />
        <img
          src={cancelIcon}
          alt="Cancel"
          onClick={onCancel}
          className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition"
        />
        <img
          src={deleteIcon}
          alt="Delete"
          onClick={onDelete}
          className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition"
        />
      </div>
    </div>
  );
};

export default TodoItems;

import React, { useState } from "react";
import { TodoType } from "../types";
import { mutate } from "swr";

type TodoProps = {
  todo: TodoType;
};

const Todo = ({ todo }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // titleに何も入力されていなければ処理を行わない
      if (!editedTitle) return;
      const response = await fetch(
        `http://localhost:8080/editTodo/${todo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editedTitle,
          }),
        }
      );
      if (response.ok) {
        const newEdit = await response.json();
        mutate([editedTitle, newEdit]);
      }
    }
  };
  return (
    <div>
      <li className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="todo1"
              name="todo1"
              type="checkbox"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  className="border rounded py-1 px-2"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <span className="text-lg font-medium mr-2"> {todo.title} </span>
              )}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="cursor duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded">
              ✖
            </button>
          </div>
        </div>
      </li>
    </div>
  );
};

export default Todo;

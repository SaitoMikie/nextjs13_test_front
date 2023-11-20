import React, { useState } from "react";
import { TodoType } from "../types";
import { useTodos } from "../hooks/useTodos";
import { API_URL } from "@/constans/url";

type TodoProps = {
  todo: TodoType;
};

const Todo = ({ todo }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [BeforeEditingTitle, setBeforeEditingTitle] = useState("");
  const [editedDetails, setEditedDetails] = useState(todo.details);
  const { todos, isLoading, error, mutate } = useTodos();

  const handleEdit = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // titleに何も入力されていなければ処理を行わない
      if (!editedTitle) {
        setEditedTitle(BeforeEditingTitle);
        return;
      }
      const response = await fetch(`${API_URL}/editTodo/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTitle,
          details: editedDetails,
        }),
      });
      if (response.ok) {
        const newEdit = await response.json();
        const updatedTodos = todos.map((todo: TodoType) =>
          todo.id === newEdit.id ? newEdit : todo
        );
        mutate(updatedTodos);
      }
    } else {
      setBeforeEditingTitle(editedTitle);
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`${API_URL}/deleteTodo/${todo.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const deletedTodo = await response.json();
      const updatedTodos = todos.filter((todo: TodoType) => todo.id !== id);
      mutate(updatedTodos);
    }
  };

  const toggletodoCompletion = async (id: number, isCompleted: boolean) => {
    const response = await fetch(`${API_URL}/editTodo/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isCompleted: !isCompleted,
      }),
    });
    if (response.ok) {
      const newEdit = await response.json();
      const updatedTodos = todos.map((todo: TodoType) =>
        todo.id === newEdit.id ? newEdit : todo
      );
      mutate(updatedTodos);
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
              onChange={() => toggletodoCompletion(todo.id, todo.isCompleted)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-gray-900">
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    className="border rounded py-1 px-2"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <textarea
                    className="border rounded py-1 px-2"
                    value={editedDetails}
                    onChange={(e) => setEditedDetails(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <span
                    className={`text-lg font-medium mr-2 ${
                      todo.isCompleted ? "line-through" : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                  <span
                    className={`text-lg font-medium mr-2 ${
                      todo.isCompleted ? "line-through" : ""
                    }`}
                  >
                    {todo.details}
                  </span>
                </div>
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
            <button
              onClick={() => handleDelete(todo.id)}
              className="cursor bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded"
            >
              ✖
            </button>
          </div>
        </div>
      </li>
    </div>
  );
};

export default Todo;

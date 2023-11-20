"use client";
import React from "react";
import Todo from "./components/Todo";
import { TodoType } from "./types";
import { useRef } from "react";
import { useTodos } from "./hooks/useTodos";
import { API_URL } from "@/constans/url";

export default function Home() {
  const inputTitle = useRef<HTMLInputElement | null>(null);
  const inputDetail = useRef<HTMLTextAreaElement | null>(null);
  const { todos, isLoading, error, mutate } = useTodos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // titleに何も入力されていなければ処理を行わない
    if (!inputTitle.current?.value) return;

    const response = await fetch(`${API_URL}/createTodo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: inputTitle.current?.value,
        details: inputDetail.current?.value,
        isCompleted: false,
      }),
    });

    if (response.ok) {
      const newTodo = await response.json();
      mutate([...todos, newTodo]);
      if (inputTitle.current?.value) {
        inputTitle.current.value = "";
      }
      if (inputDetail.current?.value) {
        inputDetail.current.value = "";
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-32 py-4 px-4">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">
          To-Do List
        </h1>
      </div>
      <form
        className="w-full max-w-sm mx-auto px-4 py-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-center">
          <div>
            <input
              className="border-b-2 border-teal-500 appearance-none bg-transparent w-full text-gray-700 mr-3 pt-6 pb-5 leading-tight focus:outline-none"
              type="text"
              placeholder="Add a task title"
              ref={inputTitle}
            />
            <textarea
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 pt-5 pb-6 leading-tight focus:outline-none"
              placeholder="Add a task details"
              ref={inputDetail}
            />
          </div>
          <div className="pb-5">
            <button
              className="duration-150 w-80 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
            >
              Add
            </button>
          </div>
        </div>
      </form>
      <ul className="divide-y divide-gray-200 px-4">
        {todos?.map((todo: TodoType) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

"use client";
import { useState } from "react";
import { APP_URL } from "./constant";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: number;
}

export default function TodoListClient({ todos: initialTodos }: { todos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch todos
  const fetchTodos = async () => {
    setLoading(true);
    const res = await fetch(`${APP_URL}/api/todos`);
    const { data } = await res.json();
    console.log(data)
    setTodos(data.data);
    setLoading(false);
  };

  // Add todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${APP_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setTitle("");
    setDescription("");
    fetchTodos();
  };

  // Delete todo
  const handleDelete = async (id: number) => {
    await fetch(`${APP_URL}/api/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  // Start editing
  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  // Save edit
  const handleSaveEdit = async (id: number) => {
    await fetch(`${APP_URL}/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDescription, completed: todos.find(t => t.id === id)?.completed || 0 }),
    });
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    fetchTodos();
  };

  // Toggle completed
  const handleToggleCompleted = async (todo: Todo) => {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
        completed: todo.completed ? 0 : 1,
      }),
    });
    fetchTodos();
  };

  return (
    <>
      <form onSubmit={handleAddTodo} className="flex flex-col gap-2 mb-8 w-full max-w-md">
        <input
          className="border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 mt-2 hover:bg-blue-700"
        >
          Add Todo
        </button>
      </form>
      <div className="w-full">
        {loading ? (
          <div>Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-gray-500">No todos yet.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {todos && todos.map(todo => (
              <li key={todo.id} className="bg-white rounded shadow p-4 flex items-center justify-between">
                {editingId === todo.id ? (
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={todo.completed === 1}
                        onChange={() => handleToggleCompleted(todo)}
                        className="accent-green-600"
                      />
                      <input
                        className="border rounded px-2 py-1 flex-1"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                      />
                    </div>
                    <input
                      className="border rounded px-2 py-1"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed === 1}
                      onChange={() => handleToggleCompleted(todo)}
                      className="accent-green-600"
                    />
                    <div>
                      <div className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}`}>{todo.title}</div>
                      <div className="text-gray-600 text-sm">{todo.description}</div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 ml-4">
                  {editingId === todo.id ? (
                    <>
                      <button
                        className="text-green-600 hover:text-green-800 px-2"
                        onClick={() => handleSaveEdit(todo.id)}
                        title="Save"
                        type="button"
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500 hover:text-gray-700 px-2"
                        onClick={handleCancelEdit}
                        title="Cancel"
                        type="button"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-blue-500 hover:text-blue-700 px-2"
                        onClick={() => handleEdit(todo)}
                        title="Edit"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 px-2"
                        onClick={() => handleDelete(todo.id)}
                        title="Delete"
                        type="button"
                      >
                        &#10005;
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

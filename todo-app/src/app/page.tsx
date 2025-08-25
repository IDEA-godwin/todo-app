
import { APP_URL } from "./constant";
import TodoListClient from "./TodoListClient";

export default async function Home() {
  const res = await fetch(`${APP_URL}/api/todos`, { cache: "no-store" });
  const todos = res.ok ? (await res.json()).data.data : [];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Todo App</h1>
      <TodoListClient todos={todos} />
    </div>
  );
}

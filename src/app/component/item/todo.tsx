"use client";
import { useRouter } from "next/navigation";

import { TodoListType } from "@/app/page";

export default function TodoItem({ todo }: { todo: TodoListType }) {
  console.log(todo);
  const router = useRouter();

  return (
    <div className="w-full h-[50px] pl-4 flex items-center gap-4 border-2 border-slate-900 rounded-[27px]">
      <button
        className="w-8 h-8 rounded-full border-2 border-slate-900 bg-yellow-50"
        onClick={() => {
          //completeTodoItem(data.id);
        }}
      />
      <span
        className="text-slate-800 font-normal-16 cursor-pointer"
        onClick={() => {
          router.push(`/items/${todo.id}`);
        }}
      >
        {todo.name}
      </span>
    </div>
  );
}

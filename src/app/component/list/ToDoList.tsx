"use client";
import { useRouter } from "next/navigation";

import TodoItem from "../item/todo";
import { TodoListType } from "@/app/page";

interface IProps {
  todoList: TodoListType[];
  completeTodoItem: (itemId: number) => void;
}

export default function ToDoList({ todoList, completeTodoItem }: IProps) {
  const router = useRouter();

  return (
    <div className="flex deskTop:w-1/2 tablet:w-full mobile:w-full flex-col gap-4">
      <span className="w-[101px] h-9 bg-lime-300 rounded-[23px] flex items-center justify-center font-normal text-[18px] text-green-700">
        TO DO
      </span>
      {todoList.length !== 0 &&
        todoList.map((data, i) => {
          return <TodoItem key={i} todo={data} />;
        })}
    </div>
  );
}

import Image from "next/image";

import { instance } from "@/api/axios";
import Todos from "./item";

import { todo } from "@/utils/type";
import EmptyIcon from "@/icon/emptyTodo.svg";

export default async function TodoList() {
  const todoList = await instance("/items", {
    params: {
      page: 1,
      pageSize: 100,
    },
  });

  const formatTodoList = todoList.data
    .filter((todo: todo, i: number) => !todo.isCompleted)
    .slice(0, 10);

  return (
    <div className="flex deskTop:w-1/2 tablet:w-full mobile:w-full flex-col gap-4">
      <span
        style={{ fontFamily: "HS-Regular" }}
        className="w-[101px] h-9 bg-lime-300 rounded-[23px] flex items-center justify-center font-normal text-[18px] text-green-700"
      >
        TO DO
      </span>
      <div className="flex flex-col gap-4 deskTop:max-h-[400px] tablet:max-h-[400px] mobile:max-h-[400px] overflow-auto">
        <Todos todos={formatTodoList} />
      </div>
    </div>
  );
}

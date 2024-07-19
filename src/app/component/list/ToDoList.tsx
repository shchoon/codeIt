"use client";
import { useRouter } from "next/navigation";
import { useRecoilValue, useSetRecoilState } from "recoil";

import TodoItem from "../item/todoItem";
import { TodoItemsState } from "@/app/recoil/todoItems";
import { useEffect, useState } from "react";
import { instance } from "@/api/axios";
import { IsUpdatedItems } from "@/app/recoil/isUpdatedItems";

import { TodoItemsType } from "@/app/recoil/todoItems";

export default function ToDoList() {
  const router = useRouter();
  const isUpdatedItems = useRecoilValue(IsUpdatedItems);
  const setIsUpdatedItems = useSetRecoilState(IsUpdatedItems);
  /*   const test = todoItems.filter(
    (data: { isCompleted: boolean }) => !data.isCompleted
  ); */
  const [todoList, setTodoList] = useState<TodoItemsType[]>([]);

  useEffect(() => {
    instance("/items", {
      params: {
        page: 1,
        pageSize: 20,
      },
    }).then((res) => {
      const data = res.data;
      setTodoList(
        data.filter((data: { isCompleted: boolean }) => !data.isCompleted)
      );
    });
  }, []);

  useEffect(() => {
    if (isUpdatedItems.addItem || isUpdatedItems.revertToDone) {
      instance("/items", {
        params: {
          page: 1,
          pageSize: 20,
        },
      }).then((res) => {
        const data = res.data;
        setTodoList(
          data.filter((data: { isCompleted: boolean }) => !data.isCompleted)
        );
      });
      setIsUpdatedItems((prev) => ({
        ...prev,
        addItem: false,
        revertToDone: false,
      }));
    }
  }, [isUpdatedItems]);

  console.log(todoList);

  return (
    <div className="flex deskTop:w-1/2 tablet:w-full mobile:w-full flex-col gap-4">
      <span className="w-[101px] h-9 bg-lime-300 rounded-[23px] flex items-center justify-center font-normal text-[18px] text-green-700">
        TO DO
      </span>
      {todoList.length !== 0 &&
        todoList.map((data, i) => {
          return <TodoItem key={i} todo={data} type="home" />;
        })}
    </div>
  );
}

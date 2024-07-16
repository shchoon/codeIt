"use client";
import { useEffect, useState } from "react";
import { instance } from "@/api/axios";

import { TodoListType } from "@/app/page";

interface IProps {
  todoList: TodoListType[];
  completeTodoItem: (itemId: number) => void;
}

export default function ToDo({ todoList, completeTodoItem }: IProps) {
  return (
    <div className="flex deskTop:w-1/2 tablet:w-full mobile:w-full flex-col gap-4">
      <span className="w-[101px] h-9 bg-lime-300 rounded-[23px] flex items-center justify-center font-normal text-[18px] text-green-700">
        TO DO
      </span>
      {todoList.length !== 0 &&
        todoList.map((data, i) => {
          return (
            <div
              key={i}
              className="w-full h-[50px] pl-4 flex items-center gap-4 border-2 border-slate-900 rounded-[27px]"
            >
              <button
                className="w-8 h-8 rounded-full border-2 border-slate-900 bg-yellow-50"
                onClick={() => {
                  completeTodoItem(data.id);
                }}
              />
              <span className="text-slate-800 font-normal-16">{data.name}</span>
            </div>
          );
        })}
    </div>
  );
}

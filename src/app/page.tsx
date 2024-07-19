"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { instance } from "@/api/axios";
import ToDo from "./component/list/ToDoList";
import Done from "./component/list/DoneList";
import { ItemsDetailState } from "./recoil/itemsDetail";
import { TodoItemsState, TodoItemsType } from "./recoil/todoItems";
import { IsUpdatedItems } from "./recoil/isUpdatedItems";

import PlusIcon from "@/icon/plus.svg";

export default function Home() {
  const setTodoItemsState = useSetRecoilState(TodoItemsState);
  const todoItems = useRecoilValue(TodoItemsState);
  const setItemsDetailState = useSetRecoilState(ItemsDetailState);
  const [todo, setTodo] = useState<string>("");
  const setIsChangedItems = useSetRecoilState(IsUpdatedItems);

  const createTodo = () => {
    if (todo !== "") {
      instance
        .post("/items", {
          name: todo,
        })
        .then((res) => {
          setTodo("");
          /* 업데이트된 값 받아오기 */
          //getTodoList();
          setIsChangedItems((prev) => ({
            ...prev,
            addItem: true,
          }));
        });
    } else {
      alert("할 일을 입력해주세요!");
    }
  };

  return (
    <div className="w-full mt-6 flex flex-col gap-10">
      {/* 입력창 */}
      <div className="w-full h-[56px] flex gap-4">
        <input
          value={todo}
          onChange={(e) => {
            setTodo(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTodo();
            }
          }}
          placeholder="할 일을 입력해주세요"
          className="flex-1 h-full px-6 bg-slate-100 border-2 border-slate-900 rounded-3xl shadow-[4.06px_3.5px_0_0_#0F172A] placeholder:text-slate-500 placeholder:font-normal-16
        focus:outline-none"
        />
        <button
          className="relative flex items-center gap-1 justify-center deskTop:w-[168px] tablet:w-[162px] mobile:w-[56px] h-full border-2 border-slate-900 rounded-3xl shadow-[3.65px_4px_0_0_#0F172A]"
          onClick={() => {
            createTodo();
          }}
        >
          <Image src={PlusIcon} className="mobile:absolute" alt="plus" />
          <span className="font-bold-16 text-slate-900 mobile:invisible">
            추가하기
          </span>
        </button>
      </div>
      {/* 목록 리스트 */}
      <div className="w-full flex deskTop:gap-6 tablet:flex-col tablet:gap-12 mobile:flex-col mobile:gap-12">
        {/* TO DO list */}
        <ToDo />
        {/* DONE list */}
        <Done />
      </div>
    </div>
  );
}

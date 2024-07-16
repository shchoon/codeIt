"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { instance } from "@/api/axios";
import ToDo from "./component/list/ToDo";
import Done from "./component/list/Done";

import PlusIcon from "@/icon/plus.svg";

export interface TodoListType {
  isCompleted: boolean;
  name: string;
  id: number;
}

export default function Home() {
  const [todo, setTodo] = useState<string>("");
  const [todoList, setTodoList] = useState<TodoListType[]>([]);
  const [doneList, setDoneList] = useState<TodoListType[]>([]);

  const createTodo = () => {
    instance
      .post("/items", {
        name: todo,
      })
      .then((res) => {
        setTodo("");
        getTodoList();
      });
  };

  const getTodoList = () => {
    instance("/items", {
      params: {
        page: 1,
        pageSize: 10,
      },
    }).then((res) => {
      const data = res.data;
      /* 진행중인 할 일 */
      setTodoList(
        data.filter((data: { isCompleted: boolean }) => !data.isCompleted)
      );
      /* 완료된 할 일 */
      setDoneList(
        data.filter((data: { isCompleted: boolean }) => data.isCompleted)
      );
    });
  };

  const completeTodoItem = (itemId: number) => {
    instance
      .patch(`/items/${itemId}`, {
        isCompleted: true,
      })
      .then((res) => {
        instance("/items", {
          params: {
            page: 1,
            pageSize: 10,
          },
        }).then((res) => {
          const data = res.data;
          /* 진행중인 할 일 */
          setTodoList(
            data.filter((data: { isCompleted: boolean }) => !data.isCompleted)
          );
          /* 완료된 할 일 */
          setDoneList(
            data.filter((data: { isCompleted: boolean }) => data.isCompleted)
          );
        });
      });
  };

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">
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
        <ToDo todoList={todoList} completeTodoItem={completeTodoItem} />
        {/* DONE list */}
        <Done doneList={doneList} />
      </div>
    </div>
  );
}

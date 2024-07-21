"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

import { instance } from "@/api/axios";
import { IsUpdatedItems } from "@/app/recoil/isUpdatedItems";

import PlusIcon from "@/icon/plus.svg";

export default function CreateItem() {
  const [todo, setTodo] = useState<string>("");
  const isChangedDetail = useRecoilValue(IsUpdatedItems);
  const setIsChangedItems = useSetRecoilState(IsUpdatedItems);
  const [isExistTodo, setIsExistTodo] = useState<boolean>(false);

  const createTodo = () => {
    if (todo !== "") {
      instance
        .post("/items", {
          name: todo,
        })
        .then((res) => {
          setTodo("");
          /* 업데이트된 값 받아오기 */
          setIsChangedItems((prev) => ({
            ...prev,
            addItem: true,
          }));
        });
    } else {
      alert("할 일을 입력해주세요!");
    }
  };

  useEffect(() => {
    instance("/items", {
      params: {
        page: 1,
        pageSize: 1,
      },
    }).then((res) => {
      const data = res.data;

      if (data.length === 0) {
        setIsExistTodo(false);
      } else {
        setIsExistTodo(true);
      }
    });
  }, [isChangedDetail.addItem]);

  return (
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
        className={`relative flex items-center gap-1 justify-center deskTop:w-[168px] tablet:w-[162px] mobile:w-[56px] h-full ${
          isExistTodo ? "bg-slate-200" : "bg-violet-600"
        } border-2 border-slate-900 rounded-3xl shadow-[3.65px_4px_0_0_#0F172A]`}
        onClick={() => {
          createTodo();
        }}
      >
        <Image src={PlusIcon} className="mobile:absolute" alt="plus" />
        <span className=" text-slate-900 font-bold mobile:invisible">
          추가하기
        </span>
      </button>
    </div>
  );
}
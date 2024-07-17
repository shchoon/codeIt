"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { instance } from "@/api/axios";
import TodoItem from "@/app/component/item/todo";
import { TodoListType } from "@/app/page";

import ImgIcon from "@/icon/img.svg";
import PlusIcon from "@/icon/plus.svg";
import CheckIcon from "@/icon/check.svg";
import DeleteIcon from "@/icon/X.svg";

interface TodoItemType {
  isCompleted: boolean;
  imageUrl: string;
  memo: string;
  name: string;
  tenantId: string;
  id: number;
}

export default function ItemDetail({ params }: { params: { itemId: string } }) {
  const [todoItem, setTodoItem] = useState<TodoItemType>();
  const [props, setProps] = useState<TodoListType>({
    name: "",
    id: 0,
    isCompleted: false,
  });
  useEffect(() => {
    instance(`/items/${params.itemId}`).then((res) => {
      const data = res.data;
      setProps((prev) => ({
        ...prev,
        name: data.name,
        id: data.id,
        isCompleted: data.isCompleted,
      }));
      setTodoItem(data);
    });
  }, [params]);

  return (
    <div className="w-full flex flex-col gap-6 pt-6 deskTop:px-[102px]  h-screen bg-white">
      <TodoItem todo={props} />
      <div className="w-full flex tablet:flex-col mobile:flex-col gap-6">
        {/* 이미지 */}
        <div className="relative flex items-center justify-center bg-slate-50 deskTop:w-[384px] w-full h-[311px] border-2 border-dashed border-slate-300 rounded-3xl ">
          <Image src={ImgIcon} alt="image" />
          <div className="absolute bottom-2 right-2 flex items-center justify-center w-16 h-16 rounded-full bg-slate-200">
            <Image src={PlusIcon} width={24} height={24} alt="plus" />
          </div>
        </div>
        <div className="w-full h-[311px] pt-6 flex flex-col text-center rounded-3xl bg-[url('../img/memo.svg')]">
          <span className="font-extrabold-16 text-amber-800">Memo</span>
          <div className="w-full px-10 pt-20">
            <textarea
              placeholder="메모를 입력해주세요"
              className="w-full bg-inherit font-normal-16 text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="flex deskTop:justify-end justify-center gap-4">
        <button className="w-[168px] h-14 bg-slate-200 flex items-center gap-1 justify-center border-2 border-slate-900 rounded-3xl shadow-[3.65px_4px_0_0_#0F172A]">
          <Image src={CheckIcon} alt="check" />
          <span className="font-bold-16 text-slate-900">수정 완료</span>
        </button>
        <button className="w-[168px] h-14 bg-rose-500 flex items-center gap-1 justify-center border-2 border-slate-900 rounded-3xl shadow-[3.65px_4px_0_0_#0F172A]">
          <Image src={DeleteIcon} alt="check" />
          <span className="font-bold-16 text-white">삭제하기</span>
        </button>
      </div>
    </div>
  );
}

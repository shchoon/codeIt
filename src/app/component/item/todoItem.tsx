"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRecoilValue, useSetRecoilState } from "recoil";

import CheckedIcon from "@/icon/Checked.svg";
import { IsUpdatedItems } from "@/app/recoil/isUpdatedItems";
import { ItemsDetailState } from "@/app/recoil/itemsDetail";
import { instance } from "@/api/axios";

import { TodoItemsType } from "@/app/recoil/todoItems";
import { useState } from "react";

export default function TodoItem({
  todo,
  type,
}: {
  todo: TodoItemsType;
  type: string;
}) {
  const router = useRouter();
  const setIsUpdatedItem = useSetRecoilState(IsUpdatedItems);
  const itemsDetailState = useRecoilValue(ItemsDetailState);
  const setItemsDetailState = useSetRecoilState(ItemsDetailState);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  /* home에서 할 일 상태 변경 */
  const revertToDone = () => {
    instance
      .patch(`/items/${todo.id}`, {
        isCompleted: true,
      })
      .then((res) => {
        setIsUpdatedItem((prev) => ({
          ...prev,
          revertToDone: true,
        }));
      });
  };

  return (
    <div
      className={`w-full h-[50px] pl-4 flex items-center gap-4 border-2 border-slate-900 rounded-[27px] ${
        todo.isCompleted && "bg-violet-200"
      } ${itemsDetailState.isCompleted && "bg-violet-200"}`}
    >
      <button
        className={`w-8 h-8 rounded-full border-2 border-slate-900  ${
          itemsDetailState.isCompleted ? "bg-violet-100" : "bg-yellow-50"
        } `}
        onClick={() => {
          if (type === "detail") {
            setItemsDetailState((prev) => ({
              ...prev,
              isCompleted: !prev.isCompleted,
            }));
            //setIsCompleted((prev) => !prev);
          } else if (type === "home") {
            revertToDone();
          }
        }}
      >
        {todo.isCompleted && <Image src={CheckedIcon} alt="checked" />}
        {itemsDetailState.isCompleted && (
          <Image src={CheckedIcon} alt="checked" />
        )}
      </button>
      {type === "home" ? (
        <span
          className="text-slate-800 font-normal-16 cursor-pointer"
          onClick={() => {
            router.push(`/items/${todo.id}`);
          }}
        >
          {todo.name}
        </span>
      ) : (
        <input
          className="focus:outline-none bg-inherit underline"
          value={itemsDetailState.name}
          onChange={(e) => {
            setItemsDetailState((prev) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
        />
      )}
    </div>
  );
}

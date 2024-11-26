"use client";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import FormatCache from "@/app/formatCache";
import { todo } from "@/utils/type";
import { instance } from "@/api/axios";

import CheckedIcon from "@/icon/Checked.svg";

export default function Item({
  item,
  status,
}: {
  item: todo;
  status?: string;
}) {
  const router = useRouter();
  const { removeDone, updateTodo, removeTodo, updateDone } = FormatCache();

  const [isDone, setIsDone] = useState(item.isCompleted);

  const revertTodo = async (id: number) => {
    const res = await instance.patch(`/items/${id}`, {
      isCompleted: true,
    });

    return res.data;
  };

  const revertDone = async (id: number) => {
    const res = await instance.patch(`/items/${id}`, {
      isCompleted: false,
    });

    return res.data;
  };

  const todoMutation = useMutation({
    mutationFn: revertTodo,
    onSuccess: (data) => {
      removeTodo(data);
      updateDone(data);
    },
  });

  const doneMutation = useMutation({
    mutationFn: revertDone,
    onSuccess: (data) => {
      removeDone(data);
      updateTodo(data);
    },
  });

  return (
    <div
      key={item.id}
      className={`w-full py-2 pl-4 flex items-center ${
        status && "justify-center"
      } gap-4 border-2 border-slate-900 rounded-[27px] ${
        isDone ? "bg-violet-200" : "bg-white"
      }`}
    >
      <button
        type="button"
        className="w-8 h-8 rounded-full border-2 border-slate-900 bg-yellow-50"
        onClick={() => {
          if (status) {
            setIsDone((prev) => !prev);
          } else {
            item.isCompleted
              ? todoMutation.mutate(item.id)
              : doneMutation.mutate(item.id);
          }
        }}
      >
        {isDone && <Image src={CheckedIcon} alt="checkedIcon" />}
      </button>
      <span
        className={`${isDone && !status && "line-through"} cursor-pointer`}
        onClick={() => router.push(`/items/${item.id}`)}
      >
        {item.name}
      </span>
    </div>
  );
}

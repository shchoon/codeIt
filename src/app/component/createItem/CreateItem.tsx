"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { instance } from "@/api/axios";
import CreateTodo from "./serverAction";
import PlusIcon from "@/icon/plus.svg";
import FormatCache from "@/app/formatCache";

import { todo } from "@/utils/type";

export default function CreateItem() {
  const [todo, setTodo] = useState<string>("");
  const [isExistTodo, setIsExistTodo] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { updateTodo } = FormatCache();

  //   const query = useQuery({ queryKey: ['todos'], queryFn: createTodo })

  const postTodo = async () => {
    const res = await instance.post("/items", {
      name: todo,
    });

    return res.data;
  };

  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
      updateTodo(data);
      setTodo("");
    },
  });

  const onSubmit = () => {
    instance
      .post("/items", {
        name: "test",
      })
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <form
      className="w-full h-[56px] flex gap-4"
      // action={CreateTodo}
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <input
        name="name"
        value={todo}
        onChange={(e) => {
          setTodo(e.target.value);
        }}
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     mutation.mutate;
        //   }
        // }}
        placeholder="할 일을 입력해주세요"
        className="flex-1 h-full px-6 bg-slate-100 border-2 border-slate-900 rounded-3xl shadow-[4.06px_3.5px_0_0_#0F172A] placeholder:text-slate-500 placeholder:font-normal-16
        focus:outline-none"
      />
      <button
        type="submit"
        disabled={todo === ""}
        className={`relative flex items-center gap-1 justify-center deskTop:w-[168px] tablet:w-[162px] mobile:w-[56px] h-full ${
          isExistTodo ? "bg-slate-200" : "bg-violet-600"
        } border-2 border-slate-900 rounded-3xl shadow-[3.65px_4px_0_0_#0F172A]`}
        // onClick={() => {
        //   mutation.mutate();
        // }}
      >
        <Image src={PlusIcon} className="mobile:absolute" alt="plus" />
        <span className=" text-slate-900 font-bold mobile:invisible">
          추가하기
        </span>
      </button>
    </form>
  );
}

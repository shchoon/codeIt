"use client";
import { instance } from "@/api/axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Item from "../item/todoItem";

import FormatCache from "@/app/formatCache";
import { todo } from "@/utils/type";

import EmptyIcon from "@/icon/emptyTodo.svg";

export default function Todos({ todos }: { todos: todo[] }) {
  const router = useRouter();
  const { removeTodo, updateDone } = FormatCache();
  const quertClient = new QueryClient();
  const getTodoData = async () => {
    const res = await instance<todo[]>("/items", {
      params: {
        page: 1,
        pageSize: 100,
      },
    });

    console.log("success invaildate");
    return res.data.filter((data) => !data.isCompleted).slice(0, 10);
  };
  const todoData = useQuery({
    queryKey: ["todos"],
    queryFn: getTodoData,
    enabled: false,
    initialData: todos,
  });

  const checkTodo = async (id: number) => {
    const res = await instance.patch(`/items/${id}`, {
      isCompleted: true,
    });

    return res.data;
  };

  const mutation = useMutation({
    mutationFn: checkTodo,
    onSuccess: (data) => {
      removeTodo(data);
      updateDone(data);
    },
  });

  console.log("home", todoData.data);
  return (
    <>
      {todoData.data.length === 0 ? (
        <div className="w-full flex flex-col gap-6 items-center deskTop:pt-16">
          <Image src={EmptyIcon} alt="empty" />
          <div className="text-slate-400 text-center text-[16px] font-bold">
            할 일이 없어요.
            <br />
            TODO를 새롭게 추가해주세요!
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {todoData.data.map((todo, i) => {
            return <Item item={todo} />;
          })}
        </div>
      )}
    </>
  );
}

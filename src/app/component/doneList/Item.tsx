"use client";
import { instance } from "@/api/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Item from "../item/todoItem";
import { todo } from "@/utils/type";
import FormatCache from "@/app/formatCache";

import CheckedIcon from "@/icon/Checked.svg";
import EmptyIcon from "@/icon/emptyDone.svg";

export default function Dones({ dones }: { dones: todo[] }) {
  const router = useRouter();
  const { removeDone, updateTodo } = FormatCache();

  const getDoneData = async () => {
    const res = await instance<todo[]>("/items", {
      params: {
        page: 1,
        pageSize: 100,
      },
    });

    return res.data.filter((data, i) => data.isCompleted).slice(0, 10);
  };
  const doneData = useQuery({
    queryKey: ["dones"],
    queryFn: getDoneData,
    enabled: false,
    initialData: dones,
  });

  const resetDone = async (id: number) => {
    const res = await instance.patch(`/items/${id}`, {
      isCompleted: false,
    });

    return res.data;
  };

  const mutation = useMutation({
    mutationFn: resetDone,
    onSuccess: (data) => {
      removeDone(data);
      updateTodo(data);
    },
  });

  return (
    <>
      {doneData.data.length === 0 ? (
        <div className="w-full flex flex-col gap-6 items-center deskTop:pt-16">
          <Image src={EmptyIcon} alt="empty" />
          <div className="text-slate-400 text-center text-[16px] font-bold">
            아직 완료된 한 일이 없어요.
            <br />
            해야 할 일을 체크해보세요!
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {doneData.data.map((done, i) => {
            return <Item item={done} key={i} />;
          })}
        </div>
      )}
    </>
  );
}

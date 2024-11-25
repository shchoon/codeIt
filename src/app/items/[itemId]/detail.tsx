"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

import { instance } from "@/api/axios";

import { detail, todo } from "@/utils/type";

import ImgIcon from "@/icon/img.svg";
import PlusIcon from "@/icon/plus.svg";
import CheckIcon from "@/icon/check.svg";
import DeleteIcon from "@/icon/X.svg";
import EditIcon from "@/icon/edit.svg";

export default function Detail({ item }: { item: detail }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isChecked, setIsChecked] = useState(item.isCompleted);
  const [memo, setMemo] = useState(item.memo || "");
  const [img, setImg] = useState<{ preview: string; origin: null | File }>({
    preview: item.imageUrl || ImgIcon,
    origin: null,
  });

  const modifyDetail = async () => {
    let getImg = null;

    if (img.origin) {
      const updateImg = await instance.post(
        `/images/upload`,
        {
          image: img.origin,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      getImg = updateImg.data;
    }

    const updateDetail = await instance.patch(`/items/${item.id}`, {
      memo: memo,
      imageUrl: getImg.url,
    });

    alert("수정이 완료되었습니다");
  };

  const getItems = async (type: string) => {
    const res = await instance<todo[]>("/items", {
      params: {
        page: 1,
        pageSize: 100,
      },
    });

    let data;

    if (type === "todo") {
      data = res.data.filter((data) => !data.isCompleted).slice(0, 10);
    } else {
      data = res.data.filter((data) => data.isCompleted).slice(0, 10);
    }
    return data;
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await instance.delete(`/items/${item.id}`);
      if (item.isCompleted) {
        const updatedDones = await queryClient.fetchQuery(["dones"], () =>
          getItems("done")
        );
        queryClient.setQueryData(["todos"], updatedDones);
      }
      const updatedTodos = await queryClient.fetchQuery(["todos"], () =>
        getItems("todo")
      );
      queryClient.setQueryData(["todos"], updatedTodos);
    },
    onSuccess: async () => {
      router.push("/");
    },
  });

  return (
    <form
      className="w-full min-h-screen py-6 deskTop:px-[102px] tablet:px-6 mobile:px-4 flex flex-col gap-6 bg-white"
      onSubmit={(e) => {
        e.preventDefault();
        modifyDetail();
      }}
    >
      <div className="w-full flex tablet:flex-col mobile:flex-col gap-6">
        {/* 이미지 */}
        <div
          className={`relative flex items-center justify-center bg-slate-50 deskTop:w-[384px] w-full h-[311px] border-2 border-slate-300 rounded-3xl`}
        >
          <Image className="rounded-3xl" src={img.preview} alt="image" fill />

          <div
            className={`absolute bottom-2 right-2 flex items-center justify-center w-16 h-16 rounded-full cursor-pointer border-2 border-slate-900 bg-[#0F172A80] `}
          >
            <input
              type="file"
              id="addImg"
              className="w-0 h-0"
              onChange={(e) => {
                const file = e.target.files;
                if (file) {
                  setImg((prev) => ({
                    ...prev,
                    preview: URL.createObjectURL(file[0]),
                    origin: file[0],
                  }));
                }
              }}
            />
            <label
              htmlFor="addImg"
              className="w-full h-full flex items-center justify-center cursor-pointer"
            >
              <Image
                src={img.preview ? EditIcon : PlusIcon}
                width={24}
                height={24}
                alt="plus"
                className="cursor-pointer"
              />
            </label>
          </div>
        </div>
        <div className="flex-1 h-[311px] pt-6 flex flex-col text-center rounded-3xl bg-[url('../img/memo.svg')]">
          <span className=" text-amber-800 font-extrabold text-[16px]">
            Memo
          </span>
          <div className="w-full h-full px-10 pt-20">
            <textarea
              placeholder="메모를 입력해주세요"
              className="scroll w-full h-[200px] bg-inherit text-center font-normal text-[16px] text-slate-800 focus:outline-none"
              value={memo}
              onChange={(e) => {
                setMemo((prev) => e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex deskTop:justify-end justify-center gap-4">
        <button
          className={`w-[168px] h-14 flex items-center gap-1 justify-center border-2 border-slate-900 rounded-3xl shadow-[3.65px_4px_0_0_#0F172A]`}
          type="submit"
        >
          <Image src={CheckIcon} alt="check" />
          <span className="font-bold-16 text-slate-900">수정 완료</span>
        </button>
        <button
          type="button"
          className="w-[168px] h-14 bg-rose-500 flex items-center gap-1 justify-center border-2 border-slate-900 rounded-3xl shadow-[3.65px_4px_0_0_#0F172A]"
          onClick={() => {
            deleteMutation.mutate();
            // deleteItem();
          }}
        >
          <Image src={DeleteIcon} alt="check" />
          <span className="font-bold-16 text-white">삭제하기</span>
        </button>
      </div>
    </form>
  );
}

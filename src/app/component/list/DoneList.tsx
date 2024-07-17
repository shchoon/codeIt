import Image from "next/image";
import { useState, useEffect } from "react";

import { instance } from "@/api/axios";
import { TodoListType } from "@/app/page";

import CheckedIcon from "@/icon/Checked.svg";

export default function DoneList({ doneList }: { doneList: TodoListType[] }) {
  return (
    <div className="flex deskTop:w-1/2 tablet:w-full mobile:w-full flex-col gap-4">
      <span className="w-[101px] h-9 bg-green-700 rounded-[23px] flex items-center justify-center font-normal text-[18px] text-amber-300">
        Done
      </span>
      {doneList.length !== 0 &&
        doneList.map((data, i) => {
          return (
            <div
              key={i}
              className="w-full h-[50px] pl-4 flex items-center gap-4 border-2 border-slate-900 bg-violet-100 rounded-[27px]"
            >
              <Image src={CheckedIcon} alt="checked" />
              <span className="text-slate-800 font-normal-16 line-through">
                {data.name}
              </span>
            </div>
          );
        })}
    </div>
  );
}

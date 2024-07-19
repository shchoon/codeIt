"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";

import { instance } from "@/api/axios";
import TodoItem from "@/app/component/item/todoItem";
import { ItemsDetailState } from "@/app/recoil/itemsDetail";
import { TodoItemsType } from "@/app/recoil/todoItems";
import { TodoItemDetailType } from "@/app/recoil/itemsDetail";

import ImgIcon from "@/icon/img.svg";
import PlusIcon from "@/icon/plus.svg";
import CheckIcon from "@/icon/check.svg";
import DeleteIcon from "@/icon/X.svg";
import EditIcon from "@/icon/edit.svg";

interface UpdatedDetailType {
  name?: string;
  memo?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}

export default function ItemDetail({ params }: { params: { itemId: string } }) {
  const router = useRouter();
  const [props, setProps] = useState<TodoItemsType>({
    name: "",
    id: 0,
    isCompleted: false,
  });

  const itemDetails = useRecoilValue(ItemsDetailState);
  const setItemDetail = useSetRecoilState(ItemsDetailState);
  const [initialItemDetail, setInitialItemDetail] =
    useState<TodoItemDetailType>({
      name: "",
      memo: "",
      id: 0,
      isCompleted: false,
      tenantId: "",
      imageUrl: "",
    });
  const [isChangedDetail, setIsChangedDetail] = useState<boolean>(false);

  const checkStringOnlyEnglish = /^[a-zA-Z]+$/;

  const updateItem = () => {
    const updatedDetail: UpdatedDetailType = {};
    if (itemDetails.name !== initialItemDetail.name) {
      updatedDetail["name"] = itemDetails.name;
    }
    if (itemDetails.memo !== initialItemDetail.memo) {
      updatedDetail["memo"] = itemDetails.memo;
    }
    if (itemDetails.imageUrl !== initialItemDetail.imageUrl) {
      updatedDetail["imageUrl"] = itemDetails.imageUrl;
    }
    if (itemDetails.isCompleted !== initialItemDetail.isCompleted) {
      updatedDetail["isCompleted"] = itemDetails.isCompleted;
    }
    console.log(updatedDetail);
    instance
      .patch(`/items/${params.itemId}`, {
        ...updatedDetail,
      })
      .then(() => {
        /* itemDetailState 초기화 */
        setItemDetail((prev) => ({
          ...prev,
          name: "",
          isCompleted: false,
          memo: "",
          imageUrl: "",
        }));
        router.push("/");
      });
  };

  useEffect(() => {
    instance(`/items/${params.itemId}`).then((res) => {
      const data = res.data;
      setInitialItemDetail((prev) => ({
        ...prev,
        name: data.name,
        memo: data.memo === null ? "" : data.memo,
        imageUrl: data.imageUrl === null ? "" : data.imageUrl,
        isCompleted: data.isCompleted,
        tenantId: data.tenantId,
        id: data.id,
      }));
      setItemDetail((prev) => ({
        ...prev,
        name: data.name,
        memo: data.memo === null ? "" : data.memo,
        imageUrl: data.imageUrl === null ? "" : data.imageUrl,
        isCompleted: data.isCompleted,
        tenantId: data.tenantId,
        id: data.id,
      }));
      setProps((prev) => ({
        ...prev,
        name: data.name,
        id: data.id,
        isCompleted: data.isCompleted,
      }));
    });
  }, [params.itemId]);

  useEffect(() => {
    /* itemDetails, initialItemsDetail의 값이 채워진 경우에만 실행 */
    if (itemDetails.id !== 0 && initialItemDetail.id !== 0) {
      if (itemDetails.name !== initialItemDetail.name) {
        setIsChangedDetail(true);
        return;
      } else if (itemDetails.imageUrl !== initialItemDetail.imageUrl) {
        setIsChangedDetail(true);
        return;
      } else if (itemDetails.isCompleted !== initialItemDetail.isCompleted) {
        setIsChangedDetail(true);
        return;
      } else if (itemDetails.memo !== initialItemDetail.memo) {
        setIsChangedDetail(true);
        return;
      } else {
        setIsChangedDetail(false);
      }
    }
  }, [itemDetails]);

  return (
    <div className="w-full flex flex-col gap-6 pt-6 deskTop:px-[102px]  h-screen bg-white">
      <TodoItem todo={props} type="detail" />
      <div className="w-full flex tablet:flex-col mobile:flex-col gap-6">
        {/* 이미지 */}
        <div
          className={`relative flex items-center justify-center bg-slate-50 deskTop:w-[384px] w-full h-[311px] border-2 ${
            itemDetails.imageUrl === "" && "border-dashed"
          } border-slate-300 rounded-3xl`}
        >
          {itemDetails.imageUrl === "" ? (
            <Image src={ImgIcon} alt="image" />
          ) : (
            <Image
              src={itemDetails.imageUrl}
              width={0}
              height={0}
              alt="preview"
              fill
              className="rounded-3xl"
            />
          )}
          <div
            className={`absolute bottom-2 right-2 flex items-center justify-center w-16 h-16 rounded-full cursor-pointer ${
              itemDetails.imageUrl === ""
                ? "bg-slate-200"
                : "border-2 border-slate-900 bg-[#0F172A80]"
            } `}
          >
            <input
              type="file"
              id="addImg"
              className="w-0 h-0"
              onChange={(e) => {
                if (e.target.files) {
                  const imgFile = e.target.files[0];
                  console.log(e.target.files[0].name);
                  const checkFileName = checkStringOnlyEnglish.test(
                    imgFile.name.replace(".", "")
                  );
                  if (!checkFileName) {
                    alert("파일 이름은 영어로만 이루어져야합니다!");
                  } else {
                    setItemDetail((prev) => ({
                      ...prev,
                      imageUrl: URL.createObjectURL(imgFile),
                    }));
                  }
                }
              }}
            />
            <label
              htmlFor="addImg"
              className="w-full h-full flex items-center justify-center cursor-pointer"
            >
              {itemDetails.imageUrl === "" ? (
                <Image
                  src={PlusIcon}
                  width={24}
                  height={24}
                  alt="plus"
                  className="cursor-pointer"
                />
              ) : (
                <Image
                  src={EditIcon}
                  width={24}
                  height={24}
                  alt="edit"
                  className="cursor-pointer"
                />
              )}
            </label>
          </div>
        </div>
        <div className="w-full h-[311px] pt-6 flex flex-col text-center rounded-3xl bg-[url('../img/memo.svg')]">
          <span className="font-extrabold-16 text-amber-800">Memo</span>
          <div className="w-full h-full px-10 pt-20">
            <textarea
              placeholder="메모를 입력해주세요"
              className="scroll w-full h-[200px] bg-inherit font-normal-16 text-slate-800 focus:outline-none"
              value={itemDetails.memo}
              onChange={(e) => {
                setItemDetail((prev) => ({
                  ...prev,
                  memo: e.target.value,
                }));
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex deskTop:justify-end justify-center gap-4">
        <button
          className={`w-[168px] h-14 ${
            isChangedDetail ? "bg-lime-300" : "bg-slate-200"
          } flex items-center gap-1 justify-center border-2 border-slate-900 rounded-3xl shadow-[3.65px_4px_0_0_#0F172A]`}
          onClick={() => {
            updateItem();
          }}
        >
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

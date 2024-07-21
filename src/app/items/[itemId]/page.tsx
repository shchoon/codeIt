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
  const [img, setImg] = useState<File>();
  const itemDetails = useRecoilValue(ItemsDetailState);
  const setItemDetail = useSetRecoilState(ItemsDetailState);
  const [isChangedDetail, setIsChangedDetail] = useState<boolean>(false);
  const [initialItemDetail, setInitialItemDetail] =
    useState<TodoItemDetailType>({
      name: "",
      memo: "",
      id: 0,
      isCompleted: false,
      tenantId: "",
      imageUrl: "",
    });

  const checkStringOnlyEnglish = /^[a-zA-Z]+$/;

  /* 수정된 값들 객체에 담기 */
  const checkChangedDetail = () => {
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
    return updatedDetail;
  };

  const updateItem = () => {
    const updatedDetail = checkChangedDetail();

    /* 변경된 데이터에 이미지가 포함되는지 판단 */
    if (Object.keys(updatedDetail).includes("imageUrl")) {
      instance
        .post(
          `/images/upload`,
          {
            image: img,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then((res: any) => {
          console.log(res);
          const image: string = res.data.url;
          updatedDetail.imageUrl = image;
          instance
            .patch(`/items/${params.itemId}`, {
              ...updatedDetail,
            })
            .then(() => {
              router.push("/");
            });
        });
    } else {
      instance
        .patch(`/items/${params.itemId}`, {
          ...updatedDetail,
        })
        .then(() => {
          router.push("/");
        });
    }
  };

  const deleteItem = () => {
    instance.delete(`/items/${params.itemId}`).then(() => {
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

    /* 페이지 아웃 시 itemsDetail 초기화 */
    return () => {
      setItemDetail((prev) => ({
        ...prev,
        name: "",
        memo: "",
        id: 0,
        isCompleted: false,
        tenantId: "",
        imageUrl: "",
      }));
    };
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
    <div className="w-full flex flex-col gap-6 deskTop:px-[102px]  h-screen bg-white">
      <TodoItem type="detail" />
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
              fill
              alt="preview"
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
                  console.log(e.target.files[0]);
                  setImg(imgFile);
                  const maxSize = 5 * 1024 * 1024;
                  const checkFileName = checkStringOnlyEnglish.test(
                    imgFile.name.replace(".", "")
                  );
                  /* 파일 이름 제한 */
                  if (!checkFileName) {
                    alert("파일 이름은 영어로만 이루어져야합니다.");
                  } else if (imgFile.size > maxSize) {
                    /* 파일 크기 제한 */
                    alert("파일 크기는 최대 5MB입니다.");
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
        <div className="flex-1 h-[311px] pt-6 flex flex-col text-center rounded-3xl bg-[url('../img/memo.svg')]">
          <span className=" text-amber-800 font-extrabold text-[16px]">
            Memo
          </span>
          <div className="w-full h-full px-10 pt-20">
            <textarea
              placeholder="메모를 입력해주세요"
              className="scroll w-full h-[200px] bg-inherit text-center font-normal text-[16px] text-slate-800 focus:outline-none"
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
            if (isChangedDetail) {
              updateItem();
            } else {
              return;
            }
          }}
        >
          <Image src={CheckIcon} alt="check" />
          <span className="font-bold-16 text-slate-900">수정 완료</span>
        </button>
        <button
          className="w-[168px] h-14 bg-rose-500 flex items-center gap-1 justify-center border-2 border-slate-900 rounded-3xl shadow-[3.65px_4px_0_0_#0F172A]"
          onClick={deleteItem}
        >
          <Image src={DeleteIcon} alt="check" />
          <span className="font-bold-16 text-white">삭제하기</span>
        </button>
      </div>
    </div>
  );
}

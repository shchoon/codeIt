"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import TodoItem from "../item/todoItem";
import { instance } from "@/api/axios";
import { TodoItemsType } from "@/app/recoil/todoItems";
import { IsUpdatedItems } from "@/app/recoil/isUpdatedItems";

import EmptyIcon from "@/icon/emptyDone.svg";

/* 완료된 할 일 목록 */
export default function DoneList() {
  const loading = useRef<HTMLDivElement>(null);
  const scrollTarget = useRef<HTMLDivElement>(null);
  const isUpdatedItems = useRecoilValue(IsUpdatedItems);
  const setIsUpdatedItems = useSetRecoilState(IsUpdatedItems);

  const [allDoneList, setAllDoneList] = useState<TodoItemsType[]>([]);
  const [firstRender, setFirstRender] = useState<boolean>(false);
  const [doneList, setDoneList] = useState<TodoItemsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState({
    page: 0,
    hasNextPage: true,
  });

  const getDoneData = (page: number, hasScroll: boolean) => {
    instance("/items", {
      params: {
        page: 1,
        pageSize: 1000,
      },
    }).then((res) => {
      if (res.data.length === 0) {
        setIsLoading(false);
        return;
      }
      const dones = res.data.filter(
        (data: { isCompleted: boolean }) => data.isCompleted
      );

      setAllDoneList(dones);
      setDoneList(dones.slice(0, 10));

      setPageData((prev) => ({
        ...prev,
        page: prev.page + 1,
        hasNextPage: dones.length < 10 ? false : true,
      }));
      if (hasScroll) {
        setIsLoading(false);
      }
    });
  };

  /* 첫 렌더링 & doneList update */
  useEffect(() => {
    /* 첫 렌더링 */
    getDoneData(pageData.page, false);
    setFirstRender(true);

    /* doneList update */
    if (isUpdatedItems.revertToDone) {
      getDoneData(pageData.page, false);

      setIsUpdatedItems((prev) => ({
        ...prev,
        revertToDone: false,
      }));

      setPageData((prev) => ({
        ...prev,
        page: 0,
      }));

      scrollTarget.current?.scrollTo(0, 0);
    }
  }, [isUpdatedItems.revertToDone]);

  /*  무한 스크롤 */
  useEffect(() => {
    if (firstRender) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      const callback = (entry: any) => {
        if (entry[0].isIntersecting) {
          setIsLoading(true);
          setTimeout(() => {
            setDoneList(allDoneList.slice(0, 10 * pageData.page));
            setPageData((prev) => ({
              ...prev,
              page: prev.page + 1,
              hasNextPage:
                allDoneList.slice(pageData.page * 10, (pageData.page + 1) * 10)
                  .length !== 0
                  ? true
                  : false,
            }));
          }, 1000);
        }
      };

      const observer = new IntersectionObserver(callback, options);

      if (loading.current) {
        observer.observe(loading.current);
      }

      /* observer 함수 실행 중지  */
      return () => {
        if (observer && loading.current) {
          observer.unobserve(loading.current);
        }
      };
    }
  }, [pageData]);

  return (
    <div className="flex pb-10 deskTop:w-1/2 tablet:w-full mobile:w-full flex-col gap-4">
      <span
        style={{ fontFamily: "HS-Regular" }}
        className="w-[101px] h-9 bg-green-700 rounded-[23px] flex items-center justify-center font-normal text-[18px] text-amber-300"
      >
        Done
      </span>
      <div
        ref={scrollTarget}
        className="flex flex-col gap-4 deskTop:max-h-[400px] tablet:max-h-[350px] mobile:max-h-[350px] overflow-auto"
      >
        {firstRender && doneList.length === 0 && (
          <div className="w-full flex flex-col gap-6 items-center deskTop:pt-16">
            <Image src={EmptyIcon} alt="empty" />
            <div className="text-slate-400 text-center text-[16px] font-bold">
              아직 다 한 일이 없어요.
              <br />
              해야 할 일을 체크해보세요!
            </div>
          </div>
        )}
        {doneList.length !== 0 &&
          doneList.map((data, i) => {
            return <TodoItem key={i} todo={data} type="done" />;
          })}
        {pageData.hasNextPage && !isLoading && <div ref={loading}></div>}
        {isLoading && (
          <div className="w-full h-10 flex justify-center items-center">
            <svg
              className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            ></svg>
          </div>
        )}
      </div>
    </div>
  );
}

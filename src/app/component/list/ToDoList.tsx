"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useState, useRef } from "react";

import TodoItem from "../item/todoItem";
import { instance } from "@/api/axios";
import { IsUpdatedItems } from "@/app/recoil/isUpdatedItems";
import { TodoItemsType } from "@/app/recoil/todoItems";

import EmptyIcon from "@/icon/emptyTodo.svg";

export default function ToDoList() {
  const router = useRouter();
  const loading = useRef<HTMLDivElement>(null);
  const scrollTarget = useRef<HTMLDivElement>(null);
  const isUpdatedItems = useRecoilValue(IsUpdatedItems);
  const setIsUpdatedItems = useSetRecoilState(IsUpdatedItems);

  const [todoList, setTodoList] = useState<TodoItemsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageData, setPageData] = useState({
    page: 1,
    hasNextPage: true,
  });

  const getTodoData = (page: number, hasScroll: boolean) => {
    instance("/items", {
      params: {
        page: hasScroll ? page : 1,
        pageSize: 10,
      },
    }).then((res) => {
      if (res.data.length === 0) {
        setIsLoading(false);
        return;
      }
      const todos = res.data.filter(
        (data: { isCompleted: boolean }) => !data.isCompleted
      );
      if (hasScroll) {
        setTodoList((prev) => [...prev, ...todos]);
      } else {
        setTodoList((prev) => [...todos]);
      }

      setPageData((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
      if (hasScroll) {
        setIsLoading(false);
      }
    });
  };

  /* 첫 렌더링 & todoList update */
  useEffect(() => {
    getTodoData(pageData.page, false);

    if (pageData.page !== 1) {
      setPageData((prev) => ({
        ...prev,
        page: 1,
        hasNextPage: true,
      }));
      setIsUpdatedItems((prev) => ({
        ...prev,
        addItem: false,
        revertToDone: false,
      }));

      scrollTarget.current?.scrollTo(0, 0);
    }
  }, [isUpdatedItems]);

  /* 무한 스크롤 */
  useEffect(() => {
    if (pageData.page !== 1) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      const callback = (entry: any) => {
        if (entry[0].isIntersecting) {
          setIsLoading(true);
          setTimeout(() => {
            getTodoData(pageData.page, true);
            console.log("page", pageData.page);
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
  }, [pageData.page]);

  console.log(scrollTarget.current?.scrollTop);

  return (
    <div className="flex deskTop:w-1/2 tablet:w-full mobile:w-full flex-col gap-4">
      <span
        style={{ fontFamily: "HS-Regular" }}
        className="w-[101px] h-9 bg-lime-300 rounded-[23px] flex items-center justify-center font-normal text-[18px] text-green-700"
      >
        TO DO
      </span>
      <div
        ref={scrollTarget}
        className="flex flex-col gap-4 deskTop:max-h-[400px] tablet:max-h-[350px] mobile:max-h-[350px] overflow-auto"
      >
        {pageData.page !== 1 && todoList.length === 0 && (
          <div className="w-full flex flex-col gap-6 items-center deskTop:pt-16">
            <Image src={EmptyIcon} alt="empty" />
            <div className="text-slate-400 text-center text-[16px] font-bold">
              할 일이 없어요.
              <br />
              TODO를 새롭게 추가해주세요!
            </div>
          </div>
        )}
        {todoList.length !== 0 &&
          todoList.map((data, i) => {
            return <TodoItem key={i} todo={data} type="todo" />;
          })}
        {todoList.length !== 0 && !isLoading && <div ref={loading}></div>}
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
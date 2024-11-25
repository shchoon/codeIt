import { instance } from "@/api/axios";

import { todo } from "@/utils/type";

export default function mutation() {
  const deleteItem = async (id: number) => {
    const res = await instance.delete(`/items/${id}`);
    return res.data;
  };

  const getTodoItems = async (type: string) => {
    const res = await instance<todo[]>("/items", {
      params: {
        page: 1,
        pageSize: 100,
      },
    });

    if (type === "todo") {
      return res.data.filter((data) => !data.isCompleted).slice(0, 10);
    } else {
      return res.data.filter((data) => data.isCompleted).slice(0, 10);
    }
  };

  return { deleteItem, getTodoItems };
}

export async function GetTodoItems(type: string) {
  const res = await instance<todo[]>("/items", {
    params: {
      page: 1,
      pageSize: 100,
    },
  });

  let items;

  if (type === "todo") {
    items = res.data.filter((data) => !data.isCompleted).slice(0, 10);
  } else {
    items = res.data.filter((data) => data.isCompleted).slice(0, 10);
  }

  return items;
}

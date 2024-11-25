import { useQueryClient } from "@tanstack/react-query";

import { todo } from "@/utils/type";

export default function FormatCache() {
  const queryClient = useQueryClient();

  const updateTodo = (data: todo) => {
    queryClient.setQueryData(["todos"], (oldData: todo[] | undefined) => {
      if (oldData) {
        return [
          ...oldData,
          {
            name: data.name,
            isCompleted: data.isCompleted,
            id: data.id,
          },
        ];
      } else {
        return [
          {
            name: data.name,
            isCompleted: data.isCompleted,
            id: data.id,
          },
        ];
      }
    });
  };

  const removeTodo = (data: todo) => {
    queryClient.setQueryData(["todos"], (oldData: todo[] | undefined) => {
      if (oldData) {
        return oldData.filter((item) => data.id !== item.id);
      }
    });
  };

  const updateDone = (data: todo) => {
    queryClient.setQueryData(["dones"], (oldData: todo[] | undefined) => {
      if (oldData) {
        return [
          ...oldData,
          {
            name: data.name,
            isCompleted: data.isCompleted,
            id: data.id,
          },
        ];
      } else {
        return [
          {
            name: data.name,
            isCompleted: data.isCompleted,
            id: data.id,
          },
        ];
      }
    });
  };

  const removeDone = (data: todo) => {
    queryClient.setQueryData(["dones"], (oldData: todo[] | undefined) => {
      if (oldData) {
        return oldData.filter((item) => item.id !== data.id);
      }
    });
  };

  return {
    updateTodo,
    updateDone,
    removeTodo,
    removeDone,
  };
}

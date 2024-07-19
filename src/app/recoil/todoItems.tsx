import { atom } from "recoil";

export interface TodoItemsType {
  isCompleted: boolean;
  name: string;
  id: number;
}

export const TodoItemsState = atom<TodoItemsType[]>({
  key: "todoItems",
  default: [],
});

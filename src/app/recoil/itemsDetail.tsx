import { atom } from "recoil";

export interface TodoItemDetailType {
  isCompleted: boolean;
  imageUrl: string;
  memo: string;
  name: string;
  tenantId: string;
  id: number;
}

export const ItemsDetailState = atom<TodoItemDetailType>({
  key: "itemsDetail",
  default: {
    isCompleted: false,
    imageUrl: "",
    memo: "",
    name: "",
    tenantId: "",
    id: 0,
  },
});

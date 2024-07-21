import { atom } from "recoil";

export const IsUpdatedItems = atom<{ addItem: boolean; revertToDone: boolean }>(
  {
    key: "isUpdatedItems",
    default: {
      addItem: false,
      revertToDone: false,
    },
  }
);

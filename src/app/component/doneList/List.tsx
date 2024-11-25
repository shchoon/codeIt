import { instance } from "@/api/axios";
import { todo } from "@/utils/type";
import Dones from "./Item";

export default async function DoneList() {
  const doneList = await instance("/items", {
    params: {
      page: 1,
      pageSize: 100,
    },
  });

  const formatDoneList = doneList.data
    .filter((todo: todo, i: number) => todo.isCompleted)
    .slice(0, 10);

  return (
    <>
      <div className="flex pb-10 deskTop:w-1/2 tablet:w-full mobile:w-full flex-col gap-4">
        <span
          style={{ fontFamily: "HS-Regular" }}
          className="w-[101px] h-9 bg-green-700 rounded-[23px] flex items-center justify-center font-normal text-[18px] text-amber-300"
        >
          Done
        </span>
        <div className="flex flex-col gap-4 deskTop:max-h-[400px] tablet:max-h-[350px] mobile:max-h-[350px] overflow-auto">
          <Dones dones={formatDoneList} />
        </div>
      </div>
    </>
  );
}

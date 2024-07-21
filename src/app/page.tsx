import CreateItem from "./component/createItem/CreateItem";
import ToDoList from "./component/list/ToDoList";
import DoneList from "./component/list/DoneList";

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-10">
      {/* 입력창 */}
      <CreateItem />
      {/* 목록 리스트 */}
      <div className="w-full flex deskTop:gap-6 tablet:flex-col tablet:gap-12 mobile:flex-col mobile:gap-12">
        {/* TO DO list */}
        <ToDoList />
        {/* DONE list */}
        <DoneList />
      </div>
    </div>
  );
}

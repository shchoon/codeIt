"use server";
import { instance } from "@/api/axios";

export default async function CreateTodo(formData: any) {
  console.log(formData);
  const res = await instance.post("/items", {
    name: formData.get("name"),
  });
  console.log(res);
}

import axios from "axios";

export const instance = axios.create({
  baseURL: "https://assignment-todolist-api.vercel.app/api/hoon/",
  timeout: 10000,
});

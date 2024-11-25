import axios from "axios";

export const instance = axios.create({
  baseURL: "https://assignment-todolist-api.vercel.app/api/hoon4/",
  timeout: 10000,
});

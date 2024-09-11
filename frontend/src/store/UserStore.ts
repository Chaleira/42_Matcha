import { ref } from "typecomposer";
import { IUser } from "../api/Interfaces";

export const userStore = ref<IUser>({
  email: "",
  username: "",
  isDeleted: false,
});

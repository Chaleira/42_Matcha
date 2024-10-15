import { ref } from "typecomposer";
import { IUser } from "@/api/Interfaces";

export const userStore = ref<IUser>({
  email: "",
  username: "",
  isDeleted: false,
  userLocation: {
    type: "Point",
    coordinates: [0, 0],
  },
  tags: [],
  sexualOrientation: "heterosexual",
  gender: "",
  bio: "",
  lastName: "",
  firstName: "",
  dateBirth: new Date(),
  password: "",
});

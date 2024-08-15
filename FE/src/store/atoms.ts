import { atom } from "recoil";

export const sampleAtom = atom({
  key: "sampleAtom",
  default: "",
});

export const userState = atom({
  key: "userState",
  default: {
    name: "",
    userId: "",
    gender: "",
  },
});

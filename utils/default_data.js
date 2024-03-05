import { author } from "../models/index.js";
import { enumGender } from "./enums.js";

export default async () => {
    // //! create admin account
    await author.create({
        name: "admin",
        gender: enumGender.MALE,
        email: "mohamad2129880@gmail.com",
        phoneNumber: "0945674330",
        username: "admin",
        password: "11111111",
    });
};

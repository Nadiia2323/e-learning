import { UserModel } from "@/models/Schemas";
import dbConnection from "../../../lib/dbConnection";
import { useContext } from "react";
import { UserContext } from "@/hooks/UserContext";

export default async function handler(req, res) {
  await dbConnection();
  const email = "test2@test.com";

  try {
    // const user = await UserModel.findOne({ email: email }).populate({
    //   path: "answers",
    //   populate: {
    //     path: "lessonId",
    //   },
    // });
    const user = await UserModel.findOne({ email: email }).populate({
      path: "answers",
      
    });
    
    // const user = await UserModel.findOne({ email: email })

    console.log("user populate :>> ", user);

    if (!user) {
      return res.status(404).json({ message: "user not found  " });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.log("error :>> ", error);
    res.status(400).json({ error: " error" });
  }
}

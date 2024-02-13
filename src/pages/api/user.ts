

import { UserModel } from "@/models/Schemas";
import dbConnection from "../../../lib/dbConnection";
import { useContext } from "react";
import { UserContext } from "@/hooks/UserContext";

export default async function handler(req, res) {
 
  await dbConnection();
  const email = "test2@test.com";

  try {
      const user = await UserModel.findOne({ email: email })
  .then(user => {
    console.log("User before populate:", user);
    return UserModel.populate(user, { path: 'answers', model:"answerdetail" });
  })
  .then(user => {
    console.log("User after populate:", user);
    res.status(200).json({ data: user });
  })
  .catch(error => {
    console.error("Population error:", error);
    res.status(500).json({ error: "Internal server error" });
  });



    if (!user) {
      return res.status(404).json({ message: "user not found  " });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: " error" });
  }
}

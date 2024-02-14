import { AnswerDetailModel, UserModel } from "@/models/Schemas";
import dbConnection from "../../../lib/dbConnection";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

export default async function updateProgress(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  try {
    const { userEmail, lessonId, progress, completed, answers } = req.body;

    if (!userEmail || !lessonId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await dbConnection();

    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const updatedAnswerIds = await Promise.all(answers.map(async (answerDetail) => {
      const { taskId, answerType, answerDetails } = answerDetail;
      const filter = { taskId, userId: user._id, lessonId };
      const update = { answerType, ...answerDetails };
      const options = { new: true, upsert: true };

      const detail = await AnswerDetailModel.findOneAndUpdate(filter, update, options);
      return detail._id;
    }));

    
    user.answers = [...user.answers, ...updatedAnswerIds];

   
    const lessonProgressIndex = user.lessonsProgress.findIndex(lp => lp.lessonId.equals(lessonId));
    if (lessonProgressIndex >= 0) {
      user.lessonsProgress[lessonProgressIndex].progress = progress;
      user.lessonsProgress[lessonProgressIndex].completed = completed;
    } else {
      user.lessonsProgress.push({
        lessonId,
        progress,
        completed,
        
      });
    }

    await user.save();

    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// export default async function updateProgress(req: NextApiRequest, res: NextApiResponse) {
//   //   const session = await getServerSession(req, res, authOptions);
//   //  const session = await getSession({ req });
//   //   if (!session) {
//   //     return res.status(401).json({ error: "Un" });
//   //   }

//   //   if (!session) {
   
//   //     return res.status(401).json({ message: "Unauthorized" });
//   //   }
//   // const userId = session.user.id; 
//   // console.log('userId :>> ', userId);
//   if (req.method !== "PATCH") {
//     return res.status(405).end();
//   }

//   try {
//     const { userEmail, lessonId, progress, completed, answer } = req.body;
//     console.log('body :>> ', req.body);
 

//     if (!userEmail || !lessonId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     await dbConnection();

//     const user = await UserModel.findOne({ email: userEmail });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

    
//    const answerIds = await Promise.all(answer.map(async (answer) => {
//      const { taskId, answerType, answerDetails } = answer;
//      console.log('answerDetails :>> ', answerDetails);
//   const filter = { taskId, userId: user._id, lessonId };
//   const update = { answerType, ...answerDetails };
//   const options = { new: true, upsert: true };

//   const detail = await AnswerDetailModel.findOneAndUpdate(filter, update, options);
//   return detail._id;
// }));

//     const lessonIndex = user.lessonsProgress.findIndex(lp => lp.lessonId.equals(lessonId));

//     if (lessonIndex > -1) {
//       user.lessonsProgress[lessonIndex].progress = progress;
//       user.lessonsProgress[lessonIndex].completed = completed;
//       user.lessonsProgress[lessonIndex].answers.push(...answerIds); 
//     } else {
//       user.lessonsProgress.push({ lessonId, progress, completed, answers: answerIds });
//     }

//     await user.save();
//     res.status(200).json({ message: "Progress updated successfully" });
//   } catch (error) {
//     console.error("Error updating progress:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
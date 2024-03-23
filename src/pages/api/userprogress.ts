import { AnswerDetailModel, UserModel } from "@/models/Schemas";
import dbConnection from "../../../lib/dbConnection";

// export default async function updateProgress(req, res) {
//   if (req.method !== "PATCH") {
//     return res.status(405).end();
//   }

//   try {
//     const { userEmail, lessonId, progress, completed, answers } = req.body;
//     console.log('answers.userAnswer :>> ', answers);

//     if (!userEmail || !lessonId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     await dbConnection();

    
//     const user = await UserModel.findOne({ email: userEmail });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

 
//     let updatedAnswerIds = [];


//   for (let answerDetail of answers) {
//   const { taskId, answerType, answerDetails } = answerDetail;
//   console.log('userAnswer :>> ', answerDetail);

//   const { userAnswer, isCorrect } = answerDetails || {};

//   const filter = { taskId, userId: user._id, lessonId };
//   const update = { answerType, userAnswer, isCorrect };
//   console.log('update :>> ', update);

//   const options = { new: true, upsert: true };

//   const detail = await AnswerDetailModel.findOneAndUpdate(filter, update, options);
//   updatedAnswerIds.push(detail._id); .//!WORKED ONLY FOR TEST YOURSELF
    // }
//     for (let answerDetail of answers) {
//       const { taskId, answerType, userAnswer, isCorrect } = answerDetail;  
      

//   const filter = { taskId, userId: user._id, lessonId };
//       // const update = { answerType, userAnswer, isCorrect };
//       const update = { $set: { answerType, userAnswer, isCorrect } };

//   console.log('update :>> ', update);

//       const options = { new: true, upsert: true };
//       console.log('options :>> ', options);
//       console.log(`Attempting to update answer for user ${userEmail} and task ${taskId}`);

//       const detail = await AnswerDetailModel.findOneAndUpdate(filter, update, options);
//       console.log(`Update result for ${taskId}:`, detail);
//       if (!detail) {
//   console.log(`No document found for updating with filter:`, filter);
// }

//   updatedAnswerIds.push(detail._id);
// }


    
//     user.answers = [...new Set([...user.answers, ...updatedAnswerIds.map(id => id.toString())])];


  
//     const lessonProgressIndex = user.lessonsProgress.findIndex(lp => lp.lessonId.toString() === lessonId);
//     if (lessonProgressIndex >= 0) {
//       user.lessonsProgress[lessonProgressIndex].progress = progress;
//       user.lessonsProgress[lessonProgressIndex].completed = completed;
//     } else {
//       user.lessonsProgress.push({ lessonId, progress, completed });
//     }

//     await user.save();

//     res.status(200).json({ message: "Progress updated successfully" });
//   } catch (error) {
//     console.error("Error updating progress:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }



// export default async function updateProgress(req, res) {
//   if (req.method !== "PATCH") {
//     return res.status(405).end();
//   }

//   try {
//     const { userEmail, lessonId, progress, completed, answers } = req.body;

//     if (!userEmail || !lessonId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     await dbConnection();
    
//     const user = await UserModel.findOne({ email: userEmail });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
 
//     let updatedAnswerIds = [];

//     for (let answerDetail of answers) {
//       const { taskId, answerType, userAnswer, isCorrect, answerId } = answerDetail;  
      
//       const filter = { _id: answerId, taskId, userId: user._id, lessonId };
//       console.log('filter :>> ', filter);
//       const update = { $set: { answerType, userAnswer, isCorrect } };

//       const options = { new: true, upsert: true };
//       const detail = await AnswerDetailModel.findOneAndUpdate(filter, update, options);
//       console.log('detail :>> ', detail);
//       updatedAnswerIds.push(detail._id);
//     }

//     user.answers = [...new Set([...user.answers, ...updatedAnswerIds.map(id => id.toString())])];
//     console.log('user.answers :>> ', user.answers);

//     const lessonProgressIndex = user.lessonsProgress.findIndex(lp => lp.lessonId.toString() === lessonId);
//     if (lessonProgressIndex >= 0) {
//       user.lessonsProgress[lessonProgressIndex].progress = progress;
//       user.lessonsProgress[lessonProgressIndex].completed = completed;
//     } else {
//       user.lessonsProgress.push({ lessonId, progress, completed });
//     }

//     await user.save();
//     res.status(200).json({ message: "Progress updated successfully" });
//   } catch (error) {
//     console.error("Error updating progress:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }



export default async function updateProgress(req, res) {
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

    // Инициализация пустого массива для хранения обновлённых ID ответов
    let updatedAnswerIds = new Set(user.answers.map(id => id.toString()));

    for (let answerDetail of answers) {
      const { taskId, answerType, userAnswer, isCorrect, answerId } = answerDetail;  
      
      const filter = answerId ? { _id: answerId } : { taskId, userId: user._id, lessonId };
      console.log('filter :>> ', filter);
      const update = { $set: { answerType, userAnswer, isCorrect } };

      const options = { new: true, upsert: true };
      const detail = await AnswerDetailModel.findOneAndUpdate(filter, update, options);
      console.log('detail :>> ', detail);

      // Добавляем ID в Set для обеспечения уникальности
      updatedAnswerIds.add(detail._id.toString());
    }

    // Преобразование Set обратно в массив для сохранения в документ пользователя
    user.answers = Array.from(updatedAnswerIds);

    const lessonProgressIndex = user.lessonsProgress.findIndex(lp => lp.lessonId.toString() === lessonId);
    if (lessonProgressIndex >= 0) {
      user.lessonsProgress[lessonProgressIndex].progress = progress;
      user.lessonsProgress[lessonProgressIndex].completed = completed;
    } else {
      user.lessonsProgress.push({ lessonId, progress, completed });
    }

    await user.save();
    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Internal server error", error: error.toString() });
  }
}



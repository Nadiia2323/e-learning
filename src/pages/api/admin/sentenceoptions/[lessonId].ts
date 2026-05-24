import { LessonModel } from "@/models/Lesson";
import { SentenceoptionsModel } from "@/models/Schemas";
import dbConnection from "lib/dbConnection";

export default async function addSentenceoption(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method is not allowed",
    });
  }

  try {
    await dbConnection();
    const { lessonId } = req.query;

    const { task, test } = req.body;

    const newSentenceOption = await SentenceoptionsModel.create({
      task,
      test,
    });
    await LessonModel.findByIdAndUpdate(lessonId, {
      $push: {
        readingtasks: newSentenceOption._id,
      },
    });

    return res.status(201).json(newSentenceOption);
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

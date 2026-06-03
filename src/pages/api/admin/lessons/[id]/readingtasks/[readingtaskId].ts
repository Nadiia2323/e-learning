import { LessonModel } from "@/models/Lesson";
import {
  ClozetestModel,
  ReadingtaskModel,
  SentenceoptionsModel,
} from "@/models/Schemas";
import dbConnection from "lib/dbConnection";

export default async function deleteReadingTask(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "method is not allowed" });
  }

  try {
    await dbConnection();
    const { id, readingtaskId } = req.query;
    if (!id || !readingtaskId) {
      return res.status(400).json({ message: "missing ids" });
    }
    const readingTask = await ReadingtaskModel.findById(readingtaskId);
    if (!readingTask) {
      return res.status(404).json({ message: "reading task not found" });
    }
    if (readingTask.test) {
      await ClozetestModel.findByIdAndDelete(readingTask.test);
    }
    if (readingTask.testOp) {
      await SentenceoptionsModel.findByIdAndDelete(readingTask.testOp);
    }
    await ReadingtaskModel.findByIdAndDelete(readingtaskId);
    const updatedLesson = await LessonModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          readingtasks: readingTask._id,
        },
      },
      { new: true },
    );
    if (!updatedLesson) {
      return res.status(404).json({ message: "lesson not found" });
    }

    return res.status(200).json({
      message: "Reading task deleted",
      lesson: updatedLesson,
    });
  } catch (error) {
    console.log("deleteReadingTask error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

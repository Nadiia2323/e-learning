import { LessonModel } from "@/models/Lesson";
import { ReadingtaskModel } from "@/models/Schemas";
import dbConnection from "lib/dbConnection";

export default async function createReadingTask(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  try {
    await dbConnection();

    const { id } = req.query;
    const { name, type } = req.body;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Lesson id is required" });
    }

    if (!name || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReadingTask = await ReadingtaskModel.create({
      name,
      type,
    });

    const updatedLesson = await LessonModel.findByIdAndUpdate(
      id,
      {
        $push: {
          readingtasks: newReadingTask._id,
        },
      },
      { new: true },
    );

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.status(201).json({
      message: "Reading task created",
      readingTask: newReadingTask,
      lesson: updatedLesson,
    });
  } catch (error) {
    console.log("createReadingTask error:", error);

    return res.status(500).json({ message: "Server error" });
  }
}

import { LessonModel } from "@/models/Lesson";
import dbConnection from "lib/dbConnection";

export default async function updateLesson(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "method is not allowed" });
  }

  await dbConnection();
  const { id } = req.query;

  try {
    const updatedLesson = await LessonModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.status(200).json({
      message: "Updated",
      lesson: updatedLesson,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}

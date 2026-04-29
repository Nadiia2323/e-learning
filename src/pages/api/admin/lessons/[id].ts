import { LessonModel } from "@/models/Lesson";
import dbConnection from "lib/dbConnection";

export default async function lessonByIdHandler(req, res) {
  await dbConnection();

  const { id } = req.query;

  if (req.method === "PATCH") {
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

  if (req.method === "DELETE") {
    try {
      const deletedLesson = await LessonModel.findByIdAndDelete(id);

      if (!deletedLesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      return res.status(200).json({
        message: "Deleted successfully",
        lesson: deletedLesson,
      });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

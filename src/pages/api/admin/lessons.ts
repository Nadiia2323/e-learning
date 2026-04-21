import { LessonModel } from "@/models/Lesson";
import dbConnection from "lib/dbConnection";

export default async function lessons(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "method is not allowed" });
  }
  await dbConnection();
  const lesson = {
    lyric: req.body.lyric,
    author: req.body.author,
    video: req.body.video,
  };
  try {
    const newLesson = await LessonModel.create(lesson);
    return res.status(201).json({ message: "Created", lesson: newLesson });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create  lesson" });
  }
}

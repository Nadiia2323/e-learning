import dbConnection from "lib/dbConnection";
import {
  ClozetestModel,
  ReadingtaskModel,
  SentenceoptionsModel,
} from "@/models/Schemas";

export default async function updateReadingTasks(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  try {
    await dbConnection();

    const { id } = req.query;
    const { type, name, content } = req.body;
    // console.log("cloze content:", JSON.stringify(content, null, 2));

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Reading task id is required" });
    }

    if (!type || !name || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (type === "cloze") {
      const newClozeTest = await ClozetestModel.create({
        name,
        content,
      });

      const updatedReadingTask = await ReadingtaskModel.findByIdAndUpdate(
        id,
        {
          $set: {
            test: newClozeTest._id,
          },
        },
        { new: true },
      );

      if (!updatedReadingTask) {
        return res.status(404).json({ message: "Reading task not found" });
      }

      return res.status(201).json({
        message: "Cloze test saved",
        test: newClozeTest,
        readingTask: updatedReadingTask,
      });
    }

    if (type === "options") {
      const newSentenceOptions = await SentenceoptionsModel.create({
        test: name,
        task: content,
      });

      const updatedReadingTask = await ReadingtaskModel.findByIdAndUpdate(
        id,
        {
          $set: {
            testOp: newSentenceOptions._id,
          },
        },
        { new: true },
      );

      if (!updatedReadingTask) {
        return res.status(404).json({ message: "Reading task not found" });
      }

      return res.status(201).json({
        message: "Sentence options saved",
        testOp: newSentenceOptions,
        readingTask: updatedReadingTask,
      });
    }

    return res.status(400).json({
      message: "Invalid reading task type",
    });
  } catch (error) {
    console.log("updateReadingTasks error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

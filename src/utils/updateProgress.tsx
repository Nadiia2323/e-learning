import { AnswerPayload } from "@/types";

export async function updateProgress(
  userEmail: string,
  lessonId: string,
  progress: number,
  completed: boolean,
  answers: AnswerPayload[],
) {
  const requestBody = {
    userEmail,
    lessonId,
    progress,
    completed,
    answers,
  };

  try {
    const response = await fetch("/api/userprogress", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Progress updated:", data.message);
    } else {
      console.error("Failed to update progress:", data.message);
    }
  } catch (error) {
    console.error("Error updating progress:", error);
  }
}

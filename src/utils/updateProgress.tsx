async function updateProgress(
  userEmail,
  lessonId,
  progress,
  completed,
  answers
) {
  try {
    const response = await fetch("/api/userprogress", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail,
        lessonId,
        progress,
        completed,
        answers,
      }),
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
export { updateProgress };

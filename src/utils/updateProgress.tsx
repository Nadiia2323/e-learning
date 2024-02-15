// async function updateProgress(
//   userEmail,
//   lessonId,
//   progress,
//   completed,
//   answers
// ) {
//   const formattedAnswers = answers.map((answer) => ({
//     taskId: answer.taskId,
//     answerType: answer.answerType,
//     userAnswer: answer.userAnswer,
//     isCorrect: answer.isCorrect,
//   }));

//   const correctAnswersCount = formattedAnswers.filter(
//     (answer) => answer.isCorrect
//   ).length;
//   const progress = (correctAnswersCount / formattedAnswers.length) * 100;
//   const completed = progress === 100;
//   try {
//     const response = await fetch("/api/userprogress", {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userEmail,
//         lessonId,
//         progress,
//         completed,
//         answers,
//       }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       console.log("Progress updated:", data.message);
//     } else {
//       console.error("Failed to update progress:", data.message);
//     }
//   } catch (error) {
//     console.error("Error updating progress:", error);
//   }
// }
// export { updateProgress };

async function updateProgress(
  userEmail,
  lessonId,
  progress,
  completed,
  answerDetails
) {
  const requestBody = {
    userEmail,
    lessonId,
    progress,
    completed,
    answers: answerDetails,
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

export { updateProgress };

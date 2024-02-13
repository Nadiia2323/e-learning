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
  answers
) {
  console.log("answers inside update :>> ", answers);

  //handle your answers
  const answer = answers.map((answer) => {
    console.log("Mapping answer:", answer);
    return {
      taskId: answer.taskId,
      answerType: answer.answerType,
      answerDetails: {
        userAnswer: answer.answerDetails.userAnswer,
        isCorrect: answer.answerDetails.isCorrect,
      },
    };
  });
  // console.log("answersTest :>> ", answersTest);
  // console.log("answerTest. string :>> ", JSON.stringify(answersTest));
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
        // answers: answers.map((answer) => {
        //   console.log("Mapping answer:", answer);
        //   return {
        //     taskId: answer.taskId,
        //     answerType: answer.answerType,
        //     answerDetails: {
        //       userAnswer: answer.userAnswer,
        //       isCorrect: answer.isCorrect,
        //     },
        //   };
        // }),
        answer,
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

import React, { useState } from "react";
import styles from "@/styles/TrueOrFalse.module.css";
import { useRouter } from "next/router";
import { updateProgress } from "@/utils/updateProgress";

export default function TrueOrFalse({ test }) {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId;
  console.log("lessonId :>> ", lessonId);
  const userEmail = "test2@test.com";

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    const answerDetails = test.map((question) => {
      const isCorrect = answers[question.id] === question.isTrue;
      if (isCorrect) {
        correctCount++;
      }
      return {
        taskId: question._id,
        answerType: "trueOrFalse",
        answerDetails: {
          userAnswer: answers[question.id],
          isCorrect,
        },
      };
    });

    const progress = (correctCount / test.length) * 100;
    const completed = progress === 100;
    console.log("answerDetails :>> ", answerDetails);

    await updateProgress(
      userEmail,
      lessonId,
      progress,
      completed,
      answerDetails
    );

    setFeedback(`You got ${correctCount} out of ${test.length} correct.`);
  };

  return (
    <div className={styles.container}>
      {test.map((task) => (
        <div key={task.id} className={styles.statement}>
          <p>{task.statement}</p>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={() => handleAnswerChange(task.id, true)}
            >
              True
            </button>
            <button
              className={styles.button}
              onClick={() => handleAnswerChange(task.id, false)}
            >
              False
            </button>
          </div>
        </div>
      ))}
      <button className={styles.button} onClick={handleSubmit}>
        Submit All Answers
      </button>
      {feedback && <p className={styles.feedback}>{feedback}</p>}
    </div>
  );
}

import React, { useState } from "react";
import styles from "@/styles/TrueOrFalse.module.css";

export default function TrueOrFalse({ test }) {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    test.forEach((question) => {
      if (answers[question.id] === question.isTrue) {
        correctCount++;
      }
    });

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

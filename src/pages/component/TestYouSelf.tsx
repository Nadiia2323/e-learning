import React, { useState, useEffect } from "react";
import ModalTest from "./ModalTest";
import styles from "@/styles/TestYourSelf.module.css";
import { updateProgress } from "@/utils/updateProgress";
import { useRouter } from "next/router";

const TestYourself = ({ test }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId;
  console.log("lessonId :>> ", lessonId);
  const userEmail = "test2@test.com";

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setResetKey((prevKey) => prevKey + 1);
  };
  const handleOptionChange = (questionId, optionId, isCorrect, answerText) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: { optionId, userAnswer: answerText, isCorrect },
    }));
  };

  const handleSubmit = async () => {
    const correctAnswers = Object.values(answers).filter(
      (answer) => answer.isCorrect
    );
    const resultMessage = `You got ${correctAnswers.length} out of ${test.test.length} correct.`;
    setResult(resultMessage);
    setShowModal(true);

    const progress = (correctAnswers.length / test.test.length) * 100;
    const completed = progress === 100;

    const answerDetails = Object.entries(answers).map(
      ([questionId, answer]) => ({
        taskId: questionId,
        answerType: "test yourself",
        answerDetails: {
          userAnswer: answer.userAnswer,
          isCorrect: answer.isCorrect,
        },
      })
    );
    console.log("answerDetails :>> ", answerDetails);

    await updateProgress(
      userEmail,
      lessonId,
      progress,
      completed,
      answerDetails
    );
  };

  return (
    <div className={styles.testContainer}>
      <h2>{test.name}</h2>
      {test.test.map((question) => (
        <div key={question._id}>
          <p className={styles.question}>{question.questionText}</p>
          {question.options.map((option) => (
            <div key={option._id} className={styles.option}>
              <input
                type="radio"
                name={question._id}
                value={option.optionText}
                checked={answers[question._id]?.optionId === option._id}
                onChange={(e) =>
                  handleOptionChange(
                    question._id,
                    option._id,
                    option.isCorrect,
                    option.optionText
                  )
                }
              />
              {option.optionText}
            </div>
          ))}
        </div>
      ))}
      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
      <button className={styles.resetButton} onClick={handleReset}>
        Reset
      </button>
      {showModal && (
        <ModalTest result={result} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default TestYourself;

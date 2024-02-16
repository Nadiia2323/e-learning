import React, { useState, useEffect, useContext } from "react";
import ModalTest from "./ModalTest";
import styles from "@/styles/TestYourSelf.module.css";
import { updateProgress } from "@/utils/updateProgress";
import { useRouter } from "next/router";
import { UserContext } from "@/hooks/UserContext";

const TestYourself = ({ test }) => {
  const [answers, setAnswers] = useState({});
  const [newProgress, setNewProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId;
  console.log("lessonId :>> ", lessonId);
  const userEmail = "test2@test.com";
  const { user } = useContext(UserContext);

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setNewProgress(0);
    setResetKey((prevKey) => prevKey + 1);
  };

  const handleOptionChange = (questionId, optionId, isCorrect, optionText) => {
    console.log("optionText :>> ", optionText);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: { optionId, userAnswer: optionText, isCorrect },
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
    console.log("progress :>> ", progress);
    setNewProgress(progress);
    console.log("newProgress :>> ", newProgress);
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
          {question.options.map((option) => {
            const isAnswerChecked = showModal;
            const isCorrectAnswer = answers[question._id]?.isCorrect;
            const isSelectedOption =
              answers[question._id]?.optionId === option._id;
            let optionClass = styles.option;

            if (isAnswerChecked && isSelectedOption) {
              optionClass += isCorrectAnswer
                ? ` ${styles.correctAnswer}`
                : ` ${styles.incorrectAnswer}`;
            }

            return (
              <div key={option._id} className={optionClass}>
                <input
                  type="radio"
                  name={question._id}
                  value={option.optionText}
                  checked={isSelectedOption}
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
            );
          })}
        </div>
      ))}

      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
      <button className={styles.resetButton} onClick={handleReset}>
        Reset
      </button>
      {showModal && (
        <ModalTest
          result={result}
          score={newProgress}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TestYourself;

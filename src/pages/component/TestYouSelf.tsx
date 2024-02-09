import React, { useState, useEffect } from "react";
import ModalTest from "./ModalTest";
import styles from "@/styles/TestYourSelf.module.css";

const TestYourself = ({ test }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setResetKey((prevKey) => prevKey + 1);
  };
  const handleOptionChange = (questionId, optionId, isCorrect) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: { optionId, isCorrect },
    }));
  };

  const handleSubmit = () => {
    const correctAnswers = Object.values(answers).filter(
      (answer) => answer.isCorrect
    );
    setResult(
      `You got ${correctAnswers.length} out of ${test.test.length} correct.`
    );
    setShowModal(true);
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
                onChange={() =>
                  handleOptionChange(question._id, option._id, option.isCorrect)
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

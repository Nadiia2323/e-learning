import React, { useState } from "react";

export default function TrueOrFalse({ test }) {
  console.log("test :>> ", test);
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
    <div>
      {test.map((task) => (
        <div key={task.id}>
          <p>{task.statement}</p>
          <button onClick={() => handleAnswerChange(task.id, true)}>
            True
          </button>
          <button onClick={() => handleAnswerChange(task.id, false)}>
            False
          </button>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit All Answers</button>
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

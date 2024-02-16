import React, { useState } from "react";
import styles from "@/styles/TrueOrFalse.module.css";
import { useRouter } from "next/router";
import { updateProgress } from "@/utils/updateProgress";

export default function TrueOrFalse({ test }) {
  const [answers, setAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [checked, setChecked] = useState(false); // Состояние для отслеживания, была ли нажата кнопка "Проверить"
  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId;
  const userEmail = "test2@test.com";

  // Обработка выбора ответа
  const handleAnswerChange = (questionId, answer) => {
    if (!checked) {
      // Позволяем выбирать ответы только если проверка не выполнена
      setAnswers({ ...answers, [questionId]: answer });
      setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
    }
  };
  // Проверка ответов
  const handleSubmit = async () => {
    let correctCount = 0;
    const answerDetails = test.map((question) => {
      // Используйте правильный идентификатор для доступа к ответу
      const isCorrect = answers[question._id] === question.isTrue;
      if (isCorrect) correctCount++;
      return {
        taskId: question._id,
        answerType: "trueOrFalse",
        answerDetails: { userAnswer: answers[question._id], isCorrect },
      };
    });

    const progress = (correctCount / test.length) * 100;
    const completed = progress === 100;

    await updateProgress(
      userEmail,
      lessonId,
      progress,
      completed,
      answerDetails
    );

    alert(`You got ${correctCount} out of ${test.length} correct.`);
    setChecked(true); // Пометка, что проверка выполнена
  };
  const handleReset = () => {
    setAnswers({});
    setSelectedAnswers({});
    setChecked(false);
  };

  console.log("selectedAnswers :>> ", selectedAnswers);
  console.log("test :>> ", test);

  return (
    <div className={styles.container}>
      {test.map((task) => (
        <div key={task._id} className={styles.statement}>
          {" "}
          {/* Используйте task._id как ключ */}
          <p>{task.statement}</p>
          <div className={styles.buttons}>
            <button
              className={`${styles.button} ${
                !checked && selectedAnswers[task._id] === true
                  ? styles.selected
                  : "" // Применяется до проверки
              } ${
                checked && selectedAnswers[task._id] === true // Проверяется после проверки
                  ? task.isTrue
                    ? styles.correct
                    : styles.incorrect
                  : ""
              }`}
              onClick={() => handleAnswerChange(task._id, true)}
              disabled={checked} // Отключает кнопку после проверки
            >
              True
            </button>
            <button
              className={`${styles.button} ${
                !checked && selectedAnswers[task._id] === false
                  ? styles.selected
                  : "" // Применяется до проверки
              } ${
                checked && selectedAnswers[task._id] === false // Проверяется после проверки
                  ? !task.isTrue
                    ? styles.correct
                    : styles.incorrect
                  : ""
              }`}
              onClick={() => handleAnswerChange(task._id, false)}
              disabled={checked} // Отключает кнопку после проверки
            >
              False
            </button>
          </div>
        </div>
      ))}
      <div className={styles.buttonscontainer}>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit All Answers
        </button>
        <button className={styles.submitButton} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

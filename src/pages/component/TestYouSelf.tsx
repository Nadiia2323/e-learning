import React, { useState, useEffect, useContext } from "react";
import ModalTest from "./ModalTest";
import styles from "@/styles/TestYourSelf.module.css";
import { updateProgress } from "@/utils/updateProgress";
import { useRouter } from "next/router";
import { UserContext } from "@/hooks/UserContext";

const TestYourself = ({ test }) => {
  const [answers, setAnswers] = useState({});
  const [answersData, setAnswersData] = useState({});
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
  // useEffect(() => {
  //   console.log("Loaded answers from context:", user.data.answers);
  //   if (user.data && user.data.answers) {
  //     const lessonAnswers = user.data.answers.filter(
  //       (answer) => answer.lessonId === lessonId
  //     );
  //     const formattedAnswers = {};

  //     for (let answer of lessonAnswers) {
  //       formattedAnswers[answer.taskId] = {
  //         optionId: answer.userAnswer,
  //         isCorrect: answer.isCorrect,
  //       };
  //     }

  //     setAnswersData(formattedAnswers);
  //   }
  // }, [user.data, lessonId]);
  // console.log(
  //   "answer[65cde73b2db69c2c2a84b9d6].optionId :>> ",
  //   answers["65cde73b2db69c2c2a84b9d6"].optionId
  // );

  // console.log("answers :>> ", answers);
  // console.log("user :>> ", user);
  // console.log("test :>> ", test);

  return (
    <div className={styles.testContainer}>
      <h2>{test.name}</h2>
      {/* {test.test.map((question) => (
        <div key={question._id}>
          <p className={styles.question}>{question.questionText}</p> */}

      {/* {question.options.map((option) => {
            // Вставка console.log для вывода значений
            // console.log(
            //   "Checking:",
            //   question._id,
            //   "Option ID:",
            //   answers[question._id]?.optionId,
            //   "Option Text:",
            //   option.optionText
            // );
            console.log("%c answers :>>", "color:red", answers);
            console.log("%c option :>>", "color:orange", option);
            const option2 = () => {
              for (const key in answersData) {
                // if (Object.prototype.hasOwnProperty.call(object, key)) {
                //   const element = object[key];
                // }
                console.log(" answers[key] :>> ", answersData[key]);
                answersData[key].optionId === option.optionText;

                return answersData[key];
              }
            };
            const option3 = option2();
            console.log("option3 :>> ", option3);
            console.log("%c question :>> ", "color:green", question);
            console.log(
              "%c answers[question._id] :>> ",
              "color:green",
              answers
            );
            return (
              <div key={option3?._id} className={styles.option}>
                <input
                  type="radio"
                  name={question._id}
                  value={option.optionText}
                  // checked={
                  //   answers[question._id]?.optionId === option3?.optionText
                  // }
                  onChange={(e) =>
                    handleOptionChange(
                      question._id,
                      option?.optionText,
                      option?.isCorrect
                    )
                  }
                />
                {option?.optionText}
              </div>
            );
          })}
        </div>
      ))}
      {/* {test.test.map((question) => (
        <div key={question._id}>
          <p className={styles.question}>{question.questionText}</p>
          {question.options.map((option) => (
            <div key={option._id} className={styles.option}>
              <input
                type="radio"
                name={question._id}
                value={option.optionText}
                checked={
                  answers[question._id] &&
                  answers[question._id].optionId === option.optionText
                }
                onChange={(e) =>
                  handleOptionChange(
                    question._id,
                    option.optionText,
                    option.isCorrect
                  )
                }
              />
              {option.optionText}
            </div>
          ))}
        </div>
              ))} */}

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

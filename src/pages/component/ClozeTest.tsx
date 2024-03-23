// import { shuffleArray } from "@/utils/shuffleArray";
// import React, { useContext, useEffect, useState } from "react";
// import styles from "@/styles/ClozeTest.module.css";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import { updateProgress } from "@/utils/updateProgress";
// import { UserContext } from "@/hooks/UserContext";

// const ClozeTest = ({ clozeTest }) => {
//   const [allAnswers, setAllAnswers] = useState([]);
//   const [availableAnswers, setAvailableAnswers] = useState([]);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [prevAnswers, setPrevAnswers] = useState([]);
//   const [isCheckPerformed, setIsCheckPerformed] = useState(false);
//   const { user } = useContext(UserContext);
//   console.log("userContext :>> ", user);
//   const userEmail = user.data.email;
//   console.log("clozeTest :>> ", clozeTest);

//   const router = useRouter();
//   const { songId } = router.query;
//   const lessonId = songId;

//   useEffect(() => {
//     const answers = clozeTest.content
//       .filter((item) => item.blank && item.answer)
//       .map((item) => item.answer);
//     const uniqueAnswers = [...new Set(answers)];
//     setAllAnswers(shuffleArray(uniqueAnswers));
//     setAvailableAnswers(shuffleArray(uniqueAnswers));
//   }, [clozeTest]);

//   const handleSelectChange = (index, event) => {
//     const newAnswers = [...userAnswers];
//     const prevAnswer = userAnswers[index];
//     const newAnswer = event.target.value;

//     newAnswers[index] = newAnswer;
//     setUserAnswers(newAnswers);

//     if (prevAnswer) {
//       setAvailableAnswers((prev) => [...prev, prevAnswer].sort());
//     }

//     setAvailableAnswers((prev) =>
//       prev.filter((answer) => answer !== newAnswer)
//     );

//     const newPrevAnswers = [...prevAnswers];
//     newPrevAnswers[index] = newAnswer;
//     setPrevAnswers(newPrevAnswers);
//   };

//   const checkAnswers = async () => {
//     let correctCount = 0;
//     let answers = [];

//     clozeTest.content.forEach((item, index) => {
//       const userAnswer = userAnswers[index].toLowerCase();
//       console.log("userAnswer :>> ", userAnswer);
//       console.log("item._id :>> ", item._id);

//       const isCorrect = item.blank && item.answer.toLowerCase() === userAnswer;

//       if (isCorrect) {
//         correctCount++;
//       }

//       answers.push({
//         taskId: clozeTest._id,
//         answerId: item._id,
//         answerType: "cloze-test",
//         userAnswer: userAnswer,
//         isCorrect: isCorrect,
//       });
//     });
//     console.log("answers :>> ", answers);

//     alert(
//       `You got ${correctCount} out of ${
//         clozeTest.filter((item) => item.blank).length
//       } correct.`
//     );

//     if (lessonId) {
//       const progress =
//         (correctCount / clozeTest.content.filter((item) => item.blank).length) *
//         100;
//       const completed = progress === 100;

//       try {
//         await updateProgress(userEmail, lessonId, progress, completed, answers);
//         console.log("Progress updated successfully");
//       } catch (error) {
//         console.error("Failed to update progress:", error);
//       }
//     }
//     setIsCheckPerformed(true);
//   };

//   const resetAnswers = () => {
//     setUserAnswers(clozeTest.map(() => ""));
//     setAvailableAnswers([...allAnswers]);
//     setPrevAnswers(clozeTest.map(() => ""));
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.availableanswers}>
//         {availableAnswers.map((answer, index) => (
//           <div key={index} className="answer">
//             {answer}
//           </div>
//         ))}
//       </div>
//       <div className={styles.clozetext}>
//         {clozeTest.content.map((item, index) => (
//           <span key={item._id}>
//             {item.blank ? (
//               <select
//                 className={`${styles.select} ${
//                   isCheckPerformed
//                     ? userAnswers[index].toLowerCase() ===
//                       item.answer.toLowerCase()
//                       ? styles.correct
//                       : styles.incorrect
//                     : ""
//                 }`}
//                 value={userAnswers[index]}
//                 onChange={(event) => handleSelectChange(index, event)}
//               >
//                 <option value=""></option>
//                 {[...availableAnswers, prevAnswers[index]]
//                   .filter(Boolean)
//                   .sort()
//                   .map((option, optionIndex) => (
//                     <option key={optionIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//               </select>
//             ) : (
//               item.text + " "
//             )}
//           </span>
//         ))}
//       </div>
//       <button className={styles.button} onClick={checkAnswers}>
//         Check
//       </button>
//       <button className={styles.button} onClick={resetAnswers}>
//         Reset
//       </button>
//     </div>
//   );
// };

// export default ClozeTest;
import { shuffleArray } from "@/utils/shuffleArray";
import React, { useContext, useEffect, useState } from "react";
import styles from "@/styles/ClozeTest.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { updateProgress } from "@/utils/updateProgress";
import { UserContext } from "@/hooks/UserContext";

const ClozeTest = ({ clozeTest }) => {
  const [allAnswers, setAllAnswers] = useState([]);
  const [availableAnswers, setAvailableAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [prevAnswers, setPrevAnswers] = useState([]);
  const [isCheckPerformed, setIsCheckPerformed] = useState(false);
  const { user } = useContext(UserContext);
  const userEmail = user?.data?.email || "";
  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId;
  console.log("clozeTest :>> ", clozeTest);

  useEffect(() => {
    if (clozeTest && clozeTest.content) {
      const answers = clozeTest.content
        .filter((item) => item.blank && item.answer)
        .map((item) => item.answer);
      const uniqueAnswers = [...new Set(answers)];
      setAllAnswers(shuffleArray(uniqueAnswers));
      setAvailableAnswers(shuffleArray(uniqueAnswers));
      setUserAnswers(clozeTest.content.map(() => ""));
      setPrevAnswers(clozeTest.content.map(() => ""));
    }
  }, [clozeTest]);

  const handleSelectChange = (index, event) => {
    const newAnswers = [...userAnswers];
    const prevAnswer = userAnswers[index];
    const newAnswer = event.target.value;

    newAnswers[index] = newAnswer;
    setUserAnswers(newAnswers);

    if (prevAnswer) {
      setAvailableAnswers((prev) => [...prev, prevAnswer].sort());
    }

    setAvailableAnswers((prev) =>
      prev.filter((answer) => answer !== newAnswer)
    );

    const newPrevAnswers = [...prevAnswers];
    newPrevAnswers[index] = newAnswer;
    setPrevAnswers(newPrevAnswers);
  };

  const checkAnswers = async () => {
    let correctCount = 0;
    let answers = [];

    clozeTest.content.forEach((item, index) => {
      const userAnswer = userAnswers[index]?.toLowerCase() || "";
      const isCorrect = item.blank && item.answer.toLowerCase() === userAnswer;

      if (isCorrect) {
        correctCount++;
      }

      answers.push({
        taskId: clozeTest._id,
        answerId: item._id,
        answerType: "cloze-test",
        userAnswer,
        isCorrect,
      });
      console.warn("answers :>> ", answers);
    });

    alert(
      `You got ${correctCount} out of ${
        clozeTest.content.filter((item) => item.blank).length
      } correct.`
    );

    if (lessonId && userEmail) {
      const progress =
        (correctCount / clozeTest.content.filter((item) => item.blank).length) *
        100;
      const completed = progress === 100;

      try {
        await updateProgress(userEmail, lessonId, progress, completed, answers);
        console.log("Progress updated successfully");
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    }
    setIsCheckPerformed(true);
  };

  const resetAnswers = () => {
    setUserAnswers(clozeTest.content.map(() => ""));
    setAvailableAnswers([...allAnswers]);
    setPrevAnswers(clozeTest.content.map(() => ""));
  };

  return (
    <div className={styles.container}>
      <div className={styles.availableAnswers}>
        {availableAnswers.map((answer, index) => (
          <div key={index} className="answer">
            {answer}
          </div>
        ))}
      </div>
      <div className={styles.clozetext}>
        {clozeTest.content.map((item, index) => (
          <span key={item._id}>
            {item.blank ? (
              <select
                className={`${styles.select} ${
                  isCheckPerformed &&
                  (userAnswers[index]?.toLowerCase() ===
                  item.answer.toLowerCase()
                    ? styles.correct
                    : styles.incorrect)
                }`}
                value={userAnswers[index] || ""}
                onChange={(event) => handleSelectChange(index, event)}
              >
                <option value="">Выберите ответ</option>
                {[...availableAnswers, prevAnswers[index]]
                  .filter(Boolean)
                  .sort()
                  .map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            ) : (
              item.text + " "
            )}
          </span>
        ))}
      </div>
      <button className={styles.button} onClick={checkAnswers}>
        Check
      </button>
      <button className={styles.button} onClick={resetAnswers}>
        Reset
      </button>
    </div>
  );
};

export default ClozeTest;

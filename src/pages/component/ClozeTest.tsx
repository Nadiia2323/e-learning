import { shuffleArray } from "@/utils/shuffleArray";
import React, { useEffect, useState } from "react";
import styles from "@/styles/ClozeTest.module.css";

const ClozeTest = ({ clozeTest }) => {
  const [allAnswers, setAllAnswers] = useState([]);
  const [availableAnswers, setAvailableAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState(clozeTest.map(() => ""));
  const [prevAnswers, setPrevAnswers] = useState(clozeTest.map(() => ""));

  useEffect(() => {
    const answers = clozeTest
      .filter((item) => item.blank && item.answer)
      .map((item) => item.answer);
    const uniqueAnswers = [...new Set(answers)];
    setAllAnswers(shuffleArray(uniqueAnswers));
    setAvailableAnswers(shuffleArray(uniqueAnswers));
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

  const checkAnswers = () => {
    let correctCount = 0;
    clozeTest.forEach((item, index) => {
      if (
        item.blank &&
        item.answer.toLowerCase() === userAnswers[index].toLowerCase()
      ) {
        correctCount++;
      }
    });

    alert(
      `You got ${correctCount} out of ${
        clozeTest.filter((item) => item.blank).length
      } correct.`
    );
  };
  const resetAnswers = () => {
    setUserAnswers(clozeTest.map(() => ""));
    setAvailableAnswers([...allAnswers]);
    setPrevAnswers(clozeTest.map(() => ""));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Options:</h2>
      <div className={styles.availableanswers}>
        {availableAnswers.map((answer, index) => (
          <div key={index} className="answer">
            {answer}
          </div>
        ))}
      </div>
      <div className={styles.clozetext}>
        {clozeTest.map((item, index) => (
          <span key={item._id}>
            {item.blank ? (
              <select
                className={styles.select}
                value={userAnswers[index]}
                onChange={(event) => handleSelectChange(index, event)}
              >
                <option value=""></option>\
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

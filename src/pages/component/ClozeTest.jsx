import React, { useState } from "react";

const ClozeTest = ({ clozeT }) => {
  const [userAnswers, setUserAnswers] = useState(clozeT.map(() => ""));

  const handleInputChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswers = () => {
    let correctCount = 0;

    clozeT.forEach((item, index) => {
      if (
        item.blank === "true" &&
        item.answer.toLowerCase() === userAnswers[index].toLowerCase()
      ) {
        correctCount++;
      }
    });

    alert(
      `You got ${correctCount} out of ${
        clozeT.filter((item) => item.blank === "true").length
      } correct.`
    );
  };

  return (
    <div>
      <h2>Cloze Test</h2>
      <div>
        {clozeT.map((item, index) => {
          if (item.blank === "true") {
            return (
              <input
                key={index}
                type="text"
                value={userAnswers[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="Fill in the blank"
              />
            );
          } else {
            return <span key={index}>{item.text} </span>;
          }
        })}
      </div>
      <button onClick={checkAnswers}>Check Answers</button>
    </div>
  );
};

export default ClozeTest;

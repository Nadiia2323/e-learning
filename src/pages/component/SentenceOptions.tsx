import React, { useState } from "react";

export default function SentenceOptions({ data }) {
  const { sentence, options, correctAnswers } = data[0];

  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");

  const splitOptions = options[0].includes(",")
    ? options[0].split(",").map((option) => option.trim().replace(/^"|"$/g, ""))
    : options;

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setFeedback("");
  };

  const checkAnswer = () => {
    if (correctAnswers.includes(selectedOption)) {
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect, try again.");
    }
  };

  const [firstPart, secondPart] = sentence.split("___");

  return (
    <div>
      <p>
        {firstPart}
        <select onChange={handleOptionChange} value={selectedOption}>
          <option value="">Select an option</option>
          {splitOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {secondPart}
      </p>
      <button onClick={checkAnswer}>Check</button>
      {feedback && <p>{feedback}</p>} {/* Display feedback */}
    </div>
  );
}

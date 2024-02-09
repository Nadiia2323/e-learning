import { shuffleArray } from "@/utils/shuffleArray";
import React, { useState, useEffect } from "react";

const PictureMatchGame = ({ pairs }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [matches, setMatches] = useState({});

  useEffect(() => {
    const shuffledDescriptions = shuffleArray(
      pairs.map((pair) => pair.description)
    );
    setOptions(shuffledDescriptions);
    setSelectedOptions({});
  }, [pairs]);

  const handleSelectMatch = (pictureId, description) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [pictureId]: description,
    }));
  };

  const resetGame = () => {
    setSelectedOptions({});
    setOptions(shuffleArray(pairs.map((pair) => pair.description)));
  };

  const renderOptionsAbove = () => {
    return options.map((option, index) => {
      if (!Object.values(selectedOptions).includes(option)) {
        return <div key={index}>{option}</div>;
      }
      return null;
    });
  };
  const handleSubmit = () => {
    let correct = 0;
    pairs.forEach((pair) => {
      if (matches[pair._id] === pair.description) {
        correct++;
      }
    });

    alert(
      correct === pairs.length
        ? "All matches are correct!"
        : "Some matches are incorrect."
    );
  };

  return (
    <div>
      <h2>Match the Picture with the Correct Statement</h2>
      <div>{renderOptionsAbove()}</div>
      {pairs.map((pair) => (
        <div key={pair._id} style={{ marginBottom: "20px" }}>
          <img
            src={pair.picture}
            alt=""
            style={{ width: "100px", height: "100px" }}
          />
          <select
            onChange={(e) => handleSelectMatch(pair._id, e.target.value)}
            value={selectedOptions[pair._id] || ""}
          >
            <option value="">Select a statement</option>
            {options.map((option, index) => {
              return !Object.values(selectedOptions).includes(option) ||
                selectedOptions[pair._id] === option ? (
                <option key={index} value={option}>
                  {option}
                </option>
              ) : null;
            })}
          </select>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Matches</button>
      <button onClick={resetGame}>Reset Answers</button>
    </div>
  );
};

export default PictureMatchGame;

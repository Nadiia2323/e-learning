import { shuffleArray } from "@/utils/shuffleArray";
import { updateProgress } from "@/utils/updateProgress";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const PictureMatchGame = ({ pairs }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [matches, setMatches] = useState({});
  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId;
  console.log("lessonId :>> ", lessonId);
  const userEmail = "test2@test.com";

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
  const handleSubmit = async () => {
    let correctCount = 0;
    const answers = pairs.map((pair) => {
      const isCorrect = matches[pair._id] === pair.description;
      if (isCorrect) correctCount++;
      return {
        taskId: pair._id,
        answerType: "pictureMatch",
        answerDetails: {
          userAnswer: matches[pair._id],
          isCorrect,
        },
      };
    });

    const progress = (correctCount / pairs.length) * 100;
    const completed = progress === 100;

    await updateProgress(userEmail, lessonId, progress, completed, answers);

    alert(
      correctCount === pairs.length
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

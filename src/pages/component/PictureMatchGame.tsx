import React, { useState, useEffect } from "react";
import styles from "@/styles/PictureMatch.module.css";
import { shuffleArray } from "@/utils/shuffleArray";
import { updateProgress } from "@/utils/updateProgress";
import { useRouter } from "next/router";

const PictureMatchGame = ({ pairs }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [checked, setChecked] = useState(false);

  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId;
  const userEmail = "test2@test.com";

  useEffect(() => {
    const shuffledDescriptions = shuffleArray(
      pairs.map((pair) => pair.description)
    );
    setOptions(shuffledDescriptions);
  }, [pairs]);

  const handleSelectOption = (pictureId, description) => {
    if (!checked) {
      setSelectedOptions((prev) => ({
        ...prev,
        [pictureId]: description,
      }));
    }
  };

  const resetGame = () => {
    setSelectedOptions({});
    setChecked(false);
    setOptions(shuffleArray(pairs.map((pair) => pair.description)));
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    const answers = pairs.map((pair) => {
      const isCorrect = selectedOptions[pair._id] === pair.description;
      if (isCorrect) {
        correctCount++;
      }

      return {
        taskId: pair._id,
        answerType: "pictureMatch",
        userAnswer: selectedOptions[pair._id] || "",
        isCorrect: isCorrect,
      };
    });

    const progress = (correctCount / pairs.length) * 100;
    const completed = progress === 100;

    await updateProgress(userEmail, lessonId, progress, completed, answers);

    setChecked(true);

    alert(`You have ${correctCount} correct matches out of ${pairs.length}.`);
  };

  return (
    <div className={styles.container}>
      <h2>Match Pictures to Descriptions</h2>
      {pairs.map((pair) => (
        <div key={pair._id} className={styles.pairContainer}>
          <img src={pair.picture} alt="Match" className={styles.picture} />
          <select
            className={`${styles.select} ${
              checked
                ? selectedOptions[pair._id] === pair.description
                  ? styles.correct
                  : styles.incorrect
                : ""
            }`}
            value={selectedOptions[pair._id] || ""}
            onChange={(e) => handleSelectOption(pair._id, e.target.value)}
          >
            <option value="">Select Description</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={handleSubmit} className={styles.button}>
        Check Answers
      </button>
      <button onClick={resetGame} className={styles.button}>
        Reset Game
      </button>
    </div>
  );
};

export default PictureMatchGame;

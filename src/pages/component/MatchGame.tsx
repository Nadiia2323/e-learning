import { shuffleArray } from "@/utils/shuffleArray";
import React, { useEffect, useState } from "react";
import styles from "@/styles/matchGame.module.css";
import { updateProgress } from "@/utils/updateProgress";
import { useRouter } from "next/router";

export default function MatchGame({ pairs }) {
  const [selectedWord, setSelectedWord] = useState(null);
  const [matches, setMatches] = useState({});
  const [shuffledDescriptions, setShuffledDescriptions] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const router = useRouter();
  const { songId } = router.query;
  const lessonId = songId;
  console.log("lessonId :>> ", lessonId);
  const userEmail = "test2@test.com";

  useEffect(() => {
    setShuffledDescriptions(
      shuffleArray(pairs.map((pair) => pair.description))
    );
  }, [pairs]);

  const handleWordSelection = (word) => {
    setSelectedWord(word);
  };

  const handleDescriptionSelection = (description) => {
    if (selectedWord) {
      setMatches({ ...matches, [selectedWord]: description });
      setShuffledDescriptions(
        shuffledDescriptions.filter((desc) => desc !== description)
      );
      setSelectedWord(null);
    }
  };

  const handleResetMatch = (word) => {
    const description = matches[word];
    setShuffledDescriptions([...shuffledDescriptions, description]);
    setMatches({ ...matches, [word]: null });
  };
  const resetGame = () => {
    setSelectedWord(null);
    setMatches({});
    setShowAnswers(false); // Hide answers upon reset
    setShuffledDescriptions(
      shuffleArray(pairs.map((pair) => pair.description))
    );
  };

  const matchedWords = Object.keys(matches);
  const unmatchedWords = pairs
    .map((pair) => pair.word)
    .filter((word) => !matchedWords.includes(word));

  const unmatchedDescriptions = shuffledDescriptions.filter(
    (desc) => !Object.values(matches).includes(desc)
  );
  const checkMatches = async () => {
    let correctCount = 0;
    for (const [word, description] of Object.entries(matches)) {
      if (
        pairs.some(
          (pair) => pair.word === word && pair.description === description
        )
      ) {
        console.log(`${word}: Correct`);
        correctCount++;
      } else {
        console.log(`${word}: Incorrect`);
      }
    }
    alert(
      `You have ${correctCount} correct ${
        correctCount === 1 ? "match" : "matches"
      } out of ${Object.keys(matches).length}`
    );
    await sendGameProgress(userEmail, lessonId, matches, pairs);
  };
  async function sendGameProgress(userEmail, lessonId, matches, pairs) {
    const answers = Object.keys(matches).map((word) => {
      const description = matches[word];
      const pair = pairs.find((pair) => pair.word === word);
      const isCorrect = pair.description === description;
      console.log("pair._id :>> ", pair._id);
      return {
        taskId: pair._id,
        answerType: "matchGame",
        answerDetails: {
          userAnswer: description,
          isCorrect,
        },
      };
    });

    const progress =
      (answers.filter((answer) => answer.answerDetails.isCorrect).length /
        pairs.length) *
      100;
    const completed = progress === 100;

    await updateProgress(userEmail, lessonId, progress, completed, answers);
  }

  return (
    <div className={styles.matchGameContainer}>
      <div className={styles.wordsColumn}>
        {matchedWords.map((word, index) => (
          <div key={index} className={styles.wordContainer}>
            <button className={styles.wordButton}>{word}</button>
            <div className={styles.resetButtonContainer}>
              <button
                onClick={() => handleResetMatch(word)}
                className={styles.resetButton}
              >
                ×
              </button>
            </div>
          </div>
        ))}
        {unmatchedWords.map((word, index) => (
          <div key={index} className={styles.wordContainer}>
            <button
              onClick={() => handleWordSelection(word)}
              className={styles.wordButton}
            >
              {word}
            </button>
          </div>
        ))}
      </div>
      <div className={styles.descriptionsColumn}>
        {matchedWords.map((word, index) =>
          matches[word] ? (
            <div key={index} className={styles.wordContainer}>
              <button key={index} className={styles.descriptionButton} disabled>
                {matches[word]}
              </button>
              <div className={styles.resetButtonContainer}>
                <button
                  onClick={() => handleResetMatch(word)}
                  className={styles.resetButton}
                ></button>
              </div>
            </div>
          ) : null
        )}
        {unmatchedDescriptions.map((description, index) => (
          <button
            key={index}
            onClick={() => handleDescriptionSelection(description)}
            className={styles.descriptionButton}
            disabled={Object.values(matches).includes(description)}
          >
            {description}
          </button>
        ))}

        <button onClick={checkMatches} className={styles.checkButton}>
          Check Matches
        </button>
        <button
          onClick={() => setShowAnswers(true)}
          className={styles.showAnswersButton}
        >
          Show Answers
        </button>
        <button onClick={resetGame} className={styles.resetButton}>
          Reset Game
        </button>
      </div>
    </div>
  );
}

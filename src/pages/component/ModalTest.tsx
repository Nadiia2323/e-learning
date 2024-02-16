import React from "react";
import styles from "@/styles/ModalTest.module.css";
export default function ModalTest({ result, onClose, score }) {
  let imageUrl;
  // if (score === 0) {
  //   imageUrl =
  //     "https://res.cloudinary.com/dqgvmwnpl/image/upload/v1708040103/annoyed-disappointed_wbhnx9.gif";
  // } else if (score >= 49) {
  //   imageUrl =
  //     "https://res.cloudinary.com/dqgvmwnpl/image/upload/v1708040224/big-brain_tav4qa.gif";
  // } else if (score === 100) {
  //   imageUrl =
  //     "https://res.cloudinary.com/dqgvmwnpl/image/upload/v1707490891/happy-dance_o2kc4t.gif";
  // }

  const numericScore = Number(score);
  if (numericScore === 100) {
    imageUrl =
      "https://res.cloudinary.com/dqgvmwnpl/image/upload/v1707490891/happy-dance_o2kc4t.gif";
  } else if (numericScore >= 49) {
    imageUrl =
      "https://res.cloudinary.com/dqgvmwnpl/image/upload/v1708040224/big-brain_tav4qa.gif";
  } else {
    imageUrl =
      "https://res.cloudinary.com/dqgvmwnpl/image/upload/v1708040103/annoyed-disappointed_wbhnx9.gif";
  }
  return (
    <div className={styles.container}>
      <div className={styles.picontainer}>
        <img className={styles.picture} src={imageUrl} alt="" />
      </div>

      <p className={styles.p}>{result}</p>
      <button className={styles.closeButton} onClick={onClose}>
        Close
      </button>
    </div>
  );
}

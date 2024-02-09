import React from "react";
import styles from "@/styles/ModalTest.module.css";
export default function ModalTest({ result, onClose }) {
  return (
    <div className={styles.container}>
      <div>
        <img
          className={styles.picture}
          src="https://res.cloudinary.com/dqgvmwnpl/image/upload/v1707490891/happy-dance_o2kc4t.gif"
          alt=""
        />
      </div>

      <p>{result}</p>
      <button className={styles.closeButton} onClick={onClose}>
        Close
      </button>
    </div>
  );
}

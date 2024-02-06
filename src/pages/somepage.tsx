// pages/somepage.tsx (or .jsx)
// import clientPromise from '../utils/mongodb';

import { useState } from "react";

// export async function getServerSideProps(context) {
//   const client = await clientPromise;
//   const db = client.db('e-learning'); 

  
//   const data = await db.collection('users').find({}).toArray();

//   return {
//     props: { data: JSON.parse(JSON.stringify(data)) },
//   };
// }

import styles from "@/styles/somepage.module.css"
function SomePage() {
  const data = [
    {
      "id": 1,
      "statement": "The Earth is the third planet from the Sun.",
      "isTrue": true
    },
    {
      "id": 2,
      "statement": "Light travels faster than sound.",
      "isTrue": true
    },
    {
      "id": 3,
      "statement": "The Great Wall of China is visible from space.",
      "isTrue": false
    }
  ];

  const [answers, setAnswers] = useState({}); // Object to store answers
  const [feedback, setFeedback] = useState("");

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    data.forEach(question => {
      if (answers[question.id] === question.isTrue) {
        correctCount++;
      }
    });

    setFeedback(`You got ${correctCount} out of ${data.length} correct.`);
  };

  return (
    <>
      <p>Task: True / False</p>
      <div>
        {data.map((task) => (
          <div key={task.id}>
            <p>{task.statement}</p>
            <button onClick={() => handleAnswerChange(task.id, true)}>True</button>
            <button onClick={() => handleAnswerChange(task.id, false)}>False</button>
          </div>
        ))}
        <button onClick={handleSubmit}>Submit All Answers</button>
        {feedback && <p>{feedback}</p>}
      </div>
      <p>tets yourself</p>
      <div  className={styles.container}>
      <label>
        <input type="checkbox" className={styles.playbtn} />
        <div className={styles.playicon}></div>
        <div className={styles.pauseicon}></div>
      </label>
      </div>
      <svg className={styles.svgStyle} width="25%" height="25%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <rect className={styles.buttonSides} x="5.04999" y="51" width="90.62" height="8" />
  <rect className={styles.buttonSides} width="57" height="57" rx="8" transform="matrix(0.866025 -0.5 0.866025 0.5 1 59)" />
  <g clip-path="url(#clip0_106_11)">
    <rect className={styles.buttonTop} width="57" height="57" rx="8" transform="matrix(0.866025 -0.5 0.866025 0.5 1 51)"  />
    <path className={styles.buttonSidesplaySides} d="M64.2199 42.5L55.4353 61.4282L31.4353 47.5718L64.2199 42.5Z" fill="white" />
    <g className={styles.glowAll} filter="url(#filter0_d_106_11)">
      <path d="M64.2199 42.5L55.4353 61.4282L31.4353 47.5718L64.2199 42.5Z" fill="white" />
    </g>
    <g className={styles.glowMe} opacity="0.5" filter="url(#filter1_f_106_11)">
      <path d="M73.0478 36.9032L58.6665 67.8905L19.3761 45.2062L73.0478 36.9032Z" fill="white" />
    </g>
  </g>
        <path className={ styles.glowMe} opacity="0.5" d="M64 43L32 47.8L32 8L64 8L64 43Z" fill="url(#paint0_linear_106_11)" />
  <defs>
    <filter id="filter0_d_106_11" x="23.4353" y="34.5" width="48.7846" height="34.9282" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
      <feOffset />
      <feGaussianBlur stdDeviation="4" />
      <feComposite in2="hardAlpha" operator="out" />
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_106_11" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_106_11" result="shape" />
    </filter>
    <filter id="filter1_f_106_11" x="3.37613" y="20.9032" width="85.6716" height="62.9873" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
      <feGaussianBlur stdDeviation="8" result="effect1_foregroundBlur_106_11" />
    </filter>
    <linearGradient id="paint0_linear_106_11" x1="47" y1="48" x2="47" y2="8" gradientUnits="userSpaceOnUse">
      <stop stop-color="white" />
      <stop offset="1" stop-color="white" stop-opacity="0" />
    </linearGradient>
    <clipPath id="clip0_106_11">
      <rect width="57" height="57" rx="8" transform="matrix(0.866025 -0.5 0.866025 0.5 1 51)" fill="white" />
    </clipPath>
  </defs>
      </svg>
      <div className={styles.deconstructed}>
  DECONSTRUCTED
  <div>DECONSTRUCTED</div>
  <div>DECONSTRUCTED</div>
  <div>DECONSTRUCTED</div>
  <div>DECONSTRUCTED</div>
</div>
    </>
  );
}

export default SomePage;


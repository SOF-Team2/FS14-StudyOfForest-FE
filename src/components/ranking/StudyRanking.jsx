import { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import AlertMessage from "../AlertMessage.jsx";

function StudyRanking({ onLoadComplete }) {
  const [studyRanking, setStudyRanking] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const getStudyRanking = async () => {
    try {
      const response = await axios.get("/ranking/study");
      setStudyRanking(response.data);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.message ||
        "스터디 랭킹을 불러오지 못했습니다"
      );
    } finally {
      onLoadComplete?.();
    }
  };

  const topStudyRanking = studyRanking.filter(
    (study) => study.rank <=3
  );
  const otherStudyRanking = studyRanking.filter(
    (study) => study.rank > 3 && study.rank <= 10
  );

  useEffect(() => {
    getStudyRanking();
  }, []);

  if (errorMessage) {
    return (
      <section className="ranking-list">
        <AlertMessage
          message={errorMessage}
          variant="error"
        />
      </section>
    )
  }

  return (
    <section className="ranking-list">
      {studyRanking.length === 0 ? (
        <p>이번 주 스터디 랭킹 기록이 없습니다</p>
      ) : (
        <>
          <ul className="top-ranking-list">
            {topStudyRanking.map((study) => (
              <li key={study.id} className={`top-ranking-item rank-${study.rank}`}>
                <p className="top-ranking-rank">{study.rank}위</p>
                <p className="top-ranking-name">{study.name}</p>
                <p className="top-ranking-point">{study.point}P</p>
              </li>
            ))}
          </ul>

          <ul className="other-ranking-list">
            {otherStudyRanking.map((study) => (
              <li key={study.id} className="other-ranking-item">
                <p>{study.rank}위</p>
                <p>{study.name}</p>
                <p>{study.point}P</p>
              </li>
            ))}
          </ul>
        </>  
      )}
      
    </section>
  )
}

export default StudyRanking;
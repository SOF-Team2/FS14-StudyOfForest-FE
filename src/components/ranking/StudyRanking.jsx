import { useState, useEffect } from "react";
import axios from "../../utils/axios.js";
import AlertMessage from "../AlertMessage.jsx";

function StudyRanking({ onLoadComplete }) {
  const [studyRanking, setStudyRanking] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  const getStudyRanking = async () => {
    try {
      const response = await axios.get("/ranking/study");
      setStudyRanking(response.data);
    } catch (error) {
      console.error(error);

      setHasError(true);

      setErrorMessage(
        error.response?.data?.message ||
        "스터디 랭킹을 불러오지 못했습니다"
      );
    } finally {
      onLoadComplete?.();
    }
  };

  // 정렬된 랭킹 데이터 중 핲의 3개만 TOP 영역에 표시
  const topStudyRanking = studyRanking.slice(0, 3);

  // TOP 영역에 들어가지 않은 항목 중 실제 순위가 10위 이내인 항목
  const otherStudyRanking = studyRanking
    .slice(3)
    .filter((study) => study.rank <= 10);

  useEffect(() => {
    getStudyRanking();
  }, []);

  return (
    <section className="ranking-list">
      {errorMessage && (
        <AlertMessage
          message={errorMessage}
          variant="error"
          onClose={() => setErrorMessage("")}
        />
      )}

      {hasError ? (
        <p className="ranking-empty">스터디 랭킹을 불러올 수 없습니다</p>
      ) : studyRanking.length === 0 ? (
        <p className="ranking-empty">이번 주 스터디 랭킹 기록이 없습니다</p>
      ) : (
        <>
          <ul className="top-ranking-list">
            {topStudyRanking.map((study, index) => (
              <li 
                key={study.id} 
                className={`top-ranking-item top-position-${index + 1} rank-${study.rank}`}
              >
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
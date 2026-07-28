import { useState, useEffect } from "react";
import axios from "../../utils/axios.js"
import AlertMessage from "../AlertMessage.jsx";

function UserRanking({ onLoadComplete }) {
  const [userRanking, setUserRanking] = useState([])
  const [errorMessage, setErrorMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  const getUserRanking = async () => {
    try {
      const response = await axios.get("/ranking/user");
      setUserRanking(response.data);
    } catch (error) {
      console.error(error);

      setHasError(true);

      setErrorMessage(
        error.response?.data?.message ||
        "유저 랭킹을 불러오지 못했습니다"
      );
    } finally {
      onLoadComplete?.();
    }
  };

  // 정렬된 랭킹 데이터 중 앞의 3개만 TOP 영역에 표시
  const topUserRanking = userRanking.slice(0, 3);

  // TOP 영역에 들어가지 않은 항복 중 실제 순위가 10위 이내인 항목
  const otherUserRanking = userRanking
    .slice(3)
    .filter((user) => user.rank <= 10);

  useEffect(() => {
    getUserRanking();
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
        <p className="ranking-empty">유저 랭킹을 불러올 수 없습니다</p>
      ) : userRanking.length === 0 ? (
        <p className="ranking-empty">이번 주 유저 랭킹 기록이 없습니다</p>
      ) : (
        <>
          <ul className="top-ranking-list">
            {topUserRanking.map((user, index) => (
              <li 
                key={user.id} 
                className={`top-ranking-item top-position-${index + 1} rank-${user.rank}`}
              >
                <p className="top-ranking-rank">{user.rank}위</p>
                <p className="top-ranking-name">{user.nickname}</p>
                <p className="top-ranking-point">{user.point}P</p>
              </li>
            ))}
          </ul>
          
          <ul className="other-ranking-list">
            {otherUserRanking.map((user) => (
              <li key={user.id} className="other-ranking-item">
                <p>{user.rank}위</p>
                <p>{user.nickname}</p>
                <p>{user.point}P</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default UserRanking;
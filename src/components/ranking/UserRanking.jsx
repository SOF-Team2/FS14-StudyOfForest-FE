import { useState, useEffect } from "react";
import axios from "../../utils/axios.js"
import AlertMessage from "../AlertMessage.jsx";

function UserRanking({ onLoadComplete }) {
  const [userRanking, setUserRanking] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  const getUserRanking = async () => {
    try {
      const response = await axios.get("/ranking/user");
      setUserRanking(response.data);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.message ||
        "유저 랭킹을 불러오지 못했습니다"
      );
    } finally {
      onLoadComplete?.();
    }
  };

  const topUserRanking = userRanking.filter(
    (user) => user.rank <= 3
  );
  const otherUserRanking = userRanking.filter(
    (user) => user.rank > 3 && user.rank <= 10
  );

  useEffect(() => {
    getUserRanking();
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
      {userRanking.length === 0 ? (
        <p>이번 주 유저 랭킹 기록이 없습니다</p>
      ) : (
        <>
          <ul className="top-ranking-list">
            {topUserRanking.map((user) => (
              <li key={user.id} className={`top-ranking-item rank-${user.rank}`}>
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
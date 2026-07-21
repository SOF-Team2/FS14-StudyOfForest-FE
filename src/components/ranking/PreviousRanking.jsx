import { useEffect, useState } from "react";
import axios from "../../utils/axios.js";
import AlertMessage from "../AlertMessage.jsx";

function PreviousRanking({ onLoadComplete }) {
  const [previousRanking, setPreviousRanking] = useState({
    studies: [],
    users: [],
  });
  const [errorMessage, setErrorMessage] = useState("");

  const getPreviousRanking = async () => {
    try {
      const response = await axios.get("/ranking/previous-week");
      setPreviousRanking(response.data)
    } catch(error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.message ||
        "지난주 랭킹을 불러오지 못했습니다"
      );
    } finally {
      onLoadComplete?.();
    }
  };

  useEffect(() => {
    getPreviousRanking();
  },[]);

  if (errorMessage) {
    return (
      <section className="previous-ranking">
        <AlertMessage
          message={errorMessage}
          variant="error"
        />
      </section>
    );
  }

  return (
    <section className="previous-ranking">
      <div className="previous-ranking-header">
        <h2>지난주 명예의 전당</h2>
        <p>지난주 가장 높은 포인트를 기록한 주인공이에요</p>
      </div>

      <div className="previous-ranking-list">
        <div className="previous-ranking-card">
          <h3>스터디 1위</h3>

          {previousRanking.studies.length > 0 ? (
            previousRanking.studies.map((study) => (
              <div className="previous-ranking-result" key={study.id}>
                <p className="previous-ranking-name">
                  {study.name}
                </p>
                <p className="previous-ranking-point">
                  {study.point}P
                </p>
              </div>
            ))
          ) : (
            <p>지난주 랭킹 기록이 없습니다</p>
          )}
        </div>

        <div className="previous-ranking-card">
          <h3>유저 1위</h3>

          {previousRanking.users.length > 0 ? (
            previousRanking.users.map((user) => (
              <div className="previous-ranking-result" key={user.id}>
                <p className="previous-ranking-name">
                  {user.nickname}
                </p>
                <p className="previous-ranking-point">
                  {user.point}P
                </p>
              </div>
            ))
          ) : (
            <p>지난주 랭킹 기록이 없습니다</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default PreviousRanking;
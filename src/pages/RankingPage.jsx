import { useEffect, useState } from "react";
import AlertMessage from "../components/AlertMessage.jsx";
import PreviousRanking from "../components/ranking/PreviousRanking.jsx";
import StudyRanking from "../components/ranking/StudyRanking.jsx";
import UserRanking from "../components/ranking/UserRanking.jsx";

// 랭킹 집계 기간 구하기
const getWeekRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const day = today.getDay(); // 일: 0 ~ 토: 6

  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startDate: monday,
    endDate: sunday,
  };
};

// 다음 랭킹까지 남은 시간 구하기
const getRemainingTime = () => {
  const { endDate } = getWeekRange();
  const now = new Date();

  const nextMonday = new Date(endDate);
  nextMonday.setDate(endDate.getDate() + 1);

  const remainingTime = nextMonday - now;

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(remainingTime / (1000 * 60 * 60)) % 24;

  return {
    days,
    hours,
  };
};

// 날짜 형식 변경
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function RankingPage() {
  const [selectTab, setSelectTab] = useState("study");

  // 지난주 랭킹과 현재 랭킹 로딩 상태
  const [previousLoading, setPreviousLoading] = useState(true);
  const [rankingLoading, setRankingLoading] = useState(true);

  const isLoading = previousLoading || rankingLoading;

  const [remainingTime, setRemainingTime] = useState(getRemainingTime());

  const { startDate, endDate } = getWeekRange();

  const handleTabChange = (tab) => {
    if (tab === selectTab) {
      return;
    }

    setSelectTab(tab);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <AlertMessage message="랭킹을 불러오는 중입니다." />
      )}

      <section 
        className="inner"
        style={{visibility: isLoading ? "hidden" : "visible" }}
      >
        <div className="card_container">
          <PreviousRanking
            onLoadComplete={() => setPreviousLoading(false)}
          />
        </div>

        <div className="card_container ranking-container">
          <div className="ranking-header">
            <h1 className="ranking-title container_title">
              이번 주 랭킹
            </h1>

            <div className="ranking-info">
              <p>
                집계 기간: {formatDate(startDate)} ~ {formatDate(endDate)}
              </p>
              <p>
                다음 랭킹까지 {remainingTime.days}일 {remainingTime.hours}시간
              </p>
            </div>
          </div>

          <div className="ranking-tabs">
            <button
              type="button"
              className={`${selectTab === "study" ? "active" : ""}`}
              onClick={() => handleTabChange("study")}
            >
              스터디 랭킹
            </button>

            <button
              type="button" 
              className={`${selectTab === "user" ? "active" : ""}`}
              onClick={() => handleTabChange("user")} 
            >
              유저 랭킹
            </button>
          </div>

          <div className={selectTab === "study" ? "ranking-panel active" : "ranking-panel"}>
            <StudyRanking onLoadComplete={() => setRankingLoading(false)} />
          </div>
          <div className={selectTab === "user" ? "ranking-panel active" : "ranking-panel"}>
            <UserRanking onLoadComplete={() => setRankingLoading(false)} />
          </div>

          <p className="ranking-guide">
            포인트를 모아 더 높은 순위에 도전해보세요!
          </p>
        </div>
      </section>
    </>
  );
}

export default RankingPage;
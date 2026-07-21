import { Link } from "react-router-dom";
import { useLoading } from "../contexts/LoadingContext";
import axios from "../utils/axios";
import { useEffect, useState } from "react";

function DashboardPage() {
  const { startLoading, endLoading } = useLoading();

  const [todayStatus, setTodayStatus] = useState([]);
  const [weeklyFocus, setWeeklyFocus] = useState([]);
  const [maxFocusMinutes, setMaxFocusMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage("");
    startLoading();

    try {
      const response = await axios.get("/api/users/dashboard", {
        headers: {
          "x-user-id": "942d8758-939d-47f4-ba70-f418cccbdfd4",
        },
      });

      // 서버가 { todayStatus, weeklyFocus } 또는
      // { data: { todayStatus, weeklyFocus } } 형태로 응답하는 경우 모두 처리합니다.
      const data = response.data?.data ?? response.data ?? {};

      const loadedTodayStatus = Array.isArray(data.todayStatus)
        ? data.todayStatus
        : [];

      const loadedWeeklyFocus = Array.isArray(data.weeklyFocus)
        ? data.weeklyFocus
        : [];

      const loadedMaxFocusMinutes =
        loadedWeeklyFocus.length > 0
          ? Math.max(
              ...loadedWeeklyFocus.map((item) => Number(item?.minutes ?? 0)),
            )
          : 0;

      setTodayStatus(loadedTodayStatus);
      setWeeklyFocus(loadedWeeklyFocus);
      setMaxFocusMinutes(loadedMaxFocusMinutes);
    } catch (error) {
      console.error("대시보드 조회 실패:", error);
      console.error("서버 응답:", error.response?.data);

      setTodayStatus([]);
      setWeeklyFocus([]);
      setMaxFocusMinutes(0);
      setErrorMessage(
        error.response?.data?.message ??
          "대시보드 정보를 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
      endLoading();
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  const studies = [
    {
      id: 1,
      name: "React 프론트엔드 스터디",
      description: "컴포넌트와 상태 관리 공부하기",
      progress: 80,
      completedHabit: 4,
      totalHabit: 5,
    },
    {
      id: 2,
      name: "알고리즘 스터디",
      description: "매일 알고리즘 문제 풀이",
      progress: 45,
      completedHabit: 2,
      totalHabit: 4,
    },
    {
      id: 3,
      name: "영어 회화 스터디",
      description: "하루 30분 영어로 말하기",
      progress: 100,
      completedHabit: 3,
      totalHabit: 3,
    },
  ];

  const achievements = [
    {
      id: 1,
      icon: "🌱",
      name: "꾸준한 시작",
      description: "3일 연속 습관을 달성했어요",
    },
    {
      id: 2,
      icon: "⏰",
      name: "집중의 달인",
      description: "하루 집중 시간 3시간을 달성했어요",
    },
  ];

  const favoriteStudies = [
    {
      id: 1,
      name: "React 프론트엔드 스터디",
      members: 7,
      category: "개발",
    },
    {
      id: 2,
      name: "매일 알고리즘",
      members: 5,
      category: "코딩 테스트",
    },
  ];

  return (
    <section className="dashboard_page">
      <div className="inner">
        <div className="card_container">
          <div className="container_title">
            <span>
              <span className="bold green">승현지</span> 님의{" "}
              <span className="bold">대시보드</span>
            </span>
          </div>

          <div className="card_container inner_container">
            <div className="container_title dec">
              <span>오늘의 현황</span>
            </div>

            <div className="card_wrap dashboard_card_wrap">
              {isLoading && <p>오늘의 현황을 불러오는 중입니다.</p>}

              {!isLoading && errorMessage && (
                <div className="dashboard_error">
                  <p>{errorMessage}</p>
                  <button type="button" onClick={handleLoad}>
                    다시 불러오기
                  </button>
                </div>
              )}

              {!isLoading && !errorMessage && todayStatus.length === 0 && (
                <p>오늘의 현황 데이터가 없습니다.</p>
              )}

              {!isLoading &&
                !errorMessage &&
                todayStatus.map((status, index) => (
                <div className="card dashboard_card" key={status?.id ?? index}>
                  <div className="dashboard_card_header">
                    <div>
                      <div className="dashboard_card_label">{status?.label ?? ""}</div>

                      <p className="dashboard_card_description">
                        {status?.description ?? ""}
                      </p>
                    </div>

                    <div className="dashboard_card_icon">{status?.icon ?? ""}</div>
                  </div>

                  {status.type === "time" && (
                    <div className="dashboard_card_value">
                      <strong>{status.hour}</strong>
                      <span>시간</span>
                      <strong>{status.minute}</strong>
                      <span>분</span>
                    </div>
                  )}

                  {status.type === "progress" && (
                    <>
                      <div className="dashboard_card_value">
                        <strong>{status.current}</strong>

                        <span className="dashboard_value_total">
                          / {status.total}개
                        </span>
                      </div>

                      <div className="dashboard_progress">
                        <div
                          className="dashboard_progress_bar"
                          style={{ width: `${Number(status?.progress ?? 0)}%` }}
                        />
                      </div>
                    </>
                  )}

                  {status.type === "streak" && (
                    <div className="dashboard_card_value">
                      <strong>{status.value}</strong>
                      <span>일째</span>
                    </div>
                  )}

                  <div className="dashboard_card_footer">
                    <span>{status.footerLabel}</span>

                    <strong className={status.footerClassName || ""}>
                      {status.footerValue}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card_container inner_container">
            <div className="container_title dec">
              <span>진행 중인 스터디</span>

              <Link to="/study" className="dashboard_more_link">
                전체 보기
              </Link>
            </div>

            <div className="dashboard_study_grid">
              {studies.map((study) => (
                <Link
                  to={`/study/${study.id}`}
                  className="card dashboard_card dashboard_study_card"
                  key={study.id}
                >
                  <div className="dashboard_card_header">
                    <div>
                      <div className="dashboard_card_label">{study.name}</div>

                      <p className="dashboard_card_description">
                        {study.description}
                      </p>
                    </div>

                    <div className="dashboard_card_icon">📚</div>
                  </div>

                  <div className="dashboard_study_summary">
                    <span>오늘의 습관</span>

                    <strong>
                      {study.completedHabit} / {study.totalHabit}
                    </strong>
                  </div>

                  <div className="dashboard_progress">
                    <div
                      className="dashboard_progress_bar"
                      style={{ width: `${study.progress}%` }}
                    />
                  </div>

                  <div className="dashboard_card_footer">
                    <span>오늘의 달성률</span>
                    <strong>{study.progress}%</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="card_container dashboard_activity_container inner_container">
            <div className="container_title">
              <span className="bold">활동 요약</span>
            </div>

            <div className="dashboard_activity_grid">
              <div className="card dashboard_card dashboard_activity_card dashboard_weekly_card">
                <div className="dashboard_card_header">
                  <div>
                    <div className="dashboard_card_label">이번 주 집중</div>

                    <p className="dashboard_card_description">
                      요일별 집중 시간을 확인해 보세요
                    </p>
                  </div>

                  <div className="dashboard_card_icon">📊</div>
                </div>

                <div className="dashboard_weekly_total">
                  <strong>13</strong>
                  <span>시간 00분</span>
                </div>

                <div className="dashboard_weekly_chart">
                  {isLoading && <p>집중 기록을 불러오는 중입니다.</p>}

                  {!isLoading && !errorMessage && weeklyFocus.length === 0 && (
                    <p>이번 주 집중 기록이 없습니다.</p>
                  )}

                  {!isLoading &&
                    !errorMessage &&
                    weeklyFocus.map((item, index) => {
                    const minutes = Number(item?.minutes ?? 0);
                    const barHeight =
                      maxFocusMinutes > 0
                        ? (minutes / maxFocusMinutes) * 100
                        : 0;

                    return (
                      <div className="dashboard_chart_item" key={item?.day ?? index}>
                        <div className="dashboard_chart_bar_wrap">
                          <div
                            className="dashboard_chart_bar"
                            style={{ height: `${barHeight}%` }}
                          />
                        </div>

                        <span>{item?.day ?? "-"}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="dashboard_card_footer">
                  <span>지난주보다</span>
                  <strong className="dashboard_increase">+2시간 30분</strong>
                </div>
              </div>

              <div className="card dashboard_card dashboard_activity_card">
                <div className="dashboard_card_header">
                  <div>
                    <div className="dashboard_card_label">최근 획득한 업적</div>

                    <p className="dashboard_card_description">
                      새롭게 달성한 기록이에요
                    </p>
                  </div>

                  <div className="dashboard_card_icon">🏆</div>
                </div>

                <div className="dashboard_achievement_list">
                  {achievements.map((achievement) => (
                    <div
                      className="dashboard_achievement_item"
                      key={achievement.id}
                    >
                      <div className="dashboard_achievement_icon">
                        {achievement.icon}
                      </div>

                      <div>
                        <strong>{achievement.name}</strong>
                        <p>{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dashboard_card_footer">
                  <span>전체 업적</span>
                  <strong>5개</strong>
                </div>
              </div>

              <div className="card dashboard_card dashboard_activity_card">
                <div className="dashboard_card_header">
                  <div>
                    <div className="dashboard_card_label">즐겨찾는 스터디</div>

                    <p className="dashboard_card_description">
                      자주 방문하는 스터디예요
                    </p>
                  </div>

                  <div className="dashboard_card_icon">⭐</div>
                </div>

                <div className="dashboard_favorite_list">
                  {favoriteStudies.map((study) => (
                    <Link
                      to={`/study/${study.id}`}
                      className="dashboard_favorite_item"
                      key={study.id}
                    >
                      <div>
                        <strong>{study.name}</strong>

                        <p>
                          {study.category} · 참여자 {study.members}명
                        </p>
                      </div>

                      <span>›</span>
                    </Link>
                  ))}
                </div>

                <div className="dashboard_card_footer">
                  <span>즐겨찾기</span>
                  <strong>{favoriteStudies.length}개</strong>
                </div>
              </div>

              <div className="card dashboard_card dashboard_activity_card">
                <div className="dashboard_card_header">
                  <div>
                    <div className="dashboard_card_label">이번 주 목표</div>

                    <p className="dashboard_card_description">
                      목표까지 조금만 더 힘내세요
                    </p>
                  </div>

                  <div className="dashboard_card_icon">🎯</div>
                </div>

                <div className="dashboard_goal_value">
                  <strong>72</strong>
                  <span>%</span>
                </div>

                <div className="dashboard_progress dashboard_goal_progress">
                  <div
                    className="dashboard_progress_bar"
                    style={{ width: "72%" }}
                  />
                </div>

                <p className="dashboard_goal_description">
                  이번 주 목표 18시간 중 13시간을 달성했어요.
                </p>

                <div className="dashboard_card_footer">
                  <span>남은 목표</span>
                  <strong>5시간</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
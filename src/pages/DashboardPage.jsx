import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../contexts/LoadingContext";
import axios from "../utils/axios";
import { useEffect, useRef, useState } from "react";
import { getUserId } from "../utils/authStorage";

const DEFAULT_VISIBLE_STUDY_COUNT = 3;
const STUDY_TOGGLE_ANIMATION_MS = 250;

function DashboardPage() {
  const { startLoading, endLoading } = useLoading();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [todayStatus, setTodayStatus] = useState([]);
  const [weeklyFocus, setWeeklyFocus] = useState([]);
  const [weeklyFocusCard, setWeeklyFocusCard] = useState({});
  const [studies, setStudies] = useState([]);
  const [showAllStudies, setShowAllStudies] = useState(false);
  const [isCollapsingStudies, setIsCollapsingStudies] = useState(false);
  const [studySectionHeight, setStudySectionHeight] = useState(null);
  const [favoriteStudies, setFavoriteStudies] = useState([]);
  const [favoriteTotalCount, setFavoriteTotalCount] = useState(0);
  const [goalCard, setGoalCard] = useState({});
  const [maxFocusMinutes, setMaxFocusMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const studySectionRef = useRef(null);
  const studyCollapseTimerRef = useRef(null);
  const studyResizeFrameRef = useRef(null);
  const userId = getUserId();

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage("");
    startLoading();

    try {
      const [
        currentUserResult,
        dashboardResult,
        studiesResult,
        favoritesResult,
        goalResult,
      ] = await Promise.allSettled([
        axios.get("/users/me"),
        axios.get("/api/users/dashboard"),
        axios.get("/api/users/studies"),
        axios.get("/api/favorites/me"),
        axios.get("/api/users/goal"),
      ]);

      if (currentUserResult.status === "rejected") {
        throw currentUserResult.reason;
      }

      if (dashboardResult.status === "rejected") {
        throw dashboardResult.reason;
      }

      setCurrentUser(currentUserResult.value.data?.data ?? null);

      // 서버가 { todayStatus, weeklyFocus } 또는
      // { data: { todayStatus, weeklyFocus } } 형태로 응답하는 경우 모두 처리합니다.
      const data =
        dashboardResult.value.data?.data ?? dashboardResult.value.data ?? {};

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
      const loadedWeeklyFocusCard = data.weeklyFocusCard;

      setTodayStatus(loadedTodayStatus);
      setWeeklyFocus(loadedWeeklyFocus);
      setMaxFocusMinutes(loadedMaxFocusMinutes);
      setWeeklyFocusCard(loadedWeeklyFocusCard ?? {});

      if (studiesResult.status === "fulfilled") {
        setStudies(studiesResult.value.data?.data ?? []);
      } else {
        console.error("내 스터디 조회 실패:", studiesResult.reason);
        setStudies([]);
      }

      if (favoritesResult.status === "fulfilled") {
        const favoriteList = favoritesResult.value.data?.data ?? [];
        setFavoriteStudies(favoriteList);
        setFavoriteTotalCount(
          favoritesResult.value.data?.pagination?.totalCount ??
            favoriteList.length,
        );
      } else {
        console.error("즐겨찾기 조회 실패:", favoritesResult.reason);
        setFavoriteStudies([]);
        setFavoriteTotalCount(0);
      }

      if (goalResult.status === "fulfilled") {
        setGoalCard(goalResult.value.data?.data ?? {});
      } else {
        console.error("주간 목표 조회 실패:", goalResult.reason);
        setGoalCard({});
      }
    } catch (error) {
      console.error("대시보드 조회 실패:", error);
      console.error("서버 응답:", error.response?.data);

      setCurrentUser(null);
      setTodayStatus([]);
      setWeeklyFocus([]);
      setWeeklyFocusCard({});
      setStudies([]);
      setFavoriteStudies([]);
      setFavoriteTotalCount(0);
      setGoalCard({});
      setMaxFocusMinutes(0);
      setErrorMessage(
        error.response?.data?.error?.message ??
          error.response?.data?.message ??
          "대시보드 정보를 불러오지 못했습니다.",
      );

      if ([400, 401, 404].includes(error.response?.status)) {
        navigate("/signin", { replace: true });
      }
    } finally {
      setIsLoading(false);
      endLoading();
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/signin", { replace: true });
      return;
    }

    handleLoad();
  }, []);

  useEffect(
    () => () => {
      if (studyCollapseTimerRef.current) {
        window.clearTimeout(studyCollapseTimerRef.current);
      }

      if (studyResizeFrameRef.current) {
        window.cancelAnimationFrame(studyResizeFrameRef.current);
      }
    },
    [],
  );

  const handleToggleStudies = () => {
    if (isCollapsingStudies) {
      return;
    }

    if (!showAllStudies) {
      setShowAllStudies(true);
      return;
    }

    const animationDuration = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? 0
      : STUDY_TOGGLE_ANIMATION_MS;

    if (animationDuration === 0) {
      setShowAllStudies(false);
      return;
    }

    const studySection = studySectionRef.current;
    const studyCards = studySection?.querySelectorAll(
      ".dashboard_study_card",
    );
    const lastVisibleCard =
      studyCards?.[DEFAULT_VISIBLE_STUDY_COUNT - 1] ?? null;

    if (studySection && lastVisibleCard) {
      const sectionRect = studySection.getBoundingClientRect();
      const lastVisibleCardRect = lastVisibleCard.getBoundingClientRect();
      const sectionStyle = window.getComputedStyle(studySection);
      const paddingBottom = Number.parseFloat(sectionStyle.paddingBottom) || 0;
      const borderBottom =
        Number.parseFloat(sectionStyle.borderBottomWidth) || 0;
      const collapsedHeight = Math.ceil(
        lastVisibleCardRect.bottom -
          sectionRect.top +
          paddingBottom +
          borderBottom,
      );

      setStudySectionHeight(Math.ceil(sectionRect.height));
      studyResizeFrameRef.current = window.requestAnimationFrame(() => {
        setStudySectionHeight(collapsedHeight);
        studyResizeFrameRef.current = null;
      });
    }

    setIsCollapsingStudies(true);
    studyCollapseTimerRef.current = window.setTimeout(() => {
      setShowAllStudies(false);
      setIsCollapsingStudies(false);
      setStudySectionHeight(null);
      studyCollapseTimerRef.current = null;
    }, animationDuration);
  };

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
  const hasHiddenStudies = studies.length > DEFAULT_VISIBLE_STUDY_COUNT;
  const visibleStudies = showAllStudies
    ? studies
    : studies.slice(0, DEFAULT_VISIBLE_STUDY_COUNT);

  return (
    <section className="dashboard_page">
      <div className="inner">
        <div className="card_container">
          <div className="container_title">
            <span>
              <span className="bold green">
                {currentUser?.nickname ?? ""}
              </span>{" "}
              님의{" "}
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
                  <div
                    className="card dashboard_card"
                    key={status?.id ?? index}
                  >
                    <div className="dashboard_card_header">
                      <div>
                        <div className="dashboard_card_label">
                          {status?.label ?? ""}
                        </div>

                        <p className="dashboard_card_description">
                          {status?.description ?? ""}
                        </p>
                      </div>

                      <div className="dashboard_card_icon">
                        {status?.icon ?? ""}
                      </div>
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
                            style={{
                              width: `${Number(status?.progress ?? 0)}%`,
                            }}
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

          <div
            ref={studySectionRef}
            className={`card_container inner_container dashboard_study_section${
              isCollapsingStudies ? " is-collapsing" : ""
            }`}
            style={
              studySectionHeight === null
                ? undefined
                : { height: studySectionHeight }
            }
          >
            <div className="container_title dec">
              <span>진행 중인 스터디</span>

              {hasHiddenStudies && (
                <button
                  type="button"
                  className="dashboard_more_link"
                  aria-controls="dashboard-study-grid"
                  aria-expanded={showAllStudies}
                  disabled={isCollapsingStudies}
                  onClick={handleToggleStudies}
                >
                  {showAllStudies ? "접기" : "전체 보기"}
                </button>
              )}
            </div>

            <div className="dashboard_study_grid" id="dashboard-study-grid">
              {!isLoading && studies.length === 0 && (
                <p>진행 중인 스터디가 없습니다.</p>
              )}

              {visibleStudies.map((study, index) => (
                <Link
                  to={`/study/${study.studyId}`}
                  className={`card dashboard_card dashboard_study_card${
                    index >= DEFAULT_VISIBLE_STUDY_COUNT
                      ? isCollapsingStudies
                        ? " dashboard_study_card--hiding"
                        : " dashboard_study_card--revealed"
                      : ""
                  }`}
                  key={study.studyId}
                >
                  <div className="dashboard_card_header">
                    <div>
                      <div className="dashboard_card_label">{study.name}</div>

                      <p className="dashboard_card_description">
                        {study.description ?? ""}
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
                      style={{ width: `${Number(study.progress ?? 0)}%` }}
                    />
                  </div>

                  <div className="dashboard_card_footer">
                    <span>오늘의 달성률</span>
                    <strong>{Number(study.progress ?? 0)}%</strong>
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
                  <strong>
                    {weeklyFocusCard.hour ? weeklyFocusCard.hour : "00"}
                  </strong>
                  <span>
                    시간{" "}
                    {weeklyFocusCard.minute ? weeklyFocusCard.minute : "00"}분
                  </span>
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
                        <div
                          className="dashboard_chart_item"
                          key={item?.day ?? index}
                        >
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
                  <strong className="dashboard_increase">
                    {weeklyFocusCard.footerValue}
                  </strong>
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
                          {study.description} · 참여자 {study.currentMembers}명
                        </p>
                      </div>

                      <span>›</span>
                    </Link>
                  ))}
                </div>

                <div className="dashboard_card_footer">
                  <span>즐겨찾기</span>
                  <strong>{favoriteTotalCount}개</strong>
                </div>
              </div>

              <div className="card dashboard_card dashboard_activity_card">
                <div className="dashboard_card_header">
                  <div>
                    <div className="dashboard_card_label">이번 주 목표</div>

                    <p className="dashboard_card_description">
                      {goalCard.description ?? "이번 주 목표를 설정해보세요"}
                    </p>
                  </div>

                  <div className="dashboard_card_icon">
                    {goalCard.icon ?? "🎯"}
                  </div>
                </div>

                <div className="dashboard_goal_value">
                  <strong>{Number(goalCard.progress ?? 0)}</strong>
                  <span>%</span>
                </div>

                <div className="dashboard_progress dashboard_goal_progress">
                  <div
                    className="dashboard_progress_bar"
                    style={{ width: `${Number(goalCard.progress ?? 0)}%` }}
                  />
                </div>

                <p className="dashboard_goal_description">
                  {goalCard.summaryText ??
                    goalCard.description ??
                    "이번 주 목표를 설정해보세요"}
                </p>

                <div className="dashboard_card_footer">
                  <span>{goalCard.footerLabel ?? "남은 목표"}</span>
                  <strong>{goalCard.footerValue ?? "-"}</strong>
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

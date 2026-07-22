import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axios.js";
import HabitList from "../components/habit/HabitList.jsx";
import HabitEditModal from "../components/habit/HabitEditModal.jsx";
import CurrentTime from "../components/habit/CurrentTime.jsx";
import arrowRightIcon from "../assets/img/ic_arrow_right.svg";
import { useLoading } from "../contexts/LoadingContext.jsx";
import { getStudyBackgroundStyle } from "../utils/studyBackground.js";


function TodayHabitPage() {
  const { startLoading, endLoading } = useLoading();
  const [isHabitLoading, setIsHabitLoading] = useState(true);
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [study, setStudy] = useState({});
  const [habits, setHabits] = useState([]);

  const handleLoad = async () => {
    startLoading();

    try {
      const response = await axios.get(`/study/${id}/habit`);

      setStudy(response.data);
      setHabits(response.data.habits ?? []);
      setIsEditModalOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsHabitLoading(false);
      endLoading();
    }
  };

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      handleLoad();
    }, 0);

    return () => window.clearTimeout(loadTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const studyDetailBackgroundStyle = getStudyBackgroundStyle(study);

  return (
    <section>
      <div className="inner">
        <section className="study-detail-section card_container study-subpage-detail study-habit-detail">
          <div
            className="study-detail-background-layer"
            style={studyDetailBackgroundStyle}
            aria-hidden="true"
          />

          <div className="study-detail-content">
            <nav
              className="focus-page__navigation"
              aria-label="스터디 페이지 이동"
            >
              <Link
                to={`/study/${id}`}
                className="focus-page__navigation-button"
              >
                <span>스터디</span>

                <img
                  className="focus-page__navigation-icon"
                  src={arrowRightIcon}
                  alt=""
                />
              </Link>

              <Link
                to={`/study/${id}/focus`}
                className="focus-page__navigation-button"
              >
                <span>오늘의 집중</span>

                <img
                  className="focus-page__navigation-icon"
                  src={arrowRightIcon}
                  alt=""
                />
              </Link>
            </nav>

            <div className="study-detail-secondary-actions">
              <div className="study-detail-current-time">
                <CurrentTime />
              </div>
            </div>

            <div className="container_title">
              <div className="study-detail-title">
                {study.nickname && (
                  <>
                    <span>{study.nickname}</span>
                    <span>의</span>
                  </>
                )}
                <span>{study.name}</span>
              </div>
            </div>

          </div>

          <div className="card_container inner_container today_habit_card">
            <div className="inner">
              <span className="container_title">오늘의 습관</span>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="edit_habit_btn"
              >
                목록 수정
              </button>
              <HabitList 
                habits={habits} 
                handleLoad={handleLoad}
                isLoading={isHabitLoading}
              />
            </div>
          </div>
        </section>
      </div>
      {isEditModalOpen && (
                <HabitEditModal
                  habits={habits}
                  onClose={() => setIsEditModalOpen(false)}
                  onSave={handleLoad}
                  studyId={id}
                />
      )}
    </section>
  );
}

export default TodayHabitPage;

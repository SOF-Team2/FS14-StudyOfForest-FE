import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "../utils/axios.js";
import HabitList from "../components/habit/HabitList.jsx";
import HabitEditModal from "../components/habit/HabitEditModal.jsx";
import CurrentTime from "../components/habit/CurrentTime.jsx";
import arrowRight from "../assets/img/ic_arrow_right.svg";
import { useLoading } from "../contexts/LoadingContext.jsx";


function TodayHabitPage() {
  const location = useLocation();
  const password = location.state?.password;
  const { startLoading, endLoading } = useLoading();
  const [isHabitLoading, setIsHabitLoading] = useState(true)
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [study, setStudy] = useState([]);
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
    handleLoad();
  }, []);

  return (
    <section>
      <div className="inner">
        <div className="card_container">
          <div className="container_title_wrap">
            <span className="container_title">{study.name}</span>

            <div className="link_wrap">
              <Link to={`/study/${id}`} className="link_btn">스터디
                <img src={arrowRight} alt="링크 버튼 장식" />
              </Link>
              <Link to={`/study/${id}/focus`} state={{ password }} className="link_btn">오늘의 집중
                <img src={arrowRight} alt="링크 버튼 장식" />
              </Link>
              <Link to={"/"} className="link_btn">홈
                <img src={arrowRight} alt="링크 버튼 장식" />
              </Link>
            </div>
          </div>
          <CurrentTime />
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
        </div>
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

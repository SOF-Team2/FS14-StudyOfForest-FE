import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axios.js";
import HabitList from "../components/habit/HabitList.jsx";
import HabitEditModal from "../components/habit/HabitEditModal.jsx";
import CurrentTime from "../components/habit/CurrentTime.jsx";
import arrowRight from "../assets/img/ic_arrow_right.svg";

function TodayHabitPage() {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [study, setStudy] = useState([]);
  const [habits, setHabits] = useState([]);

  const handleLoad = async () => {
    const response = await axios.get(`/study/${id}/habit`);

    setStudy(response.data);
    setHabits(response.data.habits);
    setIsEditModalOpen(false);
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
              <Link to={`/study/${id}/focus`} className="link_btn">오늘의 집중
                <img src={arrowRight} alt="링크 버튼 장식" />
              </Link>
              <Link to={"/"} className="link_btn">홈
                <img src={arrowRight} alt="링크 버튼 장식" />
              </Link>
            </div>
          </div>
          <CurrentTime />
          <div className="card_container inner_container">
            <div className="inner">
              <span className="container_title">오늘의 습관</span>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="edit_habit_btn"
              >
                목록 수정
              </button>
              <HabitList habits={habits} handleLoad={handleLoad}/>
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

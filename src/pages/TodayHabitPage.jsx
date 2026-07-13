import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axios.js";
import HabitList from "../components/habit/HabitList.jsx";
import HabitEditModal from "../components/habit/HabitEditModal.jsx";
import WeeklyHabitRecordTable from "../components/habit/WeeklyHabitRecordTable.jsx";

function TodayHabitPage() {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [study, setStudy] = useState([]);
  const [habits, setHabits] = useState([]);

  const handleLoad = async () => {
    const response = await axios.get(`/study/${id}/habit`);

    setHabits(response.data);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <div className="inner">
        <div className="card_container">
          <span className="container_title">스터디 이름</span>
          <div>
            <Link to={`study/${id}/focus`}>오늘의 집중</Link>
            <Link to={"/"}>홈</Link>
          </div>
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
          <WeeklyHabitRecordTable habits={habits} studyId={id}/>
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

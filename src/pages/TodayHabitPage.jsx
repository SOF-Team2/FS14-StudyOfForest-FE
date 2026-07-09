import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios.js";
import HabitList from "../components/habit/HabitList.jsx";
import HabitEditModal from "../components/habit/HabitEditModal.jsx";

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
  },[]);

  return (
    <section>
      <div className="inner">
        <div className="card_container">
          <span className="container_title">스터디 이름</span>
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
              <HabitList habits={habits} />
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
                <HabitEditModal
                  habits={habits}
                  onClose={() => setIsEditModalOpen(false)}
                  onSave={handleLoad}
                />
      )}
    </section>
  );
}

export default TodayHabitPage;

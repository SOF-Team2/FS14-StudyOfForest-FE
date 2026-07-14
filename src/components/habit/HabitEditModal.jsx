import { useState } from "react";
import trashIcon from "../../assets/img/ic_trash.svg";
import addBtnIcon from "../../assets/img/ic_plus.svg";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";
import Popup from "../Popup";
import { modalType } from "../../utils/enum/modalTypeEnum";
import { useLoading } from "../../contexts/LoadingContext";

function HabitEditModal({ habits, onClose, onSave }) {
  const { startLoading, endLoading } = useLoading();
  const { id } = useParams();
  const [editHabits, setEditHabits] = useState(() =>
    habits.map((habit) => ({
      ...habit,
      localId: habit.id,
    })),
  );
  const [newHabitName, setNewHabitName] = useState("");
  const [popup, setPopup] = useState({
    isOpen: false,
    type: modalType.CONFIRM,
    message: "",
    onConfirm: null,
  });

  const closePopup = () => {
    setPopup({
      isOpen: false,
      type: modalType.ALERT,
      message: "",
      onConfirm: null,
    });
  };

  const openAlert = (message, callback) => {
    setPopup({
      isOpen: true,
      type: "alert",
      message,
      onConfirm: () => {
        closePopup();
        callback?.();
      },
    });
  };

  const openConfirm = (message, onConfirm) => {
    setPopup({
      isOpen: true,
      type: modalType.CONFIRM,
      message,
      onConfirm,
    });
  };

  // 임시 습관의 localId도 필요하기 때문에 습관 객체 전체를 받음
  const openDeletePopup = (e, habit) => {
    e.stopPropagation();

    openConfirm("삭제하시겠습니까?", () => {
      deleteHabit(habit);
    });
  };

  const deleteHabit = async (habit) => {
    // DB에 저장되지 않은 임시 습관
    if (!habit.id) {
      setEditHabits((prev) =>
        prev.filter((item) => item.localId !== habit.localId),
      );

      openAlert("삭제되었습니다.");
      return;
    }

    // DB에 저장된 기존 습관
    startLoading();
    try {
      await axios.delete(`/study/${id}/habit/${habit.id}/`);
      // 삭제된 항목만 모달 목록에서 사라지도록
      setEditHabits((prev) =>
        prev.filter((item) => item.localId !== habit.localId),
      );
      // 기존 습관 하나를 삭제해도 handleLoad가 호출되지 않아 모달이 닫히지 않음
    } catch (error) {
      console.error(error);
      endLoading();
      openAlert("삭제에 실패했습니다.");

    } finally {
      endLoading();
      openAlert("삭제되었습니다.");
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();

    if (newHabitName.trim() === "") return;

    // 이름 수정할 때 id를 대상으로 찾고 있기 때문에
    // 새로 만들어진 습관의 id는 모두 null이라서 함께 이름이 수정됨
    // (3번) 새 습관은 실제 DB에 id가 없기 때문에(null) 삭제할 때 id 존재 여부로 처리 방식 나누기
    const newHabit = {
      id: null,
      localId: crypto.randomUUID(),
      name: newHabitName,
      isChecked: false,
    };
    setEditHabits([...editHabits, newHabit]);
    setNewHabitName("");
  };

  const saveUpdatedHabits = async (e) => {
    e.preventDefault();

    startLoading();
    try {
      const response = await axios.patch(`/study/${id}/habit`, editHabits);
    } catch (error) {
      console.log(error);
    } finally {
      onSave();
      endLoading();
      openAlert("추가되었습니다.");
    }
  };

  const handleHabitNameChange = (localId, value) => {
    setEditHabits((prev) =>
      prev.map((habit) =>
        habit.localId === localId ? { ...habit, name: value } : habit,
      ),
    );
  };

  return (
    <div className="modal_wrap">
      <div className="modal edit_habit_modal">
        <div className="inner">
          <div className="modal_title">습관 목록</div>
          <div className="habit_wrap">
            {editHabits.length === 0 ? (
              <p>아직 습관이 없어요</p>
            ) : (
              editHabits.map((habit) => (
                <div key={habit.localId} className="habit_line">
                  <input
                    className="habit_btn"
                    value={habit.name}
                    onChange={(e) =>
                      handleHabitNameChange(habit.localId, e.target.value)
                    }
                  />
                  <div
                    className="delete_habit_btn"
                    onClick={(e) => openDeletePopup(e, habit)}
                  >
                    <img src={trashIcon} alt="삭제 아이콘" />
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddHabit}>
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
            />

            <button type="submit">
              <img src={addBtnIcon} alt="추가 아이콘" />
            </button>
          </form>
        </div>
        <div className="modal_btn_wrap">
          <button type="button" onClick={onClose}>
            취소
          </button>

          <button
            type="button"
            className="green"
            onClick={(e) => saveUpdatedHabits(e)}
          >
            수정 완료
          </button>
        </div>
      </div>
      {popup.isOpen && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={closePopup}
          onConfirm={popup.onConfirm}
        />
      )}
    </div>
  );
}

export default HabitEditModal;

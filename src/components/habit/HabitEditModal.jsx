import { useState } from 'react'
import trashIcon from '../../assets/img/ic_trash.svg'
import axios from '../../utils/axios'
import { useParams } from 'react-router-dom';

function HabitEditModal({ habits, onClose, onSave }) {
  const { id } = useParams();
  const [editHabits, setEditHabits] = useState(habits)
  const [newHabitName, setNewHabitName] = useState('')

  const deleteHabit = async (e, habitId) => {
    e.stopPropagation();

    if (!confirm("습관을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/habits/${habitId}/`);
      alert("삭제되었습니다.");
      onSave();
      
    } catch (error) {
      console.error(error);
      alert("삭제에 실패했습니다.");
    }
  }

  const handleAddHabit = async (e) => {
    e.preventDefault()

    if (newHabitName.trim() === '') return

    const newHabit = {
      name: newHabitName,
      isChecked: false,
    }

    const response = await axios.post(`/studies/${id}/habits`, newHabit);
    onSave();
  }

  return (
    <div className="modal_wrap">
      <div className='modal edit_habit_modal'>
        <div className="inner">
        <div className="modal_title">습관 목록</div>
          <div className='habit_wrap'>
            {editHabits.length === 0 ? (
              <p>아직 습관이 없어요</p>
            ) : (
              editHabits.map((habit) => (
                <div key={habit.id} className='habit_line'>
                  <span className='habit_btn'>{habit.name}</span>
                  <div className='delete_habit_btn' onClick={(e) => {deleteHabit(e, habit.id)}}>
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
              +
            </button>
          </form>
        </div>
        <div className='modal_btn_wrap'>
            <button type="button" onClick={onClose}>
              취소
            </button>

            <button type="submit" className='green'>
              수정 완료
            </button>
          </div>
      </div>
    </div>
  )
}

export default HabitEditModal
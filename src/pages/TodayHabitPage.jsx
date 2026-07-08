import { useState } from "react"

import HabitList from "../components/habit/HabitList.jsx"
import HabitEditModal from "../components/habit/HabitEditModal.jsx"

function TodayHabitPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [habits, setHabits] = useState([
    { id: 1, name: "매일매일 6시 기상", isChecked: true },
    { id: 2, name: "아침 챙겨 먹기", isChecked: false },
    { id: 3, name: "물 2L 마시기", isChecked: false },
  ])

  const handleSaveHabits = (newHabits) => {
    setHabits(newHabits)
    setIsEditModalOpen(false)
  }

  return (
    <div>
      <h1>오늘의 습관</h1>
      <button 
        type="button" 
        onClick={() => setIsEditModalOpen(true)}
      >
        목록 수정
      </button>
      <HabitList habits={habits}/>

      {isEditModalOpen && (
        <HabitEditModal 
         habits={habits}
         onClose={() => setIsEditModalOpen(false)}
         onSave={handleSaveHabits}
         />
      )}
    </div>
  )
}

export default TodayHabitPage
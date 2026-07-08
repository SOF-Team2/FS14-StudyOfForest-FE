import HabitList from "../components/habit/HabitList"

function TodayHabitPage() {
  const habits = [
    { id: 1, name: '매일매일 6시 기상', isChecked: true },
    { id: 2, name: '아침 챙겨 먹기', isChecked: false },
    { id: 3, name: '물 2L 마시기', isChecked: false },
  ]

  return (
    <div>
      <h1>오늘의 습관</h1>
      <button type='button'>목록 수정</button>
      <HabitList habits={habits}/>
    </div>
  )
}

export default TodayHabitPage
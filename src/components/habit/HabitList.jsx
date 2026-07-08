import HabitItem from "./HabitItem.jsx"

function HabitList({ habits = [] }) {
  if (habits.length === 0) {
    return (
      <p>
        아직 습관이 없어요<br />
        목록 수정을 눌러 습관을 생성해보세요
      </p>
    ) 
  }
  
  return (
    <div>
      {habits.map((habit) => (
        <HabitItem 
          key={habit.id}
          habit={habit}
        />
      ))}
    </div>
  )
}

export default HabitList
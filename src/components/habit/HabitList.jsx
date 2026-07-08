import HabitItem from "./HabitItem.jsx"

function HabitList({ habits = [] }) {
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
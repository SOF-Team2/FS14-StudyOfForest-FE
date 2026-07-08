function HabitItem({ habit }) {
  return (
    <button
      type='button'
    >
      <p>{habit.name}</p>
    </button>
  )
}

export default HabitItem
const HabitItem = ({ habit, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white shadow rounded">
      <span className={habit.completed ? "line-through" : ""}>{habit.name}</span>
      <div className="flex gap-2">
        <button onClick={() => onToggle(habit.id)} className="text-green-500">✓</button>
        <button onClick={() => onDelete(habit.id)} className="text-red-500">✕</button>
      </div>
    </div>
  );
};

export default HabitItem;
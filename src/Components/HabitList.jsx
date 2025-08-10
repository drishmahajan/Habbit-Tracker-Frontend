import HabitItem from "./HabitItem";

const HabitList = ({ habits, onToggle, onDelete }) => {
  return (
    <div className="space-y-2">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default HabitList;
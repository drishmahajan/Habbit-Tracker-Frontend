const HabitTrackerGrid = ({ dates, marked }) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {dates.map((date, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded ${marked.includes(date) ? "bg-green-500" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
};

export default HabitTrackerGrid;
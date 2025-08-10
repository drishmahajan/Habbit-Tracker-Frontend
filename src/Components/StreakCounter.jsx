const StreakCounter = ({ streak }) => {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold">🔥 Streak</h2>
      <p className="text-2xl">{streak} days</p>
    </div>
  );
};
export default StreakCounter;
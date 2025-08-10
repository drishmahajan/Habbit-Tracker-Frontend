import { useState } from "react";
import  Input  from "../Components/ui/input";
import  Button  from "../Components/ui/button";

// AddHabitForm.jsx

const AddHabitForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Health");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, category);
    setName("");
    setCategory("Health");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4 bg-gray-800 p-6 rounded-xl shadow-lg animate-slide-in">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter habit"
        className="flex-1 p-3 rounded bg-gray-900 text-white placeholder-gray-400 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-700"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-3 rounded bg-gray-900 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-700"
      >
        <option value="Health">Health</option>
        <option value="Fitness">Fitness</option>
        <option value="Study">Study</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>
      <button
        type="submit"
        className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded text-white font-semibold hover:scale-105 transform transition-all shadow-xl hover:shadow-pink-500/50"
      >
        ➕ Add Habit
      </button>
    </form>
  );
};

export default AddHabitForm;

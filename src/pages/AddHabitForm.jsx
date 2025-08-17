import { useState } from "react";
import { motion } from "framer-motion";

const AddHabitForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Health");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, category);
    setName("");
    setCategory("Health");
    setIsExpanded(false);
  };

  const categories = [
    { value: "Health", icon: "🏥", color: "from-emerald-500 to-teal-600" },
    { value: "Fitness", icon: "💪", color: "from-orange-500 to-red-600" },
    { value: "Study", icon: "📚", color: "from-blue-500 to-indigo-600" },
    { value: "Work", icon: "💼", color: "from-purple-500 to-violet-600" },
    { value: "Personal", icon: "🌟", color: "from-pink-500 to-rose-600" }
  ];

  const selectedCategory = categories.find(cat => cat.value === category);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {!isExpanded ? (
        <motion.button
          onClick={() => setIsExpanded(true)}
          className="w-full p-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all transform hover:scale-[1.02] border border-purple-500/30"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-3 text-white">
            <div className="p-3 bg-white/20 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold">Add New Habit</h3>
              <p className="text-purple-100 text-sm">Start building a better you</p>
            </div>
          </div>
        </motion.button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-purple-500/30"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              ✨ Create New Habit
            </h3>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Drink 8 glasses of water, Read for 30 minutes..."
                className="w-full p-4 bg-gray-900/50 text-white placeholder-gray-400 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Category
              </label>
              <div className="grid grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      category === cat.value
                        ? `bg-gradient-to-r ${cat.color} border-white/50 text-white shadow-lg scale-105`
                        : "bg-gray-800/50 border-gray-600 text-gray-400 hover:border-purple-500/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-medium">{cat.value}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className={`flex-2 py-3 px-8 rounded-xl font-medium transition-all ${
                  name.trim()
                    ? `bg-gradient-to-r ${selectedCategory.color} text-white hover:scale-105 transform shadow-lg`
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {selectedCategory.icon} Create Habit
                </span>
              </button>
            </div>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

export default AddHabitForm;
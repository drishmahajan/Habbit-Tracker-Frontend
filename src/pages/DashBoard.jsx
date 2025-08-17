// Dashboard.jsx
import { useEffect, useState } from "react";
import AddHabitForm from "../Components/AddHabitForm";
import Calendar from "react-calendar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import 'react-calendar/dist/Calendar.css';
import '../index.css'

const Dashboard = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("streak");
    return saved ? JSON.parse(saved) : 0;
  });

  const [reminders, setReminders] = useState({});
  const [darkMode, setDarkMode] = useState(true);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("streak", JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const addHabit = (name, category, remindTime = "") => {
    const newHabit = {
      id: Date.now(),
      name,
      category,
      remindTime,
      progress: 0,
      completed: false,
      completedDates: [],
    };
    setHabits([newHabit, ...habits]);
  };

  const toggleHabit = (id) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === id) {
          const updated = {
            ...habit,
            completed: !habit.completed,
            completedDates: habit.completed
              ? habit.completedDates.filter(date => date !== today)
              : [...habit.completedDates, today],
            progress: habit.completed ? 0 : 100
          };
          setStreak((s) => updated.completed ? s + 1 : Math.max(s - 1, 0));
          return updated;
        }
        return habit;
      })
    );
  };

  const markProgress = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newProgress = Math.min(habit.progress + 20, 100);
        const completed = newProgress === 100;
        if (completed && !habit.completed) setStreak(s => s + 1);
        return {
          ...habit,
          progress: newProgress,
          completed,
          completedDates: completed
            ? [...new Set([...habit.completedDates, new Date().toISOString().split("T")[0]])]
            : habit.completedDates,
        };
      }
      return habit;
    }));
  };

  const setReminder = (id, time) => {
    setReminders(prev => ({ ...prev, [id]: time }));
    setHabits(habits.map(h =>
      h.id === id ? { ...h, remindTime: time } : h
    ));
  };

  const notifyHabit = (habitName) => {
    new Notification(`🔔 Reminder: ${habitName}`);
    new Audio("/notification.mp3").play();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      habits.forEach(habit => {
        const [h, m] = (habit.remindTime || "").split(":").map(Number);
        if (now.getHours() === h && now.getMinutes() === m && now.getSeconds() === 0) {
          notifyHabit(habit.name);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [habits]);

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const addNote = () => {
    if (note.trim()) {
      setNotes([...notes, { date: new Date().toISOString(), text: note }]);
      setNote("");
    }
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const resetHabits = () => {
    setHabits(habits.map(h => ({ ...h, progress: 0, completed: false })));
    setStreak(0);
  };

  const chartData = habits.map(habit => ({
    name: habit.name,
    completed: habit.completedDates.length,
    progress: habit.progress,
  }));

  const completedToday = habits.filter(h =>
    h.completedDates.includes(new Date().toISOString().split("T")[0])
  );

  const getBadge = (streak) => {
    if (streak >= 30) return { icon: "🏆", title: "Legend", color: "from-yellow-400 to-orange-500" };
    if (streak >= 15) return { icon: "🔥", title: "Fire Master", color: "from-red-400 to-pink-500" };
    if (streak >= 7) return { icon: "💪", title: "Streak Master", color: "from-purple-400 to-indigo-500" };
    if (streak >= 3) return { icon: "⚡", title: "Getting There", color: "from-green-400 to-teal-500" };
    return { icon: "🌱", title: "Newbie", color: "from-gray-400 to-gray-600" };
  };

  const completionRate = habits.length > 0 ? Math.round((completedToday.length / habits.length) * 100) : 0;

  const tileContent = ({ date }) => {
    const formatted = date.toISOString().split("T")[0];
    const marked = habits.some(h => h.completedDates.includes(formatted));
    return marked && <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mt-1 animate-pulse"></div>;
  };

  const categoryColors = {
    Health: "from-emerald-500 to-teal-600",
    Fitness: "from-orange-500 to-red-600", 
    Study: "from-blue-500 to-indigo-600",
    Work: "from-purple-500 to-violet-600",
    Personal: "from-pink-500 to-rose-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen transition-all duration-300 ${
        darkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white" 
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
        <div className="relative flex flex-col lg:flex-row justify-between items-center p-6 lg:p-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 lg:mb-0"
          >
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
              ⚡ Habit Forge
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Build your future, one habit at a time
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <button 
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:scale-105 transform transition-all shadow-lg hover:shadow-blue-500/30"
            >
              📊 Stats
            </button>
            <button 
              onClick={resetHabits} 
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium hover:scale-105 transform transition-all shadow-lg hover:shadow-red-500/30"
            >
              🔄 Reset
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:scale-105 transform transition-all shadow-lg hover:shadow-purple-500/30"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
          >
            <div className="text-center">
              <div className={`text-4xl mb-2 bg-gradient-to-r ${getBadge(streak).color} bg-clip-text text-transparent font-bold`}>
                {getBadge(streak).icon}
              </div>
              <h3 className="text-2xl font-bold text-orange-400 mb-1">Streak</h3>
              <p className="text-4xl font-bold">{streak}</p>
              <p className="text-sm mt-1 text-yellow-400">{getBadge(streak).title}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-1">Today</h3>
              <p className="text-4xl font-bold">{completedToday.length}/{habits.length}</p>
              <p className="text-sm mt-1 text-emerald-300">{completionRate}% Complete</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-1">Habits</h3>
              <p className="text-4xl font-bold">{habits.length}</p>
              <p className="text-sm mt-1 text-blue-300">Total Active</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={`${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">⏰</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-1">Time</h3>
              <p className="text-lg font-mono">{currentTime.toLocaleTimeString()}</p>
              <p className="text-sm mt-1 text-purple-300">{currentTime.toLocaleDateString()}</p>
            </div>
          </motion.div>
        </div>

        {/* Add Habit Form */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <AddHabitForm onAdd={addHabit} />
        </motion.div>

        {/* Stats Toggle Section */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Progress Chart */}
              <div className={`${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl`}>
                <h2 className="text-2xl font-bold text-pink-400 mb-6 flex items-center gap-2">
                  📊 Progress Overview
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke={darkMode ? "#ccc" : "#666"} />
                    <YAxis stroke={darkMode ? "#ccc" : "#666"} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                        border: "1px solid #8b5cf6",
                        borderRadius: "8px"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#8b5cf6" 
                      fillOpacity={1}
                      fill="url(#colorProgress)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Calendar */}
              <div className={`${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl`}>
                <h2 className="text-2xl font-bold text-pink-400 mb-6 flex items-center gap-2">
                  🗓️ Activity Calendar
                </h2>
                <Calendar 
                  value={selectedDate} 
                  onChange={setSelectedDate} 
                  tileContent={tileContent} 
                  className={`dark-theme-calendar w-full ${darkMode ? "text-white" : "text-black"}`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habits Grid */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className={`${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl`}
        >
          <h2 className="text-2xl font-bold text-pink-400 mb-6 flex items-center gap-2">
            📋 Your Habits
          </h2>
          
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                No habits yet! Add your first habit to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {habits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${darkMode ? "bg-gray-900/50" : "bg-gray-50"} rounded-xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-300"} hover:shadow-lg transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white">{habit.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[habit.category]} text-white mt-2`}>
                        {habit.category}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => markProgress(habit.id)}
                        className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-110 transform transition-all shadow-lg"
                        title="Add Progress"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => toggleHabit(habit.id)}
                        className={`p-2 rounded-lg ${habit.completed 
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
                          : "bg-gradient-to-r from-gray-500 to-gray-600"
                        } text-white hover:scale-110 transform transition-all shadow-lg`}
                        title="Toggle Complete"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={() => deleteHabit(habit.id)}
                        className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white hover:scale-110 transform transition-all shadow-lg"
                        title="Delete Habit"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <input
                    type="time"
                    value={habit.remindTime || ""}
                    onChange={(e) => setReminder(habit.id, e.target.value)}
                    className={`w-full p-2 rounded-lg mb-4 ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"} border`}
                    placeholder="Set reminder time"
                  />

                  <div className="relative">
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                      <motion.div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${habit.progress}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white">{habit.progress}% Complete</span>
                      {habit.completed && (
                        <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                          ✅ Completed
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Notes Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className={`${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl`}
        >
          <h2 className="text-2xl font-bold text-pink-400 mb-6 flex items-center gap-2">
            📝 Daily Notes
          </h2>
          
          <div className="flex gap-3 mb-6">
            <textarea
              className={`flex-1 p-4 rounded-xl ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-gray-50 text-black border-gray-300"} border resize-none`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your thoughts, goals, or reflections..."
              rows="3"
            />
            <button 
              onClick={addNote}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:scale-105 transform transition-all shadow-lg hover:shadow-purple-500/30"
            >
              Add Note
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notes.length === 0 ? (
              <p className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                No notes yet. Start documenting your journey!
              </p>
            ) : (
              notes.map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex justify-between items-start p-4 ${darkMode ? "bg-gray-900/50" : "bg-gray-100"} rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <div>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>{n.text}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                      📅 {new Date(n.date).toLocaleDateString()} • {new Date(n.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => deleteNote(i)}
                    className="ml-4 text-red-400 hover:text-red-600 hover:scale-110 transform transition-all"
                  >
                    ✕
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
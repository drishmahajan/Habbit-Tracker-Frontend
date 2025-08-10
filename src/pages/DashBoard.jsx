// Dashboard.jsx
import { useEffect, useState } from "react";
import AddHabitForm from "../Components/AddHabitForm";
import Calendar from "react-calendar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
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
  }));

  const completedToday = habits.filter(h =>
    h.completedDates.includes(new Date().toISOString().split("T")[0])
  );

  const getBadge = (streak) => {
    if (streak >= 30) return "🌟 Legend";
    if (streak >= 15) return "🔥 Pro";
    if (streak >= 7) return "💪 Streak Master";
    if (streak >= 3) return "⚡ Getting There";
    return "🌱 Newbie";
  };

  const tileContent = ({ date }) => {
    const formatted = date.toISOString().split("T")[0];
    const marked = habits.some(h => h.completedDates.includes(formatted));
    return marked && <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-1"></div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <div className="flex justify-between items-center p-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">⚡ Habit Tracker</h1>
        <div className="flex gap-4">
          <button onClick={resetHabits} className="px-4 py-2 rounded-full bg-red-600 text-white">🔄 Reset</button>
          <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2 rounded-full bg-purple-600 text-white">
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <AddHabitForm onAdd={addHabit} />

        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-pink-400">🔥 Streak</h2>
          <p className="text-5xl mt-2">{streak}</p>
          <p className="mt-1 text-yellow-300">{getBadge(streak)}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-pink-300 mb-4">📊 Progress Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#82ca9d" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-pink-300 mb-4">🗓 Calendar</h2>
          <Calendar value={selectedDate} onChange={setSelectedDate} tileContent={tileContent} className="dark-theme-calendar" />
        </div>

        <div className="text-center text-lg">
          Current Time: <span className="bg-black text-white px-2 py-1 rounded font-mono">{currentTime.toLocaleTimeString()}</span>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-pink-300 mb-4">✅ Today's Completed Habits</h2>
          {completedToday.length === 0
            ? <p className="text-gray-400">No habits completed yet.</p>
            : <ul className="list-disc pl-6 text-green-400">{completedToday.map(h => <li key={h.id}>{h.name}</li>)}</ul>
          }
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-pink-300 mb-4">📋 All Habits</h2>
          <ul className="space-y-4">
            {habits.map(habit => (
              <li key={habit.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{habit.name}</p>
                    <p className="text-sm text-purple-400">{habit.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => markProgress(habit.id)} className="bg-green-600 px-3 py-1 rounded text-white">+Progress</button>
                    <button onClick={() => toggleHabit(habit.id)} className="bg-blue-600 px-3 py-1 rounded text-white">Toggle</button>
                    <button onClick={() => deleteHabit(habit.id)} className="bg-red-600 px-3 py-1 rounded text-white">Delete</button>
                  </div>
                </div>
                <input
                  type="time"
                  value={habit.remindTime || ""}
                  onChange={(e) => setReminder(habit.id, e.target.value)}
                  className="text-black p-1 rounded"
                />
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full transition-all duration-300" style={{ width: `${habit.progress}%` }}></div>
                </div>
                <p className="text-sm text-white">{habit.progress}% Complete</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-pink-300 mb-4">📝 Notes</h2>
          <textarea
            className="w-full p-2 rounded bg-gray-900 text-white"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note..."
          />
          <button onClick={addNote} className="mt-2 px-4 py-2 bg-purple-600 text-white rounded">Add Note</button>
          <ul className="mt-4 space-y-2">
            {notes.map((n, i) => (
              <li key={i} className="text-sm text-gray-300 flex justify-between items-center">
                📌 {new Date(n.date).toLocaleDateString()} - {n.text}
                <button onClick={() => deleteNote(i)} className="ml-2 text-red-400 hover:text-red-600">✖</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

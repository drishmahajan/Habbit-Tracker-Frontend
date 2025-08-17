import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock useAuth hook for demonstration
const useAuth = () => ({
  user: { name: "John Doe", email: "john@example.com" }
});

// Mock toast for demonstration
const toast = {
  success: (message) => console.log("Success:", message)
};

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
    achievements: true
  });
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    timezone: "UTC",
    language: "English"
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    shareProgress: true,
    dataCollection: true
  });
  const [habits, setHabits] = useState({
    defaultReminder: "09:00",
    weekStart: "Monday",
    streakGoal: 30,
    autoReset: true
  });

  useEffect(() => {
    // In a real app, this would use localStorage
    console.log("Dark mode:", darkMode);
  }, [darkMode]);

  const tabs = [
    { id: "profile", name: "Profile", icon: "👤" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "habits", name: "Habits", icon: "🎯" },
    { id: "privacy", name: "Privacy", icon: "🔒" },
    { id: "appearance", name: "Appearance", icon: "🎨" }
  ];

  const handleSave = (section) => {
    toast.success(`${section} settings saved!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`min-h-screen transition-all duration-300 ${
        darkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white" 
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
        <div className="relative p-6 lg:p-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            ⚙️ Settings
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Customize your Habit Forge experience
          </p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            variants={itemVariants}
            className={`lg:col-span-1 ${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl h-fit`}
          >
            <h2 className="text-lg font-semibold mb-4 text-purple-400">Categories</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : `${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{tab.icon}</span>
                    {tab.name}
                  </span>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className={`${darkMode ? "bg-gray-800/50" : "bg-white/80"} backdrop-blur-sm rounded-2xl p-6 lg:p-8 border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-xl`}
              >
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl text-white">
                        👤
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-purple-400">Profile Settings</h2>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Manage your personal information</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className={`w-full p-3 rounded-xl border ${darkMode ? "bg-gray-900/50 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className={`w-full p-3 rounded-xl border ${darkMode ? "bg-gray-900/50 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Timezone
                        </label>
                        <select
                          value={profile.timezone}
                          onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                          className={`w-full p-3 rounded-xl border ${darkMode ? "bg-gray-900/50 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="PST">Pacific Time</option>
                          <option value="GMT">GMT</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Language
                        </label>
                        <select
                          value={profile.language}
                          onChange={(e) => setProfile({...profile, language: e.target.value})}
                          className={`w-full p-3 rounded-xl border ${darkMode ? "bg-gray-900/50 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleSave("Profile")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                    >
                      Save Profile
                    </motion.button>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl text-white">
                        🔔
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-blue-400">Notification Settings</h2>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Choose how you want to be notified</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? "bg-gray-900/50 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
                          <div>
                            <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {key === "email" && "Receive email notifications"}
                              {key === "push" && "Browser push notifications"}
                              {key === "reminders" && "Habit reminder notifications"}
                              {key === "achievements" && "Achievement and milestone alerts"}
                            </p>
                          </div>
                          <motion.button
                            onClick={() => setNotifications({...notifications, [key]: !value})}
                            whileTap={{ scale: 0.95 }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? "bg-blue-600" : "bg-gray-300"
                            }`}
                          >
                            <motion.span
                              animate={{ x: value ? 20 : 4 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                            />
                          </motion.button>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      onClick={() => handleSave("Notifications")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
                    >
                      Save Notifications
                    </motion.button>
                  </div>
                )}

                {/* Habits Settings */}
                {activeTab === "habits" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl text-white">
                        🎯
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-green-400">Habit Settings</h2>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Configure your habit tracking preferences</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Default Reminder Time
                        </label>
                        <input
                          type="time"
                          value={habits.defaultReminder}
                          onChange={(e) => setHabits({...habits, defaultReminder: e.target.value})}
                          className={`w-full p-3 rounded-xl border ${darkMode ? "bg-gray-900/50 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Week Starts On
                        </label>
                        <select
                          value={habits.weekStart}
                          onChange={(e) => setHabits({...habits, weekStart: e.target.value})}
                          className={`w-full p-3 rounded-xl border ${darkMode ? "bg-gray-900/50 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        >
                          <option value="Monday">Monday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Streak Goal (days)
                        </label>
                        <input
                          type="number"
                          value={habits.streakGoal}
                          onChange={(e) => setHabits({...habits, streakGoal: parseInt(e.target.value) || 30})}
                          className={`w-full p-3 rounded-xl border ${darkMode ? "bg-gray-900/50 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                          min="1"
                          max="365"
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Auto-Reset Daily
                        </label>
                        <div className="flex items-center mt-3">
                          <motion.button
                            onClick={() => setHabits({...habits, autoReset: !habits.autoReset})}
                            whileTap={{ scale: 0.95 }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              habits.autoReset ? "bg-green-600" : "bg-gray-300"
                            }`}
                          >
                            <motion.span
                              animate={{ x: habits.autoReset ? 20 : 4 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                            />
                          </motion.button>
                          <span className={`ml-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Reset habit progress at midnight
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleSave("Habits")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      Save Habit Settings
                    </motion.button>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-2xl text-white">
                        🔒
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-red-400">Privacy Settings</h2>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Control your data and privacy preferences</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(privacy).map(([key, value]) => (
                        <div key={key} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? "bg-gray-900/50 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
                          <div>
                            <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {key === "publicProfile" && "Make your profile visible to other users"}
                              {key === "shareProgress" && "Allow sharing of your progress with friends"}
                              {key === "dataCollection" && "Allow anonymous data collection for improvements"}
                            </p>
                          </div>
                          <motion.button
                            onClick={() => setPrivacy({...privacy, [key]: !value})}
                            whileTap={{ scale: 0.95 }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? "bg-red-600" : "bg-gray-300"
                            }`}
                          >
                            <motion.span
                              animate={{ x: value ? 20 : 4 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                            />
                          </motion.button>
                        </div>
                      ))}
                    </div>

                    <div className={`p-4 rounded-xl ${darkMode ? "bg-yellow-900/20 border border-yellow-700" : "bg-yellow-50 border border-yellow-200"}`}>
                      <h3 className="font-medium text-yellow-600 mb-2">⚠️ Data Management</h3>
                      <p className={`text-sm ${darkMode ? "text-yellow-300" : "text-yellow-700"} mb-4`}>
                        Manage your account data and privacy settings. These actions are permanent.
                      </p>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          Export Data
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleSave("Privacy")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all shadow-lg"
                    >
                      Save Privacy Settings
                    </motion.button>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white">
                        🎨
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-indigo-400">Appearance Settings</h2>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Customize how Habit Forge looks</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Theme Selection */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Theme</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <motion.button
                            onClick={() => setDarkMode(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              darkMode
                                ? "border-purple-500 bg-gray-800"
                                : "border-gray-300 bg-gray-50 hover:border-purple-300"
                            }`}
                          >
                            <div className="w-full h-20 bg-gradient-to-br from-gray-800 to-black rounded-lg mb-3"></div>
                            <h4 className="font-medium">Dark Mode</h4>
                            <p className="text-sm text-gray-500">Easy on the eyes</p>
                          </motion.button>

                          <motion.button
                            onClick={() => setDarkMode(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              !darkMode
                                ? "border-purple-500 bg-white"
                                : "border-gray-300 bg-gray-800 hover:border-purple-300"
                            }`}
                          >
                            <div className="w-full h-20 bg-gradient-to-br from-gray-50 to-white rounded-lg mb-3 border"></div>
                            <h4 className="font-medium">Light Mode</h4>
                            <p className="text-sm text-gray-500">Clean and bright</p>
                          </motion.button>
                        </div>
                      </div>

                      {/* Color Themes */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Accent Colors</h3>
                        <div className="grid grid-cols-6 gap-3">
                          {[
                            { name: "Purple", colors: "from-purple-500 to-pink-500" },
                            { name: "Blue", colors: "from-blue-500 to-cyan-500" },
                            { name: "Green", colors: "from-green-500 to-emerald-500" },
                            { name: "Orange", colors: "from-orange-500 to-red-500" },
                            { name: "Indigo", colors: "from-indigo-500 to-purple-500" },
                            { name: "Teal", colors: "from-teal-500 to-cyan-500" }
                          ].map((theme) => (
                            <motion.button
                              key={theme.name}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.colors} shadow-lg hover:shadow-xl transition-all`}
                              title={theme.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Display Options */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Display Options</h3>
                        <div className="space-y-4">
                          <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? "bg-gray-900/50 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
                            <div>
                              <h4 className="font-medium">Animations</h4>
                              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Enable smooth transitions and effects</p>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600"
                            >
                              <motion.span
                                animate={{ x: 20 }}
                                className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                              />
                            </motion.button>
                          </div>

                          <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? "bg-gray-900/50 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
                            <div>
                              <h4 className="font-medium">Compact Mode</h4>
                              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Show more content in less space</p>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300"
                            >
                              <motion.span
                                animate={{ x: 4 }}
                                className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                              />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleSave("Appearance")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      Save Appearance
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className={`mt-8 p-6 ${darkMode ? "bg-gray-800/30" : "bg-white/30"} backdrop-blur-sm rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              <p>Habit Forge v2.1.0 • Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Help & Support
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Feedback
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Floating Menu */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 rounded-full ${darkMode ? "bg-purple-600" : "bg-purple-500"} text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-xl`}
              title="Quick Actions"
            >
              ⚡
            </motion.button>
            
            {/* Quick action tooltip */}
            <div className={`absolute bottom-16 right-0 ${darkMode ? "bg-gray-800" : "bg-white"} px-3 py-2 rounded-lg shadow-lg border ${darkMode ? "border-gray-700" : "border-gray-200"} opacity-0 hover:opacity-100 transition-opacity pointer-events-none`}>
              <p className="text-sm whitespace-nowrap">Quick Settings</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Backup Indicator */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`fixed bottom-20 left-6 ${darkMode ? "bg-green-600/20" : "bg-green-100"} backdrop-blur-sm px-4 py-2 rounded-lg border ${darkMode ? "border-green-500/30" : "border-green-200"}`}
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className={darkMode ? "text-green-300" : "text-green-700"}>
              Auto-save enabled
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
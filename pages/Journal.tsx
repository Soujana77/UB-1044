import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  score: number;
  date: string;
}

const moods = [
  { emoji: "😊", label: "Happy", score: 2 },
  { emoji: "😌", label: "Calm", score: 1 },
  { emoji: "😔", label: "Sad", score: -1 },
  { emoji: "😡", label: "Angry", score: -2 },
  { emoji: "😴", label: "Tired", score: 0 },
];

const Journal = () => {
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("journalEntries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const handleSave = () => {
    if (!content.trim() || !selectedMood) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content,
      mood: selectedMood.emoji,
      score: selectedMood.score,
      date: new Date().toISOString(),
    };

    setEntries([newEntry, ...entries]);
    setContent("");
    setSelectedMood(null);
  };

  const weeklyData = entries
    .slice(0, 7)
    .reverse()
    .map(e => ({
      date: new Date(e.date).toLocaleDateString(),
      score: e.score,
    }));

  const averageScore =
    entries.length > 0
      ? (
          entries.reduce((acc, e) => acc + e.score, 0) /
          entries.length
        ).toFixed(2)
      : 0;

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Mental Wellness Report", 20, 20);
    doc.text(`Total Entries: ${entries.length}`, 20, 30);
    doc.text(`Average Mood Score: ${averageScore}`, 20, 40);
    doc.save("journal-report.pdf");
  };

  return (
    <div
      className={`min-h-screen p-10 transition-all duration-700 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
      }`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight">
            Emotion Intelligence Dashboard
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-white shadow-lg"
          >
            Toggle {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {[
            { label: "Total Entries", value: entries.length },
            { label: "Average Mood Score", value: averageScore },
            { label: "Last Mood", value: entries[0]?.mood || "-" },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-8 rounded-3xl backdrop-blur-lg shadow-2xl border transition-all duration-500 hover:scale-105 ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700"
                  : "bg-white/60 border-white/40"
              }`}
            >
              <p className="text-gray-400 mb-2">{item.label}</p>
              <h2 className="text-4xl font-bold text-indigo-500">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Weekly Trend Chart */}
        {entries.length > 0 && (
          <div
            className={`p-8 rounded-3xl mb-12 backdrop-blur-lg shadow-2xl border ${
              darkMode
                ? "bg-gray-800/60 border-gray-700"
                : "bg-white/70 border-white/40"
            }`}
          >
            <h2 className="mb-6 text-xl font-semibold">
              Weekly Mood Trend
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Entry Section */}
        <div
          className={`p-10 rounded-3xl shadow-2xl backdrop-blur-xl border transition-all duration-500 ${
            darkMode
              ? "bg-gray-800/60 border-gray-700"
              : "bg-white/70 border-white/40"
          }`}
        >
          <h2 className="text-xl font-semibold mb-6">
            New Entry
          </h2>

          <div className="flex gap-6 mb-8">
            {moods.map(mood => (
              <button
                key={mood.emoji}
                onClick={() => setSelectedMood(mood)}
                className={`w-14 h-14 rounded-2xl text-2xl transition-all duration-300 shadow-lg ${
                  selectedMood?.emoji === mood.emoji
                    ? "bg-indigo-600 text-white scale-125 shadow-indigo-500/50"
                    : darkMode
                    ? "bg-gray-700 hover:scale-110"
                    : "bg-white hover:scale-110"
                }`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value.slice(0, 300))
            }
            rows={5}
            placeholder="Write your thoughts..."
            className={`w-full p-6 rounded-2xl mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode
                ? "bg-gray-900 text-white"
                : "bg-white text-black"
            }`}
          />

          <div className="flex gap-6">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-all text-white px-10 py-3 rounded-xl shadow-xl"
            >
              Save Entry
            </button>

            {entries.length > 0 && (
              <button
                onClick={exportPDF}
                className="bg-green-600 hover:bg-green-700 transition text-white px-8 py-3 rounded-xl shadow-lg"
              >
                Export PDF
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Journal;
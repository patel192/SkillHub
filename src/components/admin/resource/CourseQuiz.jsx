import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CheckCircle,
  Circle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const CourseQuiz = () => {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    points: 1,
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:8000/questions/${courseId}`);
        const data = await res.json();
        setQuestions(data.data);
        if (data.data.length > 0) setSelectedQuestion(data.data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [courseId]);

  const handleAddQuestion = async () => {
    try {
      const res = await fetch(`http://localhost:8000/questions/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });
      const data = await res.json();
      setQuestions((prev) => [...prev, data]);
      setSelectedQuestion(data);
      setAdding(false);
      setNewQuestion({
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        points: 1,
      });
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading quiz...</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="w-1/4 p-4 flex flex-col border-r border-gray-700">
        <button
          onClick={() => setAdding(true)}
          className="mb-4 flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition"
        >
          <Plus size={18} /> Add Question
        </button>

        <div
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex justify-between items-center cursor-pointer mb-2 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
        >
          <h2 className="text-lg font-semibold">Quiz Questions</h2>
          {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        <AnimatePresence initial={false}>
          {dropdownOpen && (
            <motion.div
              key="quiz-list"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 space-y-2 overflow-y-auto pr-2"
            >
              {questions.map((q) => (
                <motion.div
                  key={q._id}
                  layout
                  whileHover={{ scale: 1.03, boxShadow: "0 0 10px #9333ea" }}
                  onClick={() => setSelectedQuestion(q)}
                  className={`p-3 rounded-lg cursor-pointer relative transition ${
                    selectedQuestion?._id === q._id
                      ? "bg-purple-600/80 shadow-lg shadow-purple-500/50"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <p className="truncate">{q.question}</p>
                  {selectedQuestion?._id === q._id && (
                    <motion.div
                      layoutId="activeQuiz"
                      className="absolute inset-0 rounded-lg ring-2 ring-purple-400"
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {adding ? (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-5 max-w-2xl mx-auto bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Add New Question
              </h2>
              <button
                onClick={() => setAdding(false)}
                className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter your question here..."
              value={newQuestion.question}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, question: e.target.value })
              }
              className="w-full p-4 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
            />

            <div className="space-y-3">
              {newQuestion.options.map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-700/70 p-3 rounded-lg hover:bg-gray-700 transition"
                >
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...newQuestion.options];
                      updated[i].text = e.target.value;
                      setNewQuestion({ ...newQuestion, options: updated });
                    }}
                    className="flex-1 bg-transparent outline-none p-2"
                  />
                  <label className="flex items-center gap-1 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={() => {
                        const updated = newQuestion.options.map((o, idx) => ({
                          ...o,
                          isCorrect: idx === i,
                        }));
                        setNewQuestion({ ...newQuestion, options: updated });
                      }}
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">Points</label>
              <input
                type="number"
                value={newQuestion.points}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, points: e.target.value })
                }
                className="w-28 p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="Points"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px #9333ea" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddQuestion}
              className="bg-gradient-to-r from-purple-600 to-cyan-400 py-3 px-6 rounded-xl font-semibold shadow-lg text-white transition"
            >
              Save Question
            </motion.button>
          </motion.div>
        ) : selectedQuestion ? (
          <motion.div
            key={selectedQuestion._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl mx-auto bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-4 text-purple-300">
              {selectedQuestion.question}
            </h2>
            <ul className="space-y-2">
              {selectedQuestion.options.map((opt) => (
                <li
                  key={opt._id || opt.text}
                  className={`flex items-center gap-3 p-2 rounded-md border transition ${
                    opt.isCorrect
                      ? "bg-green-900/40 border-green-500 text-green-400"
                      : "bg-gray-700/40 border-gray-600"
                  }`}
                >
                  {opt.isCorrect ? (
                    <CheckCircle size={18} className="text-green-400" />
                  ) : (
                    <Circle size={18} className="text-gray-400" />
                  )}
                  <span>{opt.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-400">
              Points: <span className="text-cyan-400">{selectedQuestion.points}</span>
            </p>
          </motion.div>
        ) : (
          <div className="text-gray-400">Select a question to view details</div>
        )}
      </main>
    </div>
  );
};

export default CourseQuiz;

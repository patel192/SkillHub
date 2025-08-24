import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ClipboardList, Trophy, Star } from "lucide-react";

export const LearningPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [learningOpen, setLearningOpen] = useState(true);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);

  const [points, setPoints] = useState(0);
  const [title, setTitle] = useState("Beginner");

  // 🎯 Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem(`quiz_${courseId}`));
    if (savedProgress) {
      setQuizAnswers(savedProgress.quizAnswers || {});
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex || 0);
      setPoints(savedProgress.points || 0);
    }
  }, [courseId]);

  // 📝 Save progress to localStorage
  const saveProgress = (newAnswers, newPoints, newIndex) => {
    localStorage.setItem(
      `quiz_${courseId}`,
      JSON.stringify({
        quizAnswers: newAnswers,
        points: newPoints,
        currentQuestionIndex: newIndex,
      })
    );
  };

  // 🏆 Title calculation
  useEffect(() => {
    if (points >= 100) setTitle("Master");
    else if (points >= 70) setTitle("Advanced");
    else if (points >= 30) setTitle("Intermediate");
    else setTitle("Beginner");
  }, [points]);

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:8000/lessons/${courseId}`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setLessons(data.data);
          if (data.data.length > 0) setSelectedLesson(data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`http://localhost:8000/questions/${courseId}`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setQuizQuestions(data.data);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, [courseId]);

  // Parse lesson content
  const parseContent = (content = "") => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let parts = [];
    let lastIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textPart = content.slice(lastIndex, match.index).trim();
        if (textPart) parts.push({ type: "note", text: textPart });
      }
      parts.push({
        type: "code",
        lang: match[1] || "javascript",
        text: match[2],
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      const textPart = content.slice(lastIndex).trim();
      if (textPart) parts.push({ type: "note", text: textPart });
    }
    return parts;
  };

  const handleQuizChange = (questionId, optionText) => {
    const newAnswers = { ...quizAnswers, [questionId]: optionText };
    setQuizAnswers(newAnswers);
    saveProgress(newAnswers, points, currentQuestionIndex);
  };

  const handleNextQuestion = (skip = false) => {
    const currentQ = quizQuestions[currentQuestionIndex];
    let newPoints = points;
    let newAnswers = { ...quizAnswers };

    if (!skip) {
      const userAnswer = quizAnswers[currentQ._id];
      if (userAnswer && userAnswer === currentQ.correctAnswer) {
        newPoints += 10;
        setPoints(newPoints);
      }
    } else {
      newAnswers[currentQ._id] = "Skipped";
    }

    const nextIndex = currentQuestionIndex + 1;
    setQuizAnswers(newAnswers);
    setCurrentQuestionIndex(nextIndex);
    saveProgress(newAnswers, newPoints, nextIndex);

    if (nextIndex >= quizQuestions.length) {
      handleSubmitQuiz(newAnswers, newPoints);
    }
  };

  const handleSubmitQuiz = (
    finalAnswers = quizAnswers,
    finalPoints = points
  ) => {
    const results = quizQuestions.map((q) => {
      const isCorrect = finalAnswers[q._id] === q.correctAnswer;
      return {
        ...q,
        userAnswer: finalAnswers[q._id] || null,
        isCorrect,
      };
    });

    const correctCount = results.filter((r) => r.isCorrect).length;

    setQuizResults({
      total: quizQuestions.length,
      correct: correctCount,
      details: results,
    });

    localStorage.removeItem(`quiz_${courseId}`); // clear progress once finished
  };

  const handleLessonNavigation = (direction) => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex((l) => l._id === selectedLesson._id);

    if (direction === "next" && currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
    }
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="flex h-screen bg-[#0d1117] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#161b22] border-r border-gray-700 overflow-y-auto">
        <div className="p-4 flex items-center gap-2 border-b border-gray-700">
          <motion.div
            animate={{ color: ["#facc15", "#22c55e", "#3b82f6", "#f43f5e"] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
          >
            <Trophy size={22} />
          </motion.div>
          <div>
            <p className="font-bold">{title}</p>
            <p className="text-sm text-gray-400">{points} pts</p>
          </div>
        </div>

        {/* Lessons Dropdown */}
        <div>
          <button
            onClick={() => setLearningOpen(!learningOpen)}
            className="w-full text-left px-4 py-2 font-semibold hover:bg-[#21262d] flex justify-between items-center"
          >
            <span className="flex items-center gap-2">
              <BookOpen size={18} />
              Learning
            </span>
            <span>{learningOpen ? "▲" : "▼"}</span>
          </button>
          {learningOpen && (
            <div className="pl-4">
              {lessons.map((lesson) => (
                <button
                  key={lesson._id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#21262d] ${
                    selectedLesson?._id === lesson._id ? "bg-[#30363d]" : ""
                  }`}
                >
                  {lesson.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quiz Dropdown */}
        {quizQuestions.length > 0 && (
          <div>
            <button
              onClick={() => setQuizOpen(!quizOpen)}
              className="w-full text-left px-4 py-2 font-semibold hover:bg-[#21262d] flex justify-between items-center"
            >
              <span className="flex items-center gap-2">
                <ClipboardList size={18} />
                Quiz
              </span>
              <span>{quizOpen ? "▲" : "▼"}</span>
            </button>
            {quizOpen && (
              <div className="pl-4">
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setQuizResults(null);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#21262d]"
                >
                  {currentQuestionIndex > 0 ? "Resume Quiz" : "Start Quiz"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Lesson Content */}
          {selectedLesson && !currentQuestion && (
            <motion.div
              key={selectedLesson._id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl font-bold mb-4">
                {selectedLesson.title}
              </h1>
              {parseContent(selectedLesson.content).map((part, idx) =>
                part.type === "note" ? (
                  <p
                    key={idx}
                    className="mb-4 leading-relaxed text-gray-200 whitespace-pre-line"
                  >
                    {part.text}
                  </p>
                ) : (
                  <SyntaxHighlighter
                    key={idx}
                    language={part.lang}
                    style={vscDarkPlus}
                    customStyle={{
                      backgroundColor: "#161b22",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    {part.text}
                  </SyntaxHighlighter>
                )
              )}

              <div className="flex justify-between mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-600 hover:to-gray-400 px-4 py-2 rounded disabled:opacity-50"
                  onClick={() => handleLessonNavigation("prev")}
                  disabled={
                    lessons.findIndex((l) => l._id === selectedLesson._id) === 0
                  }
                >
                  ⬅ Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 px-4 py-2 rounded disabled:opacity-50"
                  onClick={() => handleLessonNavigation("next")}
                  disabled={
                    lessons.findIndex((l) => l._id === selectedLesson._id) ===
                    lessons.length - 1
                  }
                >
                  Next ➡
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Quiz Content */}
          {currentQuestion && !selectedLesson && (
            <motion.div
              key={currentQuestion._id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold mb-4">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </h2>
              <p className="mb-4">{currentQuestion.question}</p>
              {currentQuestion.options.map((opt) => (
                <label key={opt._id} className="block mb-2">
                  <input
                    type="radio"
                    name={currentQuestion._id}
                    value={opt.text}
                    checked={quizAnswers[currentQuestion._id] === opt.text}
                    onChange={() =>
                      handleQuizChange(currentQuestion._id, opt.text)
                    }
                    className="mr-2"
                  />
                  {opt.text}
                </label>
              ))}

              {!quizResults && (
                <div className="flex gap-4 mt-6">
                  {/* Next / Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      background: [
                        "linear-gradient(90deg, #3b82f6, #6366f1)",
                        "linear-gradient(90deg, #6366f1, #8b5cf6)",
                        "linear-gradient(90deg, #3b82f6, #6366f1)",
                      ],
                      boxShadow: [
                        "0 0 10px #3b82f6",
                        "0 0 20px #6366f1",
                        "0 0 10px #3b82f6",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                    className="px-6 py-2 rounded-lg text-white font-semibold"
                    onClick={() => handleNextQuestion(false)}
                  >
                    {currentQuestionIndex === quizQuestions.length - 1
                      ? "🚀 Submit Quiz"
                      : "➡ Next Question"}
                  </motion.button>

                  {/* Skip Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      background: [
                        "linear-gradient(90deg, #f59e0b, #f97316)",
                        "linear-gradient(90deg, #f97316, #f59e0b)",
                      ],
                      boxShadow: [
                        "0 0 10px #f59e0b",
                        "0 0 20px #f97316",
                        "0 0 10px #f59e0b",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                    className="px-6 py-2 rounded-lg text-white font-semibold"
                    onClick={() => handleNextQuestion(true)}
                  >
                    ⏭ Skip
                  </motion.button>
                </div>
              )}

              {quizResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6"
                >
                  <p className="text-lg">
                    ✅ You got {quizResults.correct}/{quizResults.total}{" "}
                    correct!
                  </p>
                  <motion.div
                    className="flex items-center gap-2 mt-2"
                    animate={{
                      color: ["#facc15", "#22c55e", "#3b82f6", "#f43f5e"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                  >
                    <Star size={20} />
                    <span>
                      Current Title: <strong>{title}</strong> ({points} pts)
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

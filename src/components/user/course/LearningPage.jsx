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

  // 🎯 Title calculation
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
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionText }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    const results = quizQuestions.map((q) => {
      const isCorrect = quizAnswers[q._id] === q.correctAnswer;
      if (isCorrect) setPoints((prev) => prev + 10);
      return {
        ...q,
        userAnswer: quizAnswers[q._id] || null,
        isCorrect,
      };
    });

    const correctCount = results.filter((r) => r.isCorrect).length;

    setQuizResults({
      total: quizQuestions.length,
      correct: correctCount,
      details: results,
    });
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
              <motion.div
                animate={{
                  color: ["#60a5fa", "#34d399", "#fbbf24", "#f87171"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              >
                <BookOpen size={18} />
              </motion.div>
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
                <motion.div
                  animate={{
                    color: ["#f472b6", "#a78bfa", "#38bdf8", "#facc15"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  <ClipboardList size={18} />
                </motion.div>
                Quiz
              </span>
              <span>{quizOpen ? "▲" : "▼"}</span>
            </button>
            {quizOpen && (
              <div className="pl-4">
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setCurrentQuestionIndex(0);
                    setQuizResults(null);
                    setQuizAnswers({});
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#21262d]"
                >
                  Start Quiz
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
              <h1 className="text-2xl font-bold mb-4">{selectedLesson.title}</h1>
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
                <button
                  onClick={() => handleLessonNavigation("prev")}
                  disabled={
                    lessons.findIndex((l) => l._id === selectedLesson._id) === 0
                  }
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-50"
                >
                  ⬅ Previous
                </button>
                <button
                  onClick={() => handleLessonNavigation("next")}
                  disabled={
                    lessons.findIndex((l) => l._id === selectedLesson._id) ===
                    lessons.length - 1
                  }
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded disabled:opacity-50"
                >
                  Next ➡
                </button>
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
                    disabled={quizResults !== null}
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
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  {currentQuestionIndex === quizQuestions.length - 1
                    ? "Submit Quiz"
                    : "Next Question ➡"}
                </button>
              )}

              {quizResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <p className="text-lg">
                    ✅ You got {quizResults.correct}/{quizResults.total} correct!
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

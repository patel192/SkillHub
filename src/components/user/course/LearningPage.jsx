// LearningPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Clock,
  BookOpen,
  HelpCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { AchievementPopup } from "../../../../utils/AchievementPopup";

export const LearningPage = () => {
  const { courseId } = useParams();
  const userId = localStorage.getItem("userId");
  const achievementThresholds = [10, 50, 100];
  const token = localStorage.getItem("token");
  const canvasRef = useRef(null);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [learningOpen, setLearningOpen] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [points, setPoints] = useState(0);

  const [enrollmentId, setEnrollmentId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [learningTime, setLearningTime] = useState(0);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  const handleClosePopup = () => setUnlockedAchievement(null);

  const getStoredTime = () =>
    parseInt(
      localStorage.getItem(`learningTime_${userId}_${courseId}`) || "0",
      10
    );
  const saveStoredTime = (time) =>
    localStorage.setItem(`learningTime_${userId}_${courseId}`, time.toString());

  // Firework Animation
  const triggerFirework = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 - 2,
        life: 100,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.x += p.dx;
        p.y += p.dy;
        p.life -= 2;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(idx, 1);
      });
      if (particles.length > 0) requestAnimationFrame(animate);
    };
    animate();
  };

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get(`/lessons/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data.data)) {
          setLessons(res.data.data);
          if (res.data.data.length > 0) setSelectedLesson(res.data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Fetch enrollment
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const res = await axios.get(`/enrollment/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.data && Array.isArray(res.data.data)) {
          const enrollment = res.data.data.find(
            (e) => e.courseId._id === courseId
          );
          if (enrollment) {
            setEnrollmentId(enrollment._id);
            setCompletedLessons(enrollment.completedLessons || []);
          }
        }
      } catch (err) {
        console.error("Error fetching enrollment:", err);
      }
    };
    fetchEnrollment();
  }, [courseId, userId]);

  // Fetch quiz and progress
  useEffect(() => {
    const fetchQuizAndProgress = async () => {
      try {
        const resQ = await axios.get(`/questions/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(resQ.data.data)) setQuizQuestions(resQ.data.data);

        const resP = await axios.get(`/progress/${userId}/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resP.data.success && resP.data.data) {
          setCurrentQuestionIdx(resP.data.data.currentQuestionIdx || 0);
          setQuizAnswers(resP.data.data.quizAnswers || {});
          setPoints(resP.data.data.points || 0);
        } else {
          setCurrentQuestionIdx(0);
          setQuizAnswers({});
          setPoints(0);
        }
      } catch (err) {
        console.error("Error fetching quiz/progress:", err);
      }
    };
    fetchQuizAndProgress();
  }, [courseId, userId]);

  // Track learning time
  useEffect(() => {
    setLearningTime(getStoredTime());
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const sessionTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      setLearningTime(getStoredTime() + sessionTime);
    }, 1000);

    const handleBeforeUnload = () => {
      const sessionTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      saveStoredTime(getStoredTime() + sessionTime);
      clearInterval(intervalRef.current);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [courseId, userId]);

  // Save progress
  const saveProgress = async (newIdx, newAnswers, newPoints) => {
    try {
      await axios.post(
        "/progress/save",
        {
          userId,
          courseId,
          currentQuestionIdx: newIdx,
          quizAnswers: newAnswers,
          points: newPoints,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  // Handle quiz answer change
  const handleQuizChange = (questionId, optionText) => {
    setQuizAnswers((prev) => {
      const updated = { ...prev, [questionId]: optionText };
      saveProgress(currentQuestionIdx, updated, points);
      return updated;
    });
  };

  // Handle submit quiz
  const handleSubmitQuiz = async () => {
    const currentQ = quizQuestions[currentQuestionIdx];
    if (!currentQ) return;

    const selected = quizAnswers[currentQ._id];
    if (!selected) return;

    const isCorrect = currentQ.options.some(
      (o) => o.text === selected && o.isCorrect
    );
    const newPoints = isCorrect ? points + (currentQ.points || 1) : points;
    if (isCorrect) triggerFirework();
    setPoints(newPoints);

    if (currentQuestionIdx < quizQuestions.length - 1) {
      const newIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(newIdx);
      saveProgress(newIdx, quizAnswers, newPoints);
    } else {
      setQuizResults(true);
      saveProgress(currentQuestionIdx, quizAnswers, newPoints);
    }
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-white relative font-sans">
      <AchievementPopup
        achievement={unlockedAchievement}
        onClose={handleClosePopup}
      />
      <canvas
        ref={canvasRef}
        width={window?.innerWidth || 1200}
        height={window?.innerHeight || 800}
        className="absolute top-0 left-0 pointer-events-none"
      />

      {/* Sidebar */}
      <motion.div
        className="w-64 bg-[#161b22] border-r border-gray-700 overflow-y-auto shadow-lg"
        initial={{ x: -120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="p-4 text-lg font-bold border-b border-gray-700 text-indigo-400 tracking-wide">
          Course Menu
        </h2>

        {/* Time spent */}
        <motion.div
          className="flex items-center gap-2 p-4 text-sm text-gray-300 border-b border-gray-700"
        >
          <Clock className="w-4 h-4 text-green-400 animate-pulse" />
          Time Spent:{" "}
          <span className="font-semibold text-white">
            {Math.floor(learningTime / 60)}m {learningTime % 60}s
          </span>
        </motion.div>

        {/* Lessons Dropdown */}
        <motion.button
          onClick={() => setLearningOpen(!learningOpen)}
          className="w-full text-left px-4 py-2 font-semibold flex justify-between items-center bg-[#161b22] hover:bg-[#1f2937] transition-colors duration-300 border-l-4 border-transparent hover:border-indigo-500"
        >
          <span className="flex items-center gap-2 text-indigo-400 font-medium">
            <BookOpen className="animate-pulse" /> Lessons
          </span>
          {learningOpen ? (
            <ChevronUp className="text-indigo-400" />
          ) : (
            <ChevronDown className="text-indigo-400" />
          )}
        </motion.button>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={learningOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pl-4 overflow-hidden"
        >
          {lessons.map((lesson) => (
            <motion.button
              key={lesson._id}
              onClick={() => {
                setSelectedLesson(lesson);
                setQuizResults(null);
              }}
              className={`block w-full text-left px-4 py-2 text-sm rounded-md mb-1 border-l-4 transition-all duration-300 ${
                selectedLesson?._id === lesson._id
                  ? "bg-[#21262d] border-indigo-500"
                  : "hover:bg-[#1f2937] border-transparent"
              }`}
            >
              {lesson.title}
              {completedLessons.includes(lesson._id) && (
                <span className="ml-2 text-green-400">✔</span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Quiz Dropdown */}
        <motion.button
          onClick={() => setQuizOpen(!quizOpen)}
          disabled={quizQuestions.length === 0}
          className={`w-full text-left px-4 py-2 font-semibold flex justify-between items-center transition-colors duration-300 ${
            quizQuestions.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#1f2937]"
          }`}
        >
          <span className="flex items-center gap-2 text-yellow-400 font-medium">
            <HelpCircle className="animate-spin" />
            {quizQuestions.length === 0 ? "No Quiz Available" : "Quiz"}
          </span>
          {quizOpen ? (
            <ChevronUp className="text-yellow-400" />
          ) : (
            <ChevronDown className="text-yellow-400" />
          )}
        </motion.button>

        {/* Quiz Question List */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={quizOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pl-4 overflow-hidden"
        >
          {quizQuestions.map((q, idx) => (
            <motion.button
              key={q._id}
              onClick={() => {
                setCurrentQuestionIdx(idx);
                setQuizResults(null);
                setSelectedLesson(null);
              }}
              className={`block w-full text-left px-4 py-2 text-sm rounded-md mb-1 border-l-4 transition-all duration-300 ${
                currentQuestionIdx === idx
                  ? "bg-[#21262d] border-yellow-500"
                  : "hover:bg-[#1f2937] border-transparent"
              }`}
            >
              Question {idx + 1}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div className="flex-1 p-6 overflow-y-auto relative z-10">
        {/* Show lesson */}
        {selectedLesson && !quizOpen && (
          <div className="p-4 rounded-xl bg-[#161b22] border border-gray-700">
            <h1 className="text-2xl font-bold mb-4 text-indigo-400">
              {selectedLesson.title}
            </h1>
            <p className="text-gray-200 whitespace-pre-line">
              {selectedLesson.content}
            </p>
          </div>
        )}

        {/* Show quiz */}
        {quizOpen && quizQuestions[currentQuestionIdx] && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-blue-400">
              Question {currentQuestionIdx + 1} of {quizQuestions.length}
            </h2>
            <p className="mb-6 text-lg font-semibold text-gray-200">
              {quizQuestions[currentQuestionIdx].question}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {quizQuestions[currentQuestionIdx].options.map((opt) => {
                const isSelected =
                  quizAnswers[quizQuestions[currentQuestionIdx]._id] === opt.text;
                return (
                  <button
                    key={opt._id}
                    onClick={() =>
                      handleQuizChange(
                        quizQuestions[currentQuestionIdx]._id,
                        opt.text
                      )
                    }
                    className={`w-full text-left px-6 py-4 rounded-xl border ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                        : "bg-[#161b22] hover:bg-[#1f2937] text-gray-200 border-gray-600"
                    }`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-bold"
              >
                Submit & Next
              </button>
            </div>

            <p className="mt-6 text-lg font-bold text-yellow-400">
              Points: {points}
            </p>

            {quizResults && (
              <div className="mt-6 p-6 rounded-xl bg-green-800 text-white">
                Quiz Completed! Final Score: {points}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

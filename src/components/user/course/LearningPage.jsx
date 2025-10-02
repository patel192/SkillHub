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
  Book,
} from "lucide-react";
import { AchievementPopup } from "../../../../utils/AchievementPopup";

export const LearningPage = () => {
  const token = localStorage.getItem("token");
  const { courseId } = useParams();
  const userId = localStorage.getItem("userId");
  const achievementThresholds = [10, 50, 100];

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

  // Fetch enrollment + completed lessons
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const res = await axios.get(`/enrollment/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          const enrollment = data.data.find((e) => e.courseId._id === courseId);
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
        const dataQ = await resQ.json();
        if (Array.isArray(dataQ.data)) setQuizQuestions(dataQ.data);

        const resP = await axios.get(`/progress/${userId}/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataP = await resP.json();
        if (dataP.success && dataP.data) {
          setCurrentQuestionIdx(dataP.data.currentQuestionIdx || 0);
          setQuizAnswers(dataP.data.quizAnswers || {});
          setPoints(dataP.data.points || 0);
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

  const saveProgress = async (newIdx, newAnswers, newPoints) => {
    try {
      const payload = {
        userId,
        courseId,
        currentQuestionIdx: newIdx,
        quizAnswers: newAnswers,
        points: newPoints,
      };
      await axios.post(
        "/progress/save",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        {
          body: JSON.stringify(payload),
        }
      );
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  const parseContent = (content = "") => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match,
      parts = [],
      lastIndex = 0;
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
    setQuizAnswers((prev) => {
      const updated = { ...prev, [questionId]: optionText };
      saveProgress(currentQuestionIdx, updated, points);
      return updated;
    });
  };

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

    if (
      achievementThresholds.includes(newPoints) &&
      !achievementThresholds.includes(points)
    ) {
      try {
        const res = await axios.post(`/check/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.newlyUnlocked.length > 0)
          setUnlockedAchievement(data.newlyUnlocked[0]);
      } catch (err) {
        console.error("Error checking achievements:", err);
      }
    }
  };

  const handleMarkComplete = async (lessonId) => {
    if (!enrollmentId) return;
    try {
      const res = await axios.patch(
        `/enrollment/mark-complete/${enrollmentId}/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setCompletedLessons(data.completedLessons || []);
    } catch (err) {
      console.error("Error marking lesson complete:", err);
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

        <motion.div
          className="flex items-center gap-2 p-4 text-sm text-gray-300 border-b border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
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
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
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
          animate={
            learningOpen
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.4 }}
          className="pl-4 overflow-hidden"
        >
          {lessons.map((lesson, idx) => (
            <motion.button
              key={lesson._id}
              onClick={() => {
                setSelectedLesson(lesson);
                setQuizOpen(false);
                setQuizResults(null);
              }}
              className={`block w-full text-left px-4 py-2 text-sm rounded-md mb-1 border-l-4 transition-all duration-300 ${
                selectedLesson?._id === lesson._id
                  ? "bg-[#21262d] border-indigo-500 shadow-glow"
                  : "hover:bg-[#1f2937] border-transparent"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow:
                  selectedLesson?._id === lesson._id
                    ? "0 0 10px 2px #7f5af0"
                    : "none",
              }}
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
          onClick={() =>
            quizQuestions.length > 0 &&
            (setQuizOpen(!quizOpen),
            setSelectedLesson(null),
            setQuizResults(null))
          }
          disabled={quizQuestions.length === 0}
          className={`w-full text-left px-4 py-2 font-semibold flex justify-between items-center transition-colors duration-300 ${
            quizQuestions.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#1f2937]"
          }`}
          whileHover={quizQuestions.length === 0 ? {} : { scale: 1.03 }}
          whileTap={quizQuestions.length === 0 ? {} : { scale: 0.97 }}
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
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 p-6 overflow-y-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {selectedLesson && !quizOpen && (
          <motion.div
            key={selectedLesson._id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="p-4 rounded-xl bg-[#161b22] shadow-glow border border-gray-700"
          >
            <h1 className="text-2xl font-bold mb-4 text-indigo-400">
              {selectedLesson.title}
            </h1>
            {parseContent(selectedLesson.content).map((part, idx) =>
              part.type === "note" ? (
                <motion.p
                  key={idx}
                  className="mb-4 leading-relaxed text-gray-200 whitespace-pre-line"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {part.text}
                </motion.p>
              ) : (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <SyntaxHighlighter
                    language={part.lang}
                    style={vscDarkPlus}
                    customStyle={{
                      backgroundColor: "#161b22",
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "0 0 10px #7f5af0",
                    }}
                  >
                    {part.text}
                  </SyntaxHighlighter>
                </motion.div>
              )
            )}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 12px #22c55e" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMarkComplete(selectedLesson._id)}
              className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow-glow"
            >
              Mark as Completed
            </motion.button>
          </motion.div>
        )}

        {quizOpen && quizQuestions[currentQuestionIdx] && (
          <motion.div
            key={quizQuestions[currentQuestionIdx]._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <div className="w-full bg-gray-700 h-2 rounded mb-6 overflow-hidden">
              <motion.div
                className="h-2 rounded bg-gradient-to-r from-blue-400 to-blue-600 shadow-glow"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((currentQuestionIdx + 1) / quizQuestions.length) * 100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <h2 className="text-xl font-bold mb-4 text-blue-400">
              Question {currentQuestionIdx + 1} of {quizQuestions.length}
            </h2>
            <p className="mb-6 text-lg font-semibold text-gray-200">
              {quizQuestions[currentQuestionIdx].question}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {quizQuestions[currentQuestionIdx].options.map((opt) => {
                const isSelected =
                  quizAnswers[quizQuestions[currentQuestionIdx]._id] ===
                  opt.text;
                return (
                  <motion.button
                    key={opt._id}
                    whileHover={{ scale: 1.03, boxShadow: "0 0 12px #7f5af0" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      handleQuizChange(
                        quizQuestions[currentQuestionIdx]._id,
                        opt.text
                      )
                    }
                    className={`w-full text-left px-6 py-4 rounded-xl shadow-md border transition-colors duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-transparent shadow-glow"
                        : "bg-[#161b22] hover:bg-[#1f2937] text-gray-200 border-gray-600"
                    }`}
                  >
                    {opt.text}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: "0 0 12px #22c55e" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitQuiz}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-bold shadow-glow"
              >
                Submit & Next
              </motion.button>
            </div>

            <p className="mt-6 text-lg font-bold text-yellow-400">
              Points: {points}
            </p>

            {quizResults && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6 p-6 rounded-xl bg-green-800 text-white shadow-glow"
              >
                Quiz Completed! Final Score: {points}
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

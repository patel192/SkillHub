// LearningPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { BookOpen, HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import { AchievementPopup } from "../../../../utils/AchievementPopup"; // import it

export const LearningPage = () => {
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  const { courseId } = useParams();
  const achievementThresholds = [10, 50, 100];
  // 🔑 Replace with the real logged-in user's ObjectId string
  const userId = localStorage.getItem("userId");

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [learningOpen, setLearningOpen] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({}); // { [questionId]: "optionText" }
  const [quizResults, setQuizResults] = useState(null);
  const [points, setPoints] = useState(0);

  // learning time
 const [learningTime, setLearningTime] = useState(0);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const canvasRef = useRef(null);
  const handleClosePopup = () => {
    setUnlockedAchievement(null); // hide the popup
  };
const getStoredTime = () => {
    const key = `learningTime_${userId}_${courseId}`;
    return parseInt(localStorage.getItem(key) || "0", 10);
  };
  const saveStoredTime = (time) => {
    const key = `learningTime_${userId}_${courseId}`;
    localStorage.setItem(key, time.toString());
  };
  // Firework effect
  const triggerFirework = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const particles = [];

    const createParticles = (x, y) => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x,
          y,
          dx: Math.random() * 4 - 2,
          dy: Math.random() * 4 - 2,
          life: 100,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        });
      }
    };

    createParticles(canvas.width / 2, canvas.height / 2);

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
        const res = await fetch(`http://localhost:8000/lessons/${courseId}`);
        const data = await res.json();
        console.log("🔹 Lessons Response:", data);
        if (Array.isArray(data.data)) {
          setLessons(data.data);
          if (data.data.length > 0) setSelectedLesson(data.data[0]);
        }
      } catch (err) {
        console.error("❌ Error fetching lessons:", err);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Fetch quiz + progress
  useEffect(() => {
    const fetchQuizAndProgress = async () => {
      try {
        // Quiz
        const resQ = await fetch(`http://localhost:8000/questions/${courseId}`);
        const dataQ = await resQ.json();
        console.log("🔹 Quiz Questions Response:", dataQ);
        if (Array.isArray(dataQ.data)) setQuizQuestions(dataQ.data);

        // Progress
        const resP = await fetch(
          `http://localhost:8000/progress/${userId}/${courseId}`
        );
        const dataP = await resP.json();
        console.log("🔹 Progress Response:", dataP);

        if (dataP.success && dataP.data) {
          setCurrentQuestionIdx(dataP.data.currentQuestionIdx || 0);
          // quizAnswers from backend map → object
          setQuizAnswers(dataP.data.quizAnswers || {});
          setPoints(dataP.data.points || 0);
        } else {
          // Reset if no progress yet
          setCurrentQuestionIdx(0);
          setQuizAnswers({});
          setPoints(0);
        }
      } catch (err) {
        console.error("❌ Error fetching quiz/progress:", err);
      }
    };
    fetchQuizAndProgress();
  }, [courseId, userId]);
 useEffect(() => {
    // Load saved time
    setLearningTime(getStoredTime());

    // Start
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setLearningTime(getStoredTime() + sessionTime);
    }, 1000);

    // Stop & Save on unload
    const handleBeforeUnload = () => {
      const endTime = Date.now();
      const sessionTime = Math.floor((endTime - startTimeRef.current) / 1000);
      const total = getStoredTime() + sessionTime;
      saveStoredTime(total);
      clearInterval(intervalRef.current);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [courseId, userId])
  // Save progress to backend
  const saveProgress = async (newIdx, newAnswers, newPoints) => {
    try {
      const payload = {
        userId,
        courseId,
        currentQuestionIdx: newIdx,
        quizAnswers: newAnswers, // object: { [questionId]: "optionText" }
        points: newPoints,
      };
      console.log("🔹 Saving Progress Payload:", payload);

      const res = await fetch("http://localhost:8000/progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🔹 Save Progress Response:", data);
      if (!data.success) {
        console.warn("⚠️ Progress not saved:", data.error);
      }
    } catch (err) {
      console.error("❌ Error saving progress:", err);
    }
  };

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

  // Handle quiz answer change
  const handleQuizChange = (questionId, optionText) => {
    console.log("🔹 Answer Selected:", { questionId, optionText });
    setQuizAnswers((prev) => {
      const updated = { ...prev, [questionId]: optionText };
      // Save answer as soon as it's chosen
      saveProgress(currentQuestionIdx, updated, points);
      return updated;
    });
  };

  // Submit current quiz question
  const handleSubmitQuiz = async () => {
    const currentQ = quizQuestions[currentQuestionIdx];
    if (!currentQ) return;

    const selected = quizAnswers[currentQ._id];
    if (!selected) {
      console.warn("⚠️ No answer selected for this question");
      return;
    }

    const isCorrect = currentQ.options.some(
      (o) => o.text === selected && o.isCorrect
    );

    let newPoints = points;
    if (isCorrect) {
      newPoints = points + (currentQ.points || 1);
      console.log("✅ Correct! New Points:", newPoints);
      setPoints(newPoints);
      triggerFirework();
    } else {
      console.log("❌ Wrong answer, points stay:", points);
    }

    // Save progress as before
    if (currentQuestionIdx < quizQuestions.length - 1) {
      const newIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(newIdx);
      saveProgress(newIdx, quizAnswers, newPoints);
    } else {
      setQuizResults(true);
      saveProgress(currentQuestionIdx, quizAnswers, newPoints);
    }

    // 🚀 Check achievements ONLY when reaching threshold
    if (
      achievementThresholds.includes(newPoints) &&
      !achievementThresholds.includes(points) // prevents duplicate call
    ) {
      try {
        const res = await fetch(`http://localhost:8000/check/${userId}`, {
          method: "POST",
        });
        const data = await res.json();

        if (data.success && data.newlyUnlocked.length > 0) {
          console.log("🏆 New Achievements Unlocked:", data.newlyUnlocked);
          setUnlockedAchievement(data.newlyUnlocked[0]); // show popup
        }
      } catch (err) {
        console.error("❌ Error checking achievements:", err);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#0d1117] text-white relative">
      <AchievementPopup
        achievement={unlockedAchievement}
        onClose={handleClosePopup}
      />
      <canvas
        ref={canvasRef}
        width={typeof window !== "undefined" ? window.innerWidth : 1200}
        height={typeof window !== "undefined" ? window.innerHeight : 800}
        className="absolute top-0 left-0 pointer-events-none"
      />

      {/* Sidebar */}
      <div className="w-64 bg-[#161b22] border-r border-gray-700 overflow-y-auto">
        <h2 className="p-4 text-lg font-bold border-b border-gray-700">
          Course Menu
        </h2>
        {/* ⏱ Show Learning Time */}
        <div className="flex items-center gap-2 p-4 text-sm text-gray-300 border-b border-gray-700">
          <Clock className="w-4 h-4 text-green-400" />
          Time Spent:{" "}
          <span className="font-semibold text-white">
            {Math.floor(learningTime / 60)}m {learningTime % 60}s
          </span>
        </div>

        {/* Lessons Dropdown */}
        <button
          onClick={() => setLearningOpen(!learningOpen)}
          className="w-full text-left px-4 py-2 font-semibold hover:bg-[#21262d] flex justify-between items-center"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="text-blue-400 animate-pulse" /> Lessons
          </span>
          {learningOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
        {learningOpen && (
          <div className="pl-4">
            {lessons.map((lesson) => (
              <button
                key={lesson._id}
                onClick={() => {
                  console.log("🔹 Switching to Lesson:", lesson._id);
                  setSelectedLesson(lesson);
                  setQuizOpen(false);
                  setQuizResults(null);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#21262d] ${
                  selectedLesson?._id === lesson._id ? "bg-[#30363d]" : ""
                }`}
              >
                {lesson.title}
              </button>
            ))}
          </div>
        )}

        {/* Quiz Dropdown */}
        <button
          onClick={() => {
            if (quizQuestions.length > 0) {
              console.log("🔹 Toggling Quiz Section");
              setQuizOpen(!quizOpen);
              setSelectedLesson(null);
              setQuizResults(null);
            }
          }}
          disabled={quizQuestions.length === 0}
          className={`w-full text-left px-4 py-2 font-semibold flex justify-between items-center ${
            quizQuestions.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#21262d]"
          }`}
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="text-yellow-400 animate-spin" />
            {quizQuestions.length === 0 ? "No Quiz Available" : "Quiz"}
          </span>
          {quizOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto relative z-10">
        {/* Lesson Content */}
        {selectedLesson && !quizOpen && (
          <motion.div
            key={selectedLesson._id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
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
          </motion.div>
        )}

        {/* Quiz Content */}
        {quizOpen && quizQuestions[currentQuestionIdx] && (
          <motion.div
            key={quizQuestions[currentQuestionIdx]._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className="mt-8"
          >
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-2 rounded mb-6">
              <motion.div
                className="h-2 rounded bg-gradient-to-r from-blue-400 to-blue-600"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((currentQuestionIdx + 1) / quizQuestions.length) * 100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <h2 className="text-xl font-bold mb-4 text-blue-300">
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleQuizChange(
                        quizQuestions[currentQuestionIdx]._id,
                        opt.text
                      )
                    }
                    className={`w-full text-left px-6 py-4 rounded-xl shadow-md border transition-colors duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-transparent"
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
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitQuiz}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-bold shadow-lg animate-pulse"
              >
                Submit & Next
              </motion.button>
            </div>

            <p className="mt-6 text-lg font-bold text-yellow-400">
              ⭐ Points: {points}
            </p>

            {quizResults && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6 p-6 rounded-xl bg-green-800 text-white shadow-lg"
              >
                🎉 Quiz Completed! Final Score: {points}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

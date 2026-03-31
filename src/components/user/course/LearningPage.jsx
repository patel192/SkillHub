import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../context/AuthContext";
import {
  Clock,
  BookOpen,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Play,
  Trophy,
  ArrowLeft,
  MoreVertical,
  Timer,
  Target,
  Award,
  ChevronRight,
} from "lucide-react";

import { AchievementPopup } from "../../../../utils/AchievementPopup";

// ==========================================
// DESIGN TOKENS (Matching MyCourses Theme)
// ==========================================
const C = {
  brand: "#16A880",
  brandDark: "#0D7A5F",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  bg: "#0A0F0D",
  surface: "#111814",
  surface2: "#182219",
  surface3: "#1E2B22",
  border: "rgba(22,168,128,0.15)",
  borderHov: "rgba(22,168,128,0.35)",
  text: "#E8F5F0",
  textMuted: "#7A9E8E",
  textDim: "#3D5C4E",
  error: "#F87171",
};

export const LearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const canvasRef = useRef(null);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [learningOpen, setLearningOpen] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [points, setPoints] = useState(0);

  const [completedLessons, setCompletedLessons] = useState([]);

  const [learningTime, setLearningTime] = useState(0);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  const handleClosePopup = () => setUnlockedAchievement(null);

  const getStoredTime = () =>
    parseInt(localStorage.getItem(`learningTime_${userId}_${courseId}`) || "0");

  const saveStoredTime = (time) =>
    localStorage.setItem(`learningTime_${userId}_${courseId}`, time.toString());

  // --------------------------
  // Fetch lessons
  // --------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonsRes = await apiClient.get(`/lessons/${courseId}`);

        if (Array.isArray(lessonsRes.data.data)) {
          setLessons(lessonsRes.data.data);
          if (lessonsRes.data.data.length > 0) {
            setSelectedLesson(lessonsRes.data.data[0]);
          }
        }

        const quizRes = await apiClient.get(`/questions/${courseId}`);

        if (Array.isArray(quizRes.data.data)) {
          setQuizQuestions(quizRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching learning data:", err);
      }
    };

    fetchData();
  }, [courseId]);

  // --------------------------
  // Time tracking
  // --------------------------
  useEffect(() => {
    setLearningTime(getStoredTime());
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const sessionTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000,
      );
      setLearningTime(getStoredTime() + sessionTime);
    }, 1000);

    const beforeUnload = () => {
      const sessionTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000,
      );
      saveStoredTime(getStoredTime() + sessionTime);
      clearInterval(intervalRef.current);
    };

    window.addEventListener("beforeunload", beforeUnload);

    return () => beforeUnload();
  }, []);

  // --------------------------
  // Quiz submission
  // --------------------------
  const handleSubmitQuiz = () => {
    const q = quizQuestions[currentQuestionIdx];
    if (!q) return;

    const selected = quizAnswers[q._id];
    if (!selected) return;

    const isCorrect = q.options.some((o) => o.text === selected && o.isCorrect);

    if (isCorrect) {
      setPoints((prev) => prev + (q.points || 1));
    }

    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setQuizResults(true);
    }
  };

  // --------------------------
  // Parse lesson content blocks
  // --------------------------
  const parseContent = (content) => {
    const blocks = [];
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let last = 0;
    let match;

    while ((match = regex.exec(content))) {
      if (match.index > last) {
        blocks.push({
          type: "text",
          content: content.slice(last, match.index),
        });
      }
      blocks.push({
        type: "code",
        lang: match[1] || "text",
        content: match[2],
      });
      last = regex.lastIndex;
    }

    if (last < content.length) {
      blocks.push({ type: "text", content: content.slice(last) });
    }

    return blocks;
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const progress =
    lessons.length > 0
      ? Math.round((completedLessons.length / lessons.length) * 100)
      : 0;

  return (
    <div className="flex h-screen" style={{ background: C.bg, color: C.text }}>
      {/* Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 pointer-events-none z-50"
      />

      {/* Achievement Popup */}
      <AchievementPopup
        achievement={unlockedAchievement}
        onClose={handleClosePopup}
      />

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-80 flex flex-col overflow-hidden"
        style={{
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
        }}
      >
        {/* Header */}
        <div className="p-5 border-b" style={{ borderColor: C.border }}>
          <button
            onClick={() => navigate(`/user/course/${courseId}`)}
            className="flex items-center gap-2 text-sm mb-4 transition-colors hover:text-white"
            style={{ color: C.textMuted }}
          >
            <ArrowLeft size={16} />
            Back to Course
          </button>
          <h2
            className="text-xl font-bold tracking-wide"
            style={{ color: C.text, fontFamily: "Fraunces, serif" }}
          >
            Course Content
          </h2>
        </div>

        {/* Stats */}
        <div
          className="p-4 grid grid-cols-2 gap-3 border-b"
          style={{ borderColor: C.border }}
        >
          <div
            className="p-3 rounded-xl flex items-center gap-3"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${C.brand}20` }}
            >
              <Timer size={18} style={{ color: C.brand }} />
            </div>
            <div>
              <div className="text-xs" style={{ color: C.textDim }}>
                Time
              </div>
              <div className="font-semibold text-sm" style={{ color: C.text }}>
                {formatTime(learningTime)}
              </div>
            </div>
          </div>
          <div
            className="p-3 rounded-xl flex items-center gap-3"
            style={{ background: C.surface2, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${C.accent}20` }}
            >
              <Trophy size={18} style={{ color: C.accent }} />
            </div>
            <div>
              <div className="text-xs" style={{ color: C.textDim }}>
                Points
              </div>
              <div className="font-semibold text-sm" style={{ color: C.text }}>
                {points}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: C.textMuted }}>Progress</span>
            <span style={{ color: C.brand }} className="font-semibold">
              {progress}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: C.surface2 }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${C.brand}, ${C.brandLight})`,
              }}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* LESSONS */}
          <button
            onClick={() => setLearningOpen(!learningOpen)}
            className="w-full px-5 py-4 flex justify-between items-center text-left transition-all"
            style={{
              background: learningOpen ? C.surface2 : "transparent",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span
              className="font-semibold flex items-center gap-3"
              style={{ color: learningOpen ? C.brand : C.text }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: learningOpen ? `${C.brand}20` : C.surface2,
                }}
              >
                <BookOpen
                  size={16}
                  style={{ color: learningOpen ? C.brand : C.textMuted }}
                />
              </div>
              Lessons
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: C.surface2, color: C.textMuted }}
              >
                {lessons.length}
              </span>
            </span>
            <motion.div
              animate={{ rotate: learningOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={18} style={{ color: C.textMuted }} />
            </motion.div>
          </button>

          <AnimatePresence>
            {learningOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {lessons.map((l, idx) => {
                  const isSelected = selectedLesson?._id === l._id;
                  const isCompleted = completedLessons.includes(l._id);

                  return (
                    <motion.button
                      key={l._id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedLesson(l)}
                      className="w-full px-5 py-3 text-left text-sm flex items-center gap-3 transition-all group"
                      style={{
                        background: isSelected ? C.surface2 : "transparent",
                        borderLeft: `3px solid ${isSelected ? C.brand : "transparent"}`,
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isCompleted
                            ? C.brand
                            : isSelected
                              ? `${C.brand}30`
                              : C.surface2,
                          border: `1px solid ${isCompleted ? C.brand : isSelected ? C.brand : C.border}`,
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={14} style={{ color: C.bg }} />
                        ) : (
                          <span
                            style={{
                              color: isSelected ? C.brand : C.textDim,
                              fontSize: "10px",
                            }}
                          >
                            {idx + 1}
                          </span>
                        )}
                      </div>
                      <span
                        className="flex-1 truncate"
                        style={{ color: isSelected ? C.text : C.textMuted }}
                      >
                        {l.title}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Play
                            size={14}
                            style={{ color: C.brand }}
                            fill={C.brand}
                          />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* QUIZ */}
          <button
            onClick={() => setQuizOpen(!quizOpen)}
            className="w-full px-5 py-4 flex justify-between items-center text-left transition-all"
            style={{
              background: quizOpen ? C.surface2 : "transparent",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <span
              className="font-semibold flex items-center gap-3"
              style={{ color: quizOpen ? C.accent : C.text }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: quizOpen ? `${C.accent}20` : C.surface2 }}
              >
                <Target
                  size={16}
                  style={{ color: quizOpen ? C.accent : C.textMuted }}
                />
              </div>
              Quiz
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: C.surface2, color: C.textMuted }}
              >
                {quizQuestions.length}
              </span>
            </span>
            <motion.div
              animate={{ rotate: quizOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={18} style={{ color: C.textMuted }} />
            </motion.div>
          </button>

          <AnimatePresence>
            {quizOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {quizQuestions.map((q, idx) => {
                  const isCurrent = currentQuestionIdx === idx;
                  const isAnswered = quizAnswers[q._id];

                  return (
                    <motion.button
                      key={q._id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className="w-full px-5 py-3 text-left text-sm flex items-center gap-3 transition-all"
                      style={{
                        background: isCurrent ? C.surface2 : "transparent",
                        borderLeft: `3px solid ${isCurrent ? C.accent : "transparent"}`,
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium"
                        style={{
                          background: isAnswered
                            ? isCurrent
                              ? `${C.accent}30`
                              : C.surface3
                            : isCurrent
                              ? `${C.accent}30`
                              : C.surface2,
                          border: `1px solid ${isAnswered ? C.accent : isCurrent ? C.accent : C.border}`,
                          color: isCurrent
                            ? C.accent
                            : isAnswered
                              ? C.accent
                              : C.textDim,
                        }}
                      >
                        {isAnswered ? <CheckCircle2 size={12} /> : idx + 1}
                      </div>
                      <span
                        className="flex-1 truncate"
                        style={{ color: isCurrent ? C.text : C.textMuted }}
                      >
                        Question {idx + 1}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-8" style={{ background: C.bg }}>
        {/* LESSON CONTENT */}
        <AnimatePresence mode="wait">
          {selectedLesson && (
            <motion.div
              key={selectedLesson._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${C.brand}20`,
                      color: C.brand,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    Lesson{" "}
                    {lessons.findIndex((l) => l._id === selectedLesson._id) + 1}{" "}
                    of {lessons.length}
                  </span>
                  <span style={{ color: C.textDim }}>•</span>
                  <span style={{ color: C.textMuted }} className="text-sm">
                    {selectedLesson.duration || "10 min read"}
                  </span>
                </div>
                <h1
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: C.text, fontFamily: "Fraunces, serif" }}
                >
                  {selectedLesson.title}
                </h1>
                <div
                  className="h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, ${C.brand}, transparent)`,
                  }}
                />
              </div>

              {/* Content */}
              <div className="space-y-6">
                {parseContent(selectedLesson.content).map((block, idx) =>
                  block.type === "text" ? (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <p
                        className="text-base leading-relaxed whitespace-pre-line"
                        style={{ color: C.textMuted }}
                      >
                        {block.content}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="rounded-2xl overflow-hidden"
                      style={{ border: `1px solid ${C.border}` }}
                    >
                      <div
                        className="px-4 py-2 text-xs font-medium flex items-center gap-2"
                        style={{ background: C.surface2, color: C.textMuted }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: C.brand }}
                        />
                        {block.lang}
                      </div>
                      <SyntaxHighlighter
                        language={block.lang}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          background: C.surface,
                          fontSize: "14px",
                          lineHeight: "1.6",
                        }}
                      >
                        {block.content}
                      </SyntaxHighlighter>
                    </motion.div>
                  ),
                )}
              </div>

              {/* Navigation */}
              <div
                className="mt-12 flex items-center justify-between pt-6"
                style={{ borderTop: `1px solid ${C.border}` }}
              >
                <button
                  onClick={() => {
                    const currentIdx = lessons.findIndex(
                      (l) => l._id === selectedLesson._id,
                    );
                    if (currentIdx > 0)
                      setSelectedLesson(lessons[currentIdx - 1]);
                  }}
                  disabled={
                    lessons.findIndex((l) => l._id === selectedLesson._id) === 0
                  }
                  className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all disabled:opacity-30"
                  style={{
                    background: C.surface,
                    color: C.textMuted,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <ChevronRight size={18} className="rotate-180" />
                  Previous
                </button>

                <button
                  onClick={() => {
                    const currentIdx = lessons.findIndex(
                      (l) => l._id === selectedLesson._id,
                    );
                    if (currentIdx < lessons.length - 1) {
                      setSelectedLesson(lessons[currentIdx + 1]);
                    }
                  }}
                  disabled={
                    lessons.findIndex((l) => l._id === selectedLesson._id) ===
                    lessons.length - 1
                  }
                  className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all disabled:opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                    color: C.bg,
                  }}
                >
                  Next Lesson
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QUIZ */}
        <AnimatePresence>
          {quizQuestions[currentQuestionIdx] && quizOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto mt-8"
            >
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                {/* Quiz Header */}
                <div
                  className="px-8 py-6 border-b"
                  style={{
                    borderColor: C.border,
                    background: `linear-gradient(135deg, ${C.accent}20, transparent)`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: `${C.accent}30` }}
                      >
                        <Award size={24} style={{ color: C.accent }} />
                      </div>
                      <div>
                        <h2
                          className="text-xl font-bold"
                          style={{ color: C.text }}
                        >
                          Question {currentQuestionIdx + 1}
                        </h2>
                        <p style={{ color: C.textMuted }} className="text-sm">
                          of {quizQuestions.length} questions
                        </p>
                      </div>
                    </div>
                    <div
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ background: C.surface2, color: C.accent }}
                    >
                      +{quizQuestions[currentQuestionIdx].points || 1} pts
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: C.surface2 }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%`,
                      }}
                      className="h-full rounded-full"
                      style={{ background: C.accent }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="p-8">
                  <p className="text-lg mb-8" style={{ color: C.text }}>
                    {quizQuestions[currentQuestionIdx].question}
                  </p>

                  <div className="space-y-3">
                    {quizQuestions[currentQuestionIdx].options.map(
                      (opt, idx) => {
                        const selected =
                          quizAnswers[quizQuestions[currentQuestionIdx]._id] ===
                          opt.text;

                        return (
                          <motion.button
                            key={opt._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() =>
                              setQuizAnswers((prev) => ({
                                ...prev,
                                [quizQuestions[currentQuestionIdx]._id]:
                                  opt.text,
                              }))
                            }
                            className="w-full px-6 py-4 rounded-xl text-left transition-all flex items-center gap-4 group"
                            style={{
                              background: selected
                                ? `${C.accent}20`
                                : C.surface2,
                              border: `2px solid ${selected ? C.accent : C.border}`,
                            }}
                          >
                            <div
                              className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                              style={{
                                borderColor: selected ? C.accent : C.border,
                                background: selected ? C.accent : "transparent",
                              }}
                            >
                              {selected && (
                                <CheckCircle2
                                  size={14}
                                  style={{ color: C.bg }}
                                />
                              )}
                            </div>
                            <span
                              style={{ color: selected ? C.text : C.textMuted }}
                            >
                              {opt.text}
                            </span>
                          </motion.button>
                        );
                      },
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitQuiz}
                    disabled={
                      !quizAnswers[quizQuestions[currentQuestionIdx]._id]
                    }
                    className="mt-8 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${C.accent}, #FBBF24)`,
                      color: C.bg,
                      boxShadow: `0 4px 20px ${C.accent}40`,
                    }}
                  >
                    {currentQuestionIdx === quizQuestions.length - 1 ? (
                      <>
                        Complete Quiz <Trophy size={20} />
                      </>
                    ) : (
                      <>
                        Next Question <ChevronRight size={20} />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LearningPage;

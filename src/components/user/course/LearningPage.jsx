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
  CheckCircle2,
} from "lucide-react";

import { AchievementPopup } from "../../../../utils/AchievementPopup";

export const LearningPage = () => {
  const { courseId } = useParams();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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
        const lessonsRes = await axios.get(`/lessons/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(lessonsRes.data.data)) {
          setLessons(lessonsRes.data.data);
          if (lessonsRes.data.data.length > 0) {
            setSelectedLesson(lessonsRes.data.data[0]);
          }
        }

        const quizRes = await axios.get(`/questions/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
      const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setLearningTime(getStoredTime() + sessionTime);
    }, 1000);

    const beforeUnload = () => {
      const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
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
        blocks.push({ type: "text", content: content.slice(last, match.index) });
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white relative">

      {/* Fireworks */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Achievement Popup */}
      <AchievementPopup achievement={unlockedAchievement} onClose={handleClosePopup} />

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-72 bg-[#111827]/70 backdrop-blur-xl border-r border-white/10 overflow-y-auto"
      >
        <h2 className="px-5 py-4 text-xl font-semibold tracking-wide text-indigo-300 border-b border-white/10">
          Course Navigation
        </h2>

        {/* TIME */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2 text-sm text-gray-300">
          <Clock size={16} className="text-green-400" />
          Time Spent:
          <span className="font-semibold text-white">
            {Math.floor(learningTime / 60)}m {learningTime % 60}s
          </span>
        </div>

        {/* LESSONS */}
        <button
          onClick={() => setLearningOpen(!learningOpen)}
          className="w-full px-5 py-3 flex justify-between items-center text-left bg-[#111827]/70 hover:bg-[#1f2937] transition"
        >
          <span className="text-indigo-300 font-semibold flex items-center gap-2">
            <BookOpen size={18} /> Lessons
          </span>
          {learningOpen ? (
            <ChevronUp className="text-indigo-300" />
          ) : (
            <ChevronDown className="text-indigo-300" />
          )}
        </button>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: learningOpen ? "auto" : 0 }}
          className="overflow-hidden"
        >
          {lessons.map((l) => (
            <button
              key={l._id}
              onClick={() => setSelectedLesson(l)}
              className={`w-full px-6 py-3 text-left text-sm border-l-4 transition-all ${
                selectedLesson?._id === l._id
                  ? "bg-[#1e1b4b]/50 border-indigo-500 text-white"
                  : "border-transparent hover:bg-[#1f2937]"
              }`}
            >
              {l.title}
            </button>
          ))}
        </motion.div>

        {/* QUIZ */}
        <button
          onClick={() => setQuizOpen(!quizOpen)}
          className="w-full px-5 py-3 flex justify-between items-center text-left bg-[#111827]/70 hover:bg-[#1f2937] transition mt-4"
        >
          <span className="text-yellow-300 font-semibold flex items-center gap-2">
            <HelpCircle size={18} /> Quiz
          </span>
          {quizOpen ? (
            <ChevronUp className="text-yellow-300" />
          ) : (
            <ChevronDown className="text-yellow-300" />
          )}
        </button>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: quizOpen ? "auto" : 0 }}
          className="overflow-hidden"
        >
          {quizQuestions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => setCurrentQuestionIdx(idx)}
              className={`w-full px-6 py-3 text-left text-sm border-l-4 transition ${
                currentQuestionIdx === idx
                  ? "bg-[#1e1b4b]/50 border-yellow-500 text-white"
                  : "border-transparent hover:bg-[#1f2937]"
              }`}
            >
              Question {idx + 1}
            </button>
          ))}
        </motion.div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* LESSON CONTENT */}
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111827]/70 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl"
          >
            <h1 className="text-3xl font-bold text-indigo-300 mb-6">
              {selectedLesson.title}
            </h1>

            {parseContent(selectedLesson.content).map((block, idx) =>
              block.type === "text" ? (
                <p key={idx} className="text-gray-200 leading-relaxed mb-4 whitespace-pre-line">
                  {block.content}
                </p>
              ) : (
                <SyntaxHighlighter
                  key={idx}
                  language={block.lang}
                  style={vscDarkPlus}
                  className="rounded-xl my-4"
                >
                  {block.content}
                </SyntaxHighlighter>
              )
            )}
          </motion.div>
        )}

        {/* QUIZ */}
        {quizQuestions[currentQuestionIdx] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-[#111827]/70 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">
              Question {currentQuestionIdx + 1} / {quizQuestions.length}
            </h2>

            <p className="text-lg text-gray-200 mb-6">
              {quizQuestions[currentQuestionIdx].question}
            </p>

            <div className="grid gap-4">
              {quizQuestions[currentQuestionIdx].options.map((opt) => {
                const selected =
                  quizAnswers[quizQuestions[currentQuestionIdx]._id] === opt.text;

                return (
                  <button
                    key={opt._id}
                    onClick={() =>
                      setQuizAnswers((prev) => ({
                        ...prev,
                        [quizQuestions[currentQuestionIdx]._id]: opt.text,
                      }))
                    }
                    className={`w-full px-5 py-4 rounded-xl text-left text-sm border transition-all ${
                      selected
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-none"
                        : "bg-[#1f2937] border border-gray-600 hover:bg-[#374151]"
                    }`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmitQuiz}
              className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-black font-bold shadow-lg"
            >
              Submit
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

export const CourseLessons = ({ courseId: propCourseId }) => {
  const params = useParams();
  const courseId = propCourseId || params.courseId;
  const token = localStorage.getItem("token");
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [expandedList, setExpandedList] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/lessons/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data ?? [];
      const sorted = data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setLessons(sorted);
      if (sorted.length > 0 && !selected) setSelected(sorted[0]);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (lesson) => {
    setSelected(lesson);
    setTimeout(() => {
      const el = document.getElementById(`lesson-${lesson._id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const handleAddLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.content.trim()) {
      toast.error("Please provide title and content");
      return;
    }
    setAdding(true);
    try {
      const payload = {
        title: newLesson.title.trim(),
        content: newLesson.content.trim(),
        courseId,
      };
      const res = await axios.post("/lessons", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const added = res.data?.data;
      setLessons((p) => [...p, added]);
      setNewLesson({ title: "", content: "" });
      setOpenAdd(false);
      toast.success("Lesson added");
      setTimeout(() => setSelected(added), 150);
    } catch (err) {
      console.error("Add lesson failed:", err);
      toast.error("Failed to add lesson");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    setDeletingId(lessonId);
    try {
      await axios.delete(`/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons((p) => p.filter((l) => l._id !== lessonId));
      toast.success("Lesson deleted");
      if (selected && String(selected._id) === String(lessonId)) {
        setSelected(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete lesson");
    } finally {
      setDeletingId(null);
    }
  };

  const parseContent = (content = "") => {
    // Split content into code blocks and markdown
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    const parts = [];
    let last = 0;
    while ((match = regex.exec(content)) !== null) {
      if (match.index > last) {
        const text = content.slice(last, match.index).trim();
        if (text) parts.push({ type: "markdown", text });
      }
      parts.push({ type: "code", lang: match[1] || "text", text: match[2] });
      last = regex.lastIndex;
    }
    if (last < content.length) {
      const text = content.slice(last).trim();
      if (text) parts.push({ type: "markdown", text });
    }
    return parts;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white">
        <div className="animate-pulse text-gray-300">Loading lessons...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-96 border-r border-gray-800 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Lessons</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenAdd(true)}
              className="flex items-center gap-2 px-3 py-1 rounded bg-purple-600 hover:bg-purple-700"
            >
              <PlusCircle size={16} /> Add
            </button>
            <button
              onClick={() => setExpandedList((s) => !s)}
              className="p-2 rounded bg-gray-800 hover:bg-gray-700"
            >
              {expandedList ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>
        </div>

        <div className="relative pl-6" ref={listRef}>
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-500 to-cyan-400 rounded" />
          <AnimatePresence initial={false}>
            {expandedList &&
              lessons.map((l, idx) => {
                const isSel =
                  selected && String(selected._id) === String(l._id);
                return (
                  <motion.div
                    key={l._id}
                    id={`lesson-${l._id}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.18, delay: idx * 0.03 }}
                    className={`relative mb-6 pl-6 cursor-pointer`}
                    onClick={() => handleSelect(l)}
                  >
                    <div
                      className={`absolute left-0 top-0 w-3 h-3 rounded-full border-2 ${
                        isSel
                          ? "bg-purple-500 border-cyan-300"
                          : "bg-gray-800 border-gray-600"
                      }`}
                    />
                    <div
                      className={`p-3 rounded-md ${
                        isSel
                          ? "bg-gradient-to-r from-purple-700 to-cyan-700 shadow-lg shadow-purple-500/50"
                          : "hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div
                            className={`font-semibold ${
                              isSel ? "text-white" : "text-gray-200"
                            }`}
                          >
                            {l.title}
                          </div>
                          <div className="text-xs mt-1 text-gray-400">
                            {new Date(l.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLesson(l._id);
                          }}
                          disabled={deletingId === l._id}
                          className="p-2 rounded bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {lessons.length === 0 && (
            <div className="text-sm text-gray-400 mt-4">
              No lessons yet — add one using the Add button.
            </div>
          )}
        </div>
      </aside>

      {/* Viewer */}
      <main className="flex-1 p-8 overflow-y-auto">
        {!selected ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="text-3xl font-semibold text-gray-200">
              Select a lesson
            </div>
            <div className="text-gray-400">
              or click Add to create your first lesson
            </div>
            <button
              onClick={() => setOpenAdd(true)}
              className="mt-4 px-6 py-2 rounded bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <PlusCircle /> Add Lesson
            </button>
          </div>
        ) : (
          <motion.div
            key={selected._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {selected.title}
                </h1>
                <div className="text-sm text-gray-400 mt-1">
                  Published {new Date(selected.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {parseContent(selected.content).map((part, i) =>
                part.type === "markdown" ? (
                  <motion.div
                    key={`${selected._id}-md-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="bg-gray-800/80 p-6 rounded-lg shadow prose prose-invert max-w-none whitespace-pre-wrap"
                  >
                    <ReactMarkdown>{part.text}</ReactMarkdown>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${selected._id}-code-${i}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="relative rounded-lg overflow-hidden shadow"
                  >
                    <SyntaxHighlighter
                      language={part.lang || "text"}
                      style={vscDarkPlus}
                      showLineNumbers
                      customStyle={{ margin: 0, borderRadius: 8 }}
                    >
                      {part.text}
                    </SyntaxHighlighter>
                    <button
                      onClick={() => handleCopy(part.text)}
                      className="absolute top-2 right-2 bg-gray-700/80 hover:bg-purple-700 p-1 rounded transition"
                      title="Copy code"
                    >
                      <Copy size={16} />
                    </button>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* Add Lesson Modal */}
      <AnimatePresence>
        {openAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-gray-900 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Add Lesson</h3>
                <button
                  onClick={() => setOpenAdd(false)}
                  className="p-2 rounded bg-gray-800"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  value={newLesson.title}
                  onChange={(e) =>
                    setNewLesson((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Lesson title"
                  className="w-full p-3 rounded bg-gray-800 text-white"
                />
                <textarea
                  value={newLesson.content}
                  onChange={(e) =>
                    setNewLesson((p) => ({ ...p, content: e.target.value }))
                  }
                  rows={10}
                  placeholder={`Notes text and code blocks using triple backticks.\nExample:\nThis is a note.\n\`\`\`html\n<p>Hello</p>\n\`\`\``}
                  className="w-full p-3 rounded bg-gray-800 text-white font-mono"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setNewLesson({ title: "", content: "" })}
                    className="px-4 py-2 rounded bg-gray-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleAddLesson}
                    disabled={adding}
                    className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700"
                  >
                    {adding ? "Adding..." : "Add Lesson"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Menu,
  ArrowLeft,
  Layout,
  BookOpen,
  Zap,
  Save,
  Eye,
  Edit3,
  Layers,
  Globe,
  Activity,
  Clock,
  Code2,
  Type,
  Plus,
  GripVertical,
  ChevronRight,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { Spinner } from "../../../utils/Spinner";

const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  accent: "var(--accent)",
  success: "#10B981",
  error: "var(--error)",
  surface: "var(--surface)",
  surface2: "var(--surface2)",
  border: "var(--border)",
};

export const CourseLessons = ({ courseId: propCourseId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const courseId = propCourseId || params.courseId;
  const { token, loading: authLoading } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isBuildMode, setIsBuildMode] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  // Block-based editor state
  const [lessonTitle, setLessonTitle] = useState("");
  const [blocks, setBlocks] = useState([
    { id: Date.now(), type: "text", value: "", lang: "javascript" },
  ]);
  const [bulkData, setBulkData] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    if (!token || authLoading) return;
    fetchInitialData();
  }, [courseId, token, authLoading]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch Course Title for Context
      const courseRes = await apiClient.get(`/course/${courseId}`);
      setCourseTitle(courseRes.data?.data?.title || "Course");

      // Fetch Lessons
      const res = await apiClient.get(`/lessons/${courseId}`);
      const data = res.data?.data ?? [];
      const sorted = data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      setLessons(sorted);
      if (sorted.length > 0) setSelected(sorted[0]);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Resource sync failed");
    } finally {
      setLoading(false);
    }
  };

  // Serialize blocks into the markdown string format
  const serializeBlocks = (bList) => {
    return bList
      .map((b) => {
        if (b.type === "code")
          return `\`\`\`${b.lang || "bash"}\n${b.value}\n\`\`\``;
        return b.value;
      })
      .join("\n\n");
  };

  const handleAddLesson = async () => {
    const content = serializeBlocks(blocks);
    if (!lessonTitle.trim() || !content.trim()) {
      toast.error("Provide both title and at least one content block");
      return;
    }
    setAdding(true);
    const toastId = toast.loading("Deploying new module...");
    try {
      const payload = {
        title: lessonTitle.trim(),
        content: content.trim(),
        courseId,
      };
      const res = await apiClient.post("/lessons", payload);
      const added = res.data?.data;
      setLessons((p) => [...p, added]);
      setLessonTitle("");
      setBlocks([
        { id: Date.now(), type: "text", value: "", lang: "javascript" },
      ]);
      setIsBuildMode(false);
      setSelected(added);
      toast.success("Module deployed successfully", { id: toastId });
    } catch (err) {
      toast.error("Deployment failed", { id: toastId });
    } finally {
      setAdding(false);
    }
  };
  const handleEditLesson = (lesson) => {
    setLessonTitle(lesson.title);

    // Convert content back to blocks
    const parts = lesson.content.split("\n\n");

    const parsedBlocks = parts.map((p) => {
      if (p.startsWith("```")) {
        const lines = p.split("\n");
        const lang = lines[0].replace("```", "") || "javascript";
        const value = lines.slice(1, -1).join("\n");

        return {
          id: Date.now() + Math.random(),
          type: "code",
          lang,
          value,
        };
      }

      return {
        id: Date.now() + Math.random(),
        type: "text",
        value: p,
        lang: "javascript",
      };
    });

    setBlocks(parsedBlocks);
    setEditingLessonId(lesson._id);
    setIsBuildMode(true);
  };
  const handleUpdateLesson = async () => {
    const content = serializeBlocks(blocks);

    if (!lessonTitle.trim() || !content.trim()) {
      toast.error("Provide both title and content");
      return;
    }

    setAdding(true);

    const toastId = toast.loading("Updating lesson...");

    try {
      const payload = {
        title: lessonTitle.trim(),
        content: content.trim(),
      };

      const res = await apiClient.put(`/lessons/${editingLessonId}`, payload);

      const updatedLesson = res.data?.data;

      setLessons((prev) =>
        prev.map((l) => (l._id === editingLessonId ? updatedLesson : l)),
      );

      setSelected(updatedLesson);

      setEditingLessonId(null);

      setIsBuildMode(false);

      toast.success("Lesson updated successfully", {
        id: toastId,
      });
    } catch (err) {
      toast.error("Update failed", {
        id: toastId,
      });
    } finally {
      setAdding(false);
    }
  };

  const addBlock = (type) => {
    setBlocks((p) => [
      ...p,
      { id: Date.now(), type, value: "", lang: "javascript" },
    ]);
  };

  const updateBlock = (id, changes) => {
    setBlocks((p) => p.map((b) => (b.id === id ? { ...b, ...changes } : b)));
  };

  const removeBlock = (id) => {
    setBlocks((p) => p.filter((b) => b.id !== id));
  };

  const toggleBlockType = (id) => {
    setBlocks((p) =>
      p.map((b) =>
        b.id === id ? { ...b, type: b.type === "text" ? "code" : "text" } : b,
      ),
    );
  };

  const handleBulkDeploy = async () => {
    if (!bulkData.trim()) {
      toast.error("Telemetry payload empty");
      return;
    }
    setAdding(true);
    let items = [];
    try {
      // Automatic JSON/CSV detection
      if (bulkData.trim().startsWith("[") || bulkData.trim().startsWith("{")) {
        items = JSON.parse(bulkData);
        if (!Array.isArray(items)) items = [items];
      } else {
        // Semi-automated CSV parsing
        const lines = bulkData.split("\n");
        items = lines
          .filter((l) => l.includes(","))
          .map((l) => {
            const [title, ...rest] = l.split(",");
            return { title: title.trim(), content: rest.join(",").trim() };
          });
      }
    } catch (err) {
      toast.error("Parse failure - Check protocol syntax");
      setAdding(false);
      return;
    }

    if (items.length === 0) {
      toast.error("No valid entities identified");
      setAdding(false);
      return;
    }

    setProgress({ current: 0, total: items.length });
    const tid = toast.loading(`Sequential Deployment: 0/${items.length}`);

    let deployed = [];
    for (let i = 0; i < items.length; i++) {
      try {
        const res = await apiClient.post("/lessons", { ...items[i], courseId });
        deployed.push(res.data?.data);
        setProgress((p) => ({ ...p, current: i + 1 }));
        toast.loading(`Sequential Deployment: ${i + 1}/${items.length}`, {
          id: tid,
        });
        // Sequential delay to ensure system stability
        await new Promise((r) => setTimeout(r, 80));
      } catch (err) {
        console.error("Node deployment failure", items[i].title);
      }
    }

    setLessons((p) => [...p, ...deployed]);
    toast.success(`Deployment complete: ${deployed.length} nodes active`, {
      id: tid,
    });
    setIsBuildMode(false);
    setIsBulkMode(false);
    setBulkData("");
    setAdding(false);
    if (deployed.length > 0) setSelected(deployed[deployed.length - 1]);
  };

  const downloadTemplate = (type) => {
    let content = "";
    let filename = "";
    if (type === "json") {
      content = JSON.stringify(
        [{ title: "Example Lesson", content: "Markdown content here..." }],
        null,
        2,
      );
      filename = "curriculum_protocol.json";
    } else {
      content =
        "Title, Content\nLesson One, Introduction to Protocol\nLesson Two, Advanced Deployment";
      filename = "curriculum_protocol.csv";
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    toast.success("Protocol template exported");
  };

  const handleDeleteLesson = async (e, lessonId) => {
    e.stopPropagation();
    const toastId = toast.loading("Purging module data...");
    try {
      await apiClient.delete(`/lessons/${lessonId}`);
      setLessons((p) => p.filter((l) => l._id !== lessonId));
      toast.success("Module purged", { id: toastId });
      if (selected && String(selected._id) === String(lessonId)) {
        setSelected(lessons.find((l) => l._id !== lessonId) || null);
      }
    } catch (err) {
      toast.error("Purge failed", { id: toastId });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Logic copied to clipboard");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-t-transparent rounded-full"
          style={{ borderColor: C.brand }}
        />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
          Synchronizing curriculum data...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* ====================== SIDEBAR LIST ====================== */}
      <aside
        className={`
    hidden lg:flex
    fixed lg:relative
    top-0 left-0 h-full
    w-80 lg:w-96
    border-r border-border
    bg-surface
    flex-col
    transition-transform duration-300
    z-40
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border space-y-4">
          <button
            onClick={() => navigate("/admin/resources")}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={14} /> Back to Navigator
          </button>
          <div className="flex items-center justify-between">
            <h3
              className="text-xl font-black tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Curriculum <span className="text-brand">Nodes</span>
            </h3>
            <button
              onClick={() => {
                setIsBuildMode(true);
                setSelected(null);
              }}
              className="p-2 rounded-xl bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 transition-all"
            >
              <PlusCircle size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-surface2 border border-border/50">
            <Layers size={14} className="opacity-30" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              Total Modules: {lessons.length}
            </span>
          </div>
        </div>

        {/* Sidebar Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {lessons.map((l, idx) => (
            <SidebarItem
              key={l._id}
              lesson={l}
              idx={idx}
              isActive={selected?._id === l._id}
              onClick={() => {
                setSelected(l);
                setIsBuildMode(false);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              onDelete={(e) => handleDeleteLesson(e, l._id)}
            />
          ))}
          {lessons.length === 0 && (
            <div
              className="text-center py-20 opacity-20 group cursor-pointer"
              onClick={() => setIsBuildMode(true)}
            >
              <BookOpen
                size={48}
                className="mx-auto mb-4 group-hover:scale-110 transition-transform"
              />
              <p className="text-[10px] font-black uppercase tracking-widest">
                No modules identified
              </p>
              <p className="text-[8px] font-bold uppercase mt-1">
                Initialize Curriculum Build
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ====================== MAIN CONTENT ====================== */}
      <main className="flex-1 flex flex-col bg-surface2/30 relative overflow-hidden">
        {/* Mobile Toggle */}
        <button
          className="hidden lg:hidden absolute top-6 left-6 z-50 p-3 rounded-2xl bg-surface shadow-2xl border border-border"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={20} />
        </button>

        {isBuildMode ? (
          /* BUILD MODE INTERFACE */
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Editor Col */}
            <div className="flex-1 flex flex-col border-r border-border bg-surface shadow-inner">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand text-white shadow-lg">
                    <Edit3 size={18} />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Provisioning Console
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-surface2 p-1 rounded-xl border border-border mr-4">
                    <button
                      onClick={() => setIsBulkMode(false)}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${!isBulkMode ? "bg-surface shadow-sm text-brand" : "opacity-40 hover:opacity-100"}`}
                    >
                      Manual
                    </button>
                    <button
                      onClick={() => setIsBulkMode(true)}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${isBulkMode ? "bg-surface shadow-sm text-brand" : "opacity-40 hover:opacity-100"}`}
                    >
                      Bulk
                    </button>
                  </div>
                  <button
                    onClick={() => setIsBuildMode(false)}
                    className="p-2 rounded-xl hover:bg-surface2 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {!isBulkMode ? (
                <div className="flex-1 p-6 space-y-5 overflow-y-auto custom-scrollbar">
                  {/* Title input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">
                      Module Identity
                    </label>
                    <input
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder="Enter lesson title..."
                      className="w-full bg-surface2 border border-border p-4 rounded-2xl font-black text-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                    />
                  </div>

                  {/* Block Editor */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40">
                        Content Blocks
                      </label>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-20">
                        {blocks.length} block{blocks.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <AnimatePresence>
                      {blocks.map((block, idx) => (
                        <ContentBlock
                          key={block.id}
                          block={block}
                          idx={idx}
                          total={blocks.length}
                          onToggleType={() => toggleBlockType(block.id)}
                          onUpdate={(changes) => updateBlock(block.id, changes)}
                          onRemove={() => removeBlock(block.id)}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Add Block Buttons */}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => addBlock("text")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface2 border border-border text-[9px] font-black uppercase tracking-widest hover:border-brand/40 hover:text-brand transition-all"
                      >
                        <Type size={12} /> Add Text Block
                      </button>
                      <button
                        onClick={() => addBlock("code")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface2 border border-border text-[9px] font-black uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all"
                      >
                        <Code2 size={12} /> Add Code Block
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                        Bulk Ingestion Protocol
                      </span>
                      <span className="text-[8px] font-bold opacity-30 mt-0.5 uppercase">
                        Paste JSON array or curriculum metadata
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadTemplate("json")}
                        className="p-2 rounded-lg bg-surface2 border border-border text-[8px] font-black uppercase opacity-60 hover:opacity-100 transition-all"
                      >
                        JSON Schema
                      </button>
                      <button
                        onClick={() => downloadTemplate("csv")}
                        className="p-2 rounded-lg bg-surface2 border border-border text-[8px] font-black uppercase opacity-60 hover:opacity-100 transition-all"
                      >
                        CSV Schema
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col min-h-[500px] relative">
                    <textarea
                      value={bulkData}
                      onChange={(e) => setBulkData(e.target.value)}
                      placeholder={`[{\n  "title": "Module One",\n  "content": "Protocol logic here..."\n}]`}
                      className="flex-1 w-full bg-surface2 border border-border p-6 rounded-3xl font-mono text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none shadow-inner"
                    />
                    {adding && (
                      <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <div className="p-6 rounded-[2rem] bg-surface shadow-2xl border border-border max-w-sm w-full">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">
                            <span>Syncing Registry</span>
                            <span>
                              {progress.current}/{progress.total}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-surface2 border border-border overflow-hidden">
                            <motion.div
                              className="h-full bg-brand shadow-[0_0_10px_var(--brand)]"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(progress.current / progress.total) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] font-bold mt-4 animate-pulse uppercase tracking-tight">
                            Deploying Node Cluster...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-6 border-t border-border bg-surface flex items-center justify-between gap-4">
                {!isBulkMode ? (
                  <button
                    disabled={adding}
                    onClick={
                      editingLessonId ? handleUpdateLesson : handleAddLesson
                    }
                    className="w-full py-4 rounded-2xl bg-brand text-white font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    {adding ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                    ) : (
                      <>
                        <Save size={18} />
                        {editingLessonId ? "Update Lesson" : "Deploy Module"}
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled={adding}
                    onClick={handleBulkDeploy}
                    className="w-full py-4 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    {adding ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                    ) : (
                      <>
                        <Zap size={18} /> Provision Payload
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Live Preview Col */}
            <div className="flex-1 hidden xl:flex flex-col bg-surface2/50 overflow-y-auto p-12 custom-scrollbar">
              <div className="max-w-3xl mx-auto w-full space-y-10">
                <div className="pb-10 border-b border-border/50">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 mb-4 inline-block">
                    Real-time Preview
                  </span>
                  <h1
                    className="text-5xl font-black tracking-tighter opacity-80"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {lessonTitle || "Untitled Module"}
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0">
                  <RenderedContent
                    content={serializeBlocks(blocks)}
                    onCopy={handleCopy}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : selected ? (
          /* VIEW MODE INTERFACE */
          <div className="flex-1 overflow-y-auto px-4 py-6 lg:p-16 custom-scrollbar bg-surface2/20">
            <motion.div
              key={selected._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full lg:max-w-4xl lg:mx-auto space-y-12 pb-20"
            >
              {/* Mobile Lesson Selector */}
              <div className="lg:hidden mb-4">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-2">
                  Select Lesson
                </label>

                <select
                  value={selected?._id || ""}
                  onChange={(e) => {
                    const lesson = lessons.find(
                      (l) => l._id === e.target.value,
                    );

                    if (lesson) setSelected(lesson);
                  }}
                  className="
      w-full
      p-3
      rounded-xl
      bg-surface
      border border-border
      font-semibold
      text-sm
      focus:outline-none
      focus:ring-2
      focus:ring-brand/20
    "
                >
                  {lessons.map((lesson) => (
                    <option key={lesson._id} value={lesson._id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>
              {/* Lesson Header */}
              <div className="space-y-6 pb-12 border-b border-border/50 relative">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-brand/10 text-brand text-[9px] font-black uppercase tracking-[0.2em] border border-brand/20">
                    Node #
                    {lessons.findIndex((l) => l._id === selected?._id) + 1}
                  </span>
                  <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12} /> Distributed Curriculum Network
                  </span>
                </div>
                <h1
                  className="text-5xl lg:text-6xl font-black tracking-tighter leading-tight"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {selected.title}
                </h1>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleEditLesson(selected)}
                    className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-[10px] font-black uppercase"
                  >
                    Edit Lesson
                  </button>
                  <div className="flex items-center gap-3 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border shadow-md flex items-center justify-center">
                      <Activity size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-30">
                        Status
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-tight text-emerald-400">
                        Deployed & Live
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-border/50" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border shadow-md flex items-center justify-center">
                      <Clock size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-30">
                        Deployed
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-tight">
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Content Area */}
              <div className="space-y-8">
                <RenderedContent
                  content={selected.content}
                  onCopy={handleCopy}
                />
              </div>
            </motion.div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="p-10 rounded-[3rem] bg-surface shadow-2xl border border-border flex flex-col items-center max-w-md">
              <div className="w-20 h-20 rounded-[2.5rem] bg-surface2 border border-border shadow-inner flex items-center justify-center mb-8">
                <Layout size={32} className="opacity-20" />
              </div>
              <h2
                className="text-2xl font-black tracking-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Initialize Selection
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">
                Select a curriculum node from the registry or deploy a new
                module to begin.
              </p>
              <button
                onClick={() => setIsBuildMode(true)}
                className="mt-8 px-8 py-3 rounded-2xl bg-brand text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2"
              >
                <PlusCircle size={16} /> Deploy New Module
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

/* ====================== BLOCK EDITOR COMPONENT ====================== */
const LANGS = [
  "javascript",
  "python",
  "bash",
  "html",
  "css",
  "typescript",
  "json",
  "sql",
  "java",
  "cpp",
];

const ContentBlock = ({
  block,
  idx,
  total,
  onToggleType,
  onUpdate,
  onRemove,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.18 }}
    className={`relative rounded-2xl border overflow-hidden ${
      block.type === "code"
        ? "border-accent/30 bg-surface"
        : "border-brand/20 bg-surface"
    }`}
  >
    {/* Block Header */}
    <div
      className={`flex items-center justify-between px-4 py-2.5 border-b ${
        block.type === "code"
          ? "border-accent/20 bg-accent/5"
          : "border-brand/10 bg-brand/5"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-[8px] font-black uppercase tracking-widest opacity-30">
          Block {idx + 1}
        </span>
        {/* Toggle pill */}
        <button
          onClick={onToggleType}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
            block.type === "code"
              ? "bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25"
              : "bg-brand/15 text-brand border border-brand/30 hover:bg-brand/25"
          }`}
        >
          {block.type === "code" ? (
            <>
              <Code2 size={9} /> Code
            </>
          ) : (
            <>
              <Type size={9} /> Text
            </>
          )}
          <ChevronRight size={9} className="opacity-50" />
          {block.type === "code" ? (
            <>
              <Type size={9} /> Text
            </>
          ) : (
            <>
              <Code2 size={9} /> Code
            </>
          )}
        </button>
        {block.type === "code" && (
          <select
            value={block.lang}
            onChange={(e) => onUpdate({ lang: e.target.value })}
            className="bg-surface2 border border-border text-[9px] font-black uppercase tracking-widest rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-accent/30 cursor-pointer"
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        )}
      </div>
      {total > 1 && (
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 opacity-30 hover:opacity-100 transition-all"
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>

    {/* Block Body */}
    {block.type === "code" ? (
      <textarea
        value={block.value}
        onChange={(e) => onUpdate({ value: e.target.value })}
        placeholder={`# Write your ${block.lang} code here...`}
        rows={6}
        spellCheck={false}
        className="w-full bg-transparent p-4 font-mono text-sm resize-none outline-none text-white/80 leading-relaxed placeholder:opacity-20"
      />
    ) : (
      <textarea
        value={block.value}
        onChange={(e) => onUpdate({ value: e.target.value })}
        placeholder="Write your explanation here... (Markdown supported: **bold**, ## headings, - lists, > quotes)"
        rows={5}
        className="w-full bg-transparent p-4 text-sm resize-none outline-none text-white/80 leading-relaxed font-medium placeholder:opacity-20"
      />
    )}
  </motion.div>
);

const SidebarItem = ({ lesson, isActive, onClick, onDelete, idx }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.02 }}
    onClick={onClick}
    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 overflow-hidden ${isActive ? "bg-surface2 border-brand/40 shadow-md ring-1 ring-brand/10" : "bg-surface border-transparent hover:bg-surface2"}`}
  >
    {isActive && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand rounded-r-full shadow-[0_0_10px_var(--brand)]" />
    )}

    <div className="flex items-center justify-between gap-3">
      <span className="text-[9px] font-black uppercase tracking-widest opacity-20">
        Node {idx + 1}
      </span>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all"
      >
        <Trash2 size={12} />
      </button>
    </div>
    <h4
      className={`text-xs font-black tracking-tight truncate ${isActive ? "text-brand" : ""}`}
    >
      {lesson.title}
    </h4>
    <div className="flex items-center gap-1.5 mt-1">
      <div
        className={`w-1 h-1 rounded-full ${isActive ? "bg-brand" : "bg-border"}`}
      />
      <span className="text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">
        Verified Secure
      </span>
    </div>
  </motion.div>
);

const RenderedContent = ({ content, onCopy }) => {
  if (!content)
    return (
      <div className="opacity-10 h-32 bg-surface rounded-3xl animate-pulse" />
    );

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

  return (
    <div className="space-y-10">
      {parts.map((p, i) =>
        p.type === "markdown" ? (
          <div
            key={i}
            className="prose prose-invert max-w-none text-white/80 leading-relaxed font-medium"
          >
            <ReactMarkdown>{p.text}</ReactMarkdown>
          </div>
        ) : (
          <div
            key={i}
            className="relative group rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl"
          >
            <div className="bg-surface2/80 backdrop-blur-md border-b border-border/50 px-6 py-3 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                {p.lang || "code-exec"}
              </span>
              <button
                onClick={() => onCopy(p.text)}
                className="p-2 rounded-xl hover:bg-surface transition-all opacity-40 group-hover:opacity-100"
              >
                <Copy size={14} />
              </button>
            </div>
            <SyntaxHighlighter
              language={p.lang || "javascript"}
              style={vscDarkPlus}
              showLineNumbers
              customStyle={{
                margin: 0,
                padding: "2rem",
                background: "var(--surface)",
                fontSize: "13px",
              }}
            >
              {p.text}
            </SyntaxHighlighter>
          </div>
        ),
      )}
    </div>
  );
};

export default CourseLessons;

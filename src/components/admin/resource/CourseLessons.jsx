import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  PlusCircle, Trash2, X, ChevronDown, ChevronUp, 
  Copy, Menu, ArrowLeft, Layout, BookOpen, 
  Zap, Save, Eye, Edit3, Layers, Globe,
  Activity, Clock
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
  border: "var(--border)"
};

export const CourseLessons = ({ courseId: propCourseId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const courseId = propCourseId || params.courseId;
  const { token, loading: authLoading } = useAuth();
  
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isBuildMode, setIsBuildMode] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", content: "" });
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
      const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setLessons(sorted);
      if (sorted.length > 0) setSelected(sorted[0]);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Resource sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.content.trim()) {
      toast.error("Provide both title and content payload");
      return;
    }
    setAdding(true);
    const toastId = toast.loading("Deploying new module...");
    try {
      const payload = {
        title: newLesson.title.trim(),
        content: newLesson.content.trim(),
        courseId,
      };
      const res = await apiClient.post("/lessons", payload);
      const added = res.data?.data;
      setLessons((p) => [...p, added]);
      setNewLesson({ title: "", content: "" });
      setIsBuildMode(false);
      setSelected(added);
      toast.success("Module deployed successfully", { id: toastId });
    } catch (err) {
      toast.error("Deployment failed", { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteLesson = async (e, lessonId) => {
    e.stopPropagation();
    const toastId = toast.loading("Purging module data...");
    try {
      await apiClient.delete(`/lessons/${lessonId}`);
      setLessons((p) => p.filter((l) => l._id !== lessonId));
      toast.success("Module purged", { id: toastId });
      if (selected && String(selected._id) === String(lessonId)) {
        setSelected(lessons.find(l => l._id !== lessonId) || null);
      }
    } catch (err) {
      toast.error("Purge failed", { id: toastId });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Logic copied to clipboard");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
      <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Synchronizing curriculum data...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* ====================== SIDEBAR LIST ====================== */}
      <aside className={`w-80 lg:w-96 border-r border-border bg-surface flex flex-col transition-all duration-500 shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
         {/* Sidebar Header */}
         <div className="p-6 border-b border-border space-y-4">
            <button 
              onClick={() => navigate("/admin/resources")}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft size={14} /> Back to Navigator
            </button>
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                  Curriculum <span className="text-brand">Nodes</span>
               </h3>
               <button 
                 onClick={() => { setIsBuildMode(true); setSelected(null); }}
                 className="p-2 rounded-xl bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 transition-all"
               >
                  <PlusCircle size={18} />
               </button>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-surface2 border border-border/50">
               <Layers size={14} className="opacity-30" />
               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Modules: {lessons.length}</span>
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
                  onClick={() => { setSelected(l); setIsBuildMode(false); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                  onDelete={(e) => handleDeleteLesson(e, l._id)}
               />
            ))}
            {lessons.length === 0 && (
               <div className="text-center py-20 opacity-20 group cursor-pointer" onClick={() => setIsBuildMode(true)}>
                  <BookOpen size={48} className="mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No modules identified</p>
                  <p className="text-[8px] font-bold uppercase mt-1">Initialize Curriculum Build</p>
               </div>
            )}
         </div>
      </aside>

      {/* ====================== MAIN CONTENT ====================== */}
      <main className="flex-1 flex flex-col bg-surface2/30 relative overflow-hidden">
         {/* Mobile Toggle */}
         <button className="lg:hidden absolute top-6 left-6 z-50 p-3 rounded-2xl bg-surface shadow-2xl border border-border" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
         </button>

         {isBuildMode ? (
            /* BUILD MODE INTERFACE */
            <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
               {/* Editor Col */}
               <div className="flex-1 flex flex-col border-r border-border bg-surface shadow-inner">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-brand text-white shadow-lg"><Edit3 size={18} /></div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Build Mode</h2>
                     </div>
                     <button onClick={() => setIsBuildMode(false)} className="p-2 rounded-xl hover:bg-surface2 transition-all"><X size={18} /></button>
                  </div>
                  
                  <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Module Identity</label>
                        <input 
                           value={newLesson.title}
                           onChange={(e) => setNewLesson(p => ({...p, title: e.target.value}))}
                           placeholder="Enter lesson title..."
                           className="w-full bg-surface2 border border-border p-4 rounded-2xl font-black text-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                        />
                     </div>
                     <div className="flex-1 flex flex-col min-h-[400px]">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 mb-2">Content Payload (Markdown Supported)</label>
                        <textarea 
                           value={newLesson.content}
                           onChange={(e) => setNewLesson(p => ({...p, content: e.target.value}))}
                           placeholder="Enter curriculum content/logic..."
                           className="flex-1 w-full bg-surface2 border border-border p-6 rounded-3xl font-mono text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none"
                        />
                     </div>
                  </div>

                  <div className="p-6 border-t border-border bg-surface">
                     <button 
                        disabled={adding}
                        onClick={handleAddLesson}
                        className="w-full py-4 rounded-2xl bg-brand text-white font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                     >
                        {adding ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                        ) : (
                           <><Save size={18} /> Deploy Module</>
                        )}
                     </button>
                  </div>
               </div>

               {/* Live Preview Col */}
               <div className="flex-1 hidden xl:flex flex-col bg-surface2/50 overflow-y-auto p-12 custom-scrollbar">
                  <div className="max-w-3xl mx-auto w-full space-y-10">
                     <div className="pb-10 border-b border-border/50">
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 mb-4 inline-block">Real-time Preview</span>
                        <h1 className="text-5xl font-black tracking-tighter opacity-80" style={{ fontFamily: "'Fraunces', serif" }}>
                           {newLesson.title || "Untitled Module"}
                        </h1>
                     </div>
                     
                     <div className="prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0">
                        <RenderedContent content={newLesson.content} onCopy={handleCopy} />
                     </div>
                  </div>
               </div>
            </div>
         ) : selected ? (
            /* VIEW MODE INTERFACE */
            <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar bg-surface2/20">
               <motion.div 
                 key={selected._id} 
                 initial={{ opacity: 0, y: 15 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 className="max-w-4xl mx-auto space-y-12 pb-20"
               >
                  {/* Lesson Header */}
                  <div className="space-y-6 pb-12 border-b border-border/50 relative">
                     <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-brand/10 text-brand text-[9px] font-black uppercase tracking-[0.2em] border border-brand/20">
                           Node #{lessons.findIndex(l => l._id === selected?._id) + 1}
                        </span>
                        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest flex items-center gap-2"><Globe size={12} /> Distributed Curriculum Network</span>
                     </div>
                     <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                        {selected.title}
                     </h1>
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 hover:opacity-100 transition-opacity">
                           <div className="w-10 h-10 rounded-full bg-surface border border-border shadow-md flex items-center justify-center">
                              <Activity size={16} className="text-accent" />
                           </div>
                           <div>
                              <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Status</p>
                              <p className="text-[10px] font-bold uppercase tracking-tight text-emerald-400">Deployed & Live</p>
                           </div>
                        </div>
                        <div className="h-8 w-[1px] bg-border/50" />
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-surface border border-border shadow-md flex items-center justify-center">
                              <Clock size={16} className="text-indigo-400" />
                           </div>
                           <div>
                              <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Deployed</p>
                              <p className="text-[10px] font-bold uppercase tracking-tight">{new Date(selected.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Lesson Content Area */}
                  <div className="space-y-8">
                     <RenderedContent content={selected.content} onCopy={handleCopy} />
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
                   <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>Initialize Selection</h2>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">Select a curriculum node from the registry or deploy a new module to begin.</p>
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

const SidebarItem = ({ lesson, isActive, onClick, onDelete, idx }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.02 }}
    onClick={onClick}
    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 overflow-hidden ${isActive ? 'bg-surface2 border-brand/40 shadow-md ring-1 ring-brand/10' : 'bg-surface border-transparent hover:bg-surface2'}`}
  >
    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand rounded-r-full shadow-[0_0_10px_var(--brand)]" />}
    
    <div className="flex items-center justify-between gap-3">
       <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Node {idx + 1}</span>
       <button 
         onClick={onDelete}
         className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all"
       >
         <Trash2 size={12} />
       </button>
    </div>
    <h4 className={`text-xs font-black tracking-tight truncate ${isActive ? 'text-brand' : ''}`}>{lesson.title}</h4>
    <div className="flex items-center gap-1.5 mt-1">
       <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-brand' : 'bg-border'}`} />
       <span className="text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">Verified Secure</span>
    </div>
  </motion.div>
);

const RenderedContent = ({ content, onCopy }) => {
  if (!content) return <div className="opacity-10 h-32 bg-surface rounded-3xl animate-pulse" />;
  
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
      {parts.map((p, i) => (
        p.type === "markdown" ? (
          <div key={i} className="prose prose-invert max-w-none text-white/80 leading-relaxed font-medium">
             <ReactMarkdown>{p.text}</ReactMarkdown>
          </div>
        ) : (
          <div key={i} className="relative group rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl">
             <div className="bg-surface2/80 backdrop-blur-md border-b border-border/50 px-6 py-3 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">{p.lang || 'code-exec'}</span>
                <button onClick={() => onCopy(p.text)} className="p-2 rounded-xl hover:bg-surface transition-all opacity-40 group-hover:opacity-100">
                   <Copy size={14} />
                </button>
             </div>
             <SyntaxHighlighter
               language={p.lang || "javascript"}
               style={vscDarkPlus}
               showLineNumbers
               customStyle={{ margin: 0, padding: '2rem', background: 'var(--surface)', fontSize: '13px' }}
             >
               {p.text}
             </SyntaxHighlighter>
          </div>
        )
      ))}
    </div>
  );
};

export default CourseLessons;

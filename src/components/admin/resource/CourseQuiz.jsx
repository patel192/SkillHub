import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../context/AuthContext";
import {
  Plus, CheckCircle, Circle, X, 
  ChevronDown, ChevronUp, ArrowLeft, 
  Menu, Zap, Info, Shield, HelpCircle,
  Save, Trash2, Edit3, Award, Search,
  Activity, MoreVertical
} from "lucide-react";
import toast from "react-hot-toast";
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

export const CourseQuiz = () => {
  const { token, loading: authLoading } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkData, setBulkData] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    points: 1,
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch Course Info
      const courseRes = await apiClient.get(`/course/${courseId}`);
      setCourseTitle(courseRes.data?.data?.title || "Assessment");

      // Fetch Questions
      const res = await apiClient.get(`/questions/${courseId}`);
      setQuestions(res.data.data || []);

      if (res.data.data?.length > 0) {
        setSelectedQuestion(res.data.data[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Quiz synchronization error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || authLoading) return;
    fetchInitialData();
  }, [courseId, token, authLoading]);

  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) {
       toast.error("Question content required");
       return;
    }
    const hasCorrect = newQuestion.options.some(o => o.isCorrect);
    if (!hasCorrect) {
       toast.error("Identify at least one correct solution");
       return;
    }

    const toastId = toast.loading("Deploying question node...");
    try {
      const res = await apiClient.post(`/questions/${courseId}`, newQuestion);
      const data = res.data?.data || res.data; // Handle both direct and nested responses
      setQuestions((prev) => [...prev, data]);
      setSelectedQuestion(data);
      setAdding(false);
      setNewQuestion({
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        points: 1,
      });
      toast.success("Question synchronized", { id: toastId });
    } catch (err) {
      toast.error("Deployment failed", { id: toastId });
    }
  };

  const handleBulkDeploy = async () => {
    if (!bulkData.trim()) {
       toast.error("Telemetry payload empty");
       return;
    }
    setAdding(true);
    let items = [];
    try {
       if (bulkData.trim().startsWith("[") || bulkData.trim().startsWith("{")) {
          items = JSON.parse(bulkData);
          if (!Array.isArray(items)) items = [items];
       } else {
          // CSV Parser: Question, Opt1, Opt2, Opt3, Opt4, CorrectIdx(0-3), Points
          const lines = bulkData.split("\n").filter(l => l.includes(","));
          items = lines.map(l => {
             const [q, o1, o2, o3, o4, cIdx, pts] = l.split(",").map(s => s.trim());
             return {
                question: q,
                options: [
                   { text: o1, isCorrect: cIdx === "0" },
                   { text: o2, isCorrect: cIdx === "1" },
                   { text: o3, isCorrect: cIdx === "2" },
                   { text: o4, isCorrect: cIdx === "3" },
                ],
                points: parseInt(pts) || 1
             };
          });
       }
    } catch (err) {
       toast.error("Parse failure - Check assessment syntax");
       setAdding(false);
       return;
    }

    if (items.length === 0) {
       toast.error("No valid entities identified");
       setAdding(false);
       return;
    }

    setProgress({ current: 0, total: items.length });
    const tid = toast.loading(`Synchronizing Matrix: 0/${items.length}`);
    
    let deployed = [];
    for (let i = 0; i < items.length; i++) {
       try {
          const res = await apiClient.post(`/questions/${courseId}`, items[i]);
          deployed.push(res.data?.data || res.data);
          setProgress(p => ({ ...p, current: i + 1 }));
          toast.loading(`Synchronizing Matrix: ${i+1}/${items.length}`, { id: tid });
          await new Promise(r => setTimeout(r, 80)); 
       } catch (err) {
          console.error("Assessment node failure", items[i].question);
       }
    }

    setQuestions(p => [...p, ...deployed]);
    toast.success(`${deployed.length} assessment nodes active`, { id: tid });
    setAdding(false);
    setIsBulkMode(false);
    setBulkData("");
    if (deployed.length > 0) setSelectedQuestion(deployed[deployed.length - 1]);
  };

  const downloadTemplate = (type) => {
    let content = "";
    let filename = "";
    if (type === 'json') {
       content = JSON.stringify([{ 
         question: "What is the primary protocol?", 
         options: [
            { text: "Option A", isCorrect: true },
            { text: "Option B", isCorrect: false }
         ],
         points: 5 
       }], null, 2);
       filename = "assessment_protocol.json";
    } else {
       content = "Question, Opt1, Opt2, Opt3, Opt4, CorrectIdx(0-3), Points\nSample Question, Yes, No, Maybe, N/A, 0, 10";
       filename = "assessment_protocol.csv";
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    toast.success("Assessment template exported");
  };

  const handleDeleteQuestion = async (e, id) => {
    e.stopPropagation();
    const toastId = toast.loading("Purging question record...");
    try {
      await apiClient.delete(`/questions/${id}`);
      setQuestions(prev => prev.filter(q => q._id !== id));
      if (selectedQuestion?._id === id) setSelectedQuestion(null);
      toast.success("Record purged", { id: toastId });
    } catch (err) {
      toast.error("Purge failed", { id: toastId });
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
     <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
       <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                   className="w-10 h-10 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
       <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Decrypting assessment matrix...</p>
     </div>
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden relative">
      {/* ====================== SIDEBAR ====================== */}
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
                  Quiz <span className="text-brand">Architect</span>
               </h3>
               <button 
                 onClick={() => { setAdding(true); setSelectedQuestion(null); }}
                 className="p-2 rounded-xl bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all"
               >
                  <Plus size={18} />
               </button>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={14} />
              <input 
                type="text" 
                placeholder="Search metrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface2 border border-border/50 text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-brand/30 outline-none transition-all placeholder:opacity-40"
              />
            </div>
         </div>

         {/* Sidebar Scroll Area */}
         <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredQuestions.map((q, idx) => (
               <QuestionNode 
                  key={q._id} 
                  question={q} 
                  idx={idx} 
                  isActive={selectedQuestion?._id === q._id} 
                  onClick={() => { setSelectedQuestion(q); setAdding(false); if(window.innerWidth < 1024) setSidebarOpen(false); }}
                  onDelete={(e) => handleDeleteQuestion(e, q._id)}
               />
            ))}
            {filteredQuestions.length === 0 && (
               <div className="text-center py-20 opacity-20 group cursor-pointer" onClick={() => setAdding(true)}>
                  <HelpCircle size={48} className="mx-auto mb-4 group-hover:rotate-12 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No nodes identified</p>
               </div>
            )}
         </div>
      </aside>

      {/* ====================== MAIN CONTENT ====================== */}
      <main className="flex-1 flex flex-col bg-surface2/30 relative overflow-hidden">
         {/* Mobile Menu Trigger */}
         <button className="lg:hidden absolute top-6 left-6 z-50 p-3 rounded-2xl bg-surface shadow-2xl border border-border" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
         </button>

         {adding ? (
            /* ADD QUESTION INTERFACE */
            <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar">
               <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-10">
                  <div className="pb-10 border-b border-border space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-brand text-white shadow-lg"><Plus size={18} /></div>
                        <h2 className="text-xl font-black uppercase tracking-tight">New Assessment Node</h2>
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Define question logic and scoring parameters below.</p>
                  </div>

                  <div className="space-y-8">
                     {/* Question Input */}
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Logic Payload</label>
                        <textarea 
                           value={newQuestion.question}
                           onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                           placeholder="Enter your question text here..."
                           className="w-full bg-surface border border-border p-6 rounded-[2rem] font-black text-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none min-h-[120px] shadow-sm"
                        />
                     </div>

                     {/* Options Matrix */}
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Response Options (Select Correct Solution)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {newQuestion.options.map((opt, i) => (
                              <div key={i} className={`p-4 rounded-3xl border transition-all flex items-center gap-4 ${opt.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-surface border-border/50 focus-within:border-brand/40'}`}>
                                 <button 
                                   onClick={() => {
                                      const updated = newQuestion.options.map((o, idx) => ({ ...o, isCorrect: idx === i }));
                                      setNewQuestion({ ...newQuestion, options: updated });
                                   }}
                                   className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${opt.isCorrect ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`}
                                 >
                                    {opt.isCorrect && <CheckCircle size={14} className="text-white" />}
                                 </button>
                                 <input 
                                    type="text" 
                                    placeholder={`Option ${i+1}`}
                                    value={opt.text}
                                    onChange={(e) => {
                                       const updated = [...newQuestion.options];
                                       updated[i].text = e.target.value;
                                       setNewQuestion({ ...newQuestion, options: updated });
                                    }}
                                    className="flex-1 bg-transparent border-none outline-none font-bold text-sm placeholder:opacity-30"
                                 />
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Weighting Section */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-[2.5rem] bg-surface border border-border border-dashed">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Node Weight</label>
                           <div className="flex items-center gap-4">
                              <input 
                                 type="range" min="1" max="100" 
                                 value={newQuestion.points}
                                 onChange={(e) => setNewQuestion({...newQuestion, points: parseInt(e.target.value)})}
                                 style={{ accentColor: C.brand }}
                                 className="flex-1"
                              />
                              <span className="w-12 text-center font-black text-brand bg-brand/10 py-1 rounded-lg border border-brand/20">{newQuestion.points}pt</span>
                           </div>
                        </div>
                        <div className="flex flex-col justify-center">
                           <p className="text-[9px] font-black uppercase tracking-widest opacity-30 leading-relaxed">
                              This value defines the raw point weight of this assessment node within the global curriculum matrix.
                           </p>
                        </div>
                     </div>

                     <div className="pt-10 flex gap-4">
                        <button 
                           onClick={handleAddQuestion}
                           className="flex-1 py-4 rounded-2xl bg-brand text-white font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                           <Save size={18} /> Synchronize Node
                        </button>
                        <button 
                           onClick={() => setAdding(false)}
                           className="px-8 py-4 rounded-2xl bg-surface border border-border font-black uppercase tracking-widest text-[10px] opacity-60 hover:opacity-100 transition-all"
                        >
                           Cancel
                        </button>
                     </div>
                  </div>
               </motion.div>
            </div>
         ) : selectedQuestion ? (
            /* VIEW QUESTION INTERFACE */
            <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar">
               <motion.div key={selectedQuestion._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-12">
                  <div className="space-y-6 pb-12 border-b border-border/50">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">Assessment Node Live</span>
                           <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest flex items-center gap-2"><Award size={12} /> {selectedQuestion.points} Points Weight</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">
                           <Activity size={14} /> Health: 100%
                        </div>
                     </div>
                     <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                        {selectedQuestion.question}
                     </h1>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                     {selectedQuestion.options.map((opt, i) => (
                        <div key={i} className={`p-6 rounded-[2rem] border transition-all flex items-center gap-6 ${opt.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-surface border-border/50'}`}>
                           <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${opt.isCorrect ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-border'}`}>
                              {opt.isCorrect ? <CheckCircle size={16} /> : <Circle size={16} className="opacity-20" />}
                           </div>
                           <span className={`text-lg font-bold ${opt.isCorrect ? 'text-emerald-400' : 'opacity-60'}`}>{opt.text}</span>
                           {opt.isCorrect && <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-emerald-500/60 bg-emerald-500/5 px-3 py-1 rounded-full">Correct Logic</span>}
                        </div>
                     ))}
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-surface border border-border flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-surface2 border border-border shadow-inner">
                           <Shield size={20} className="text-brand opacity-60" />
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-0.5">Assessment Security</h4>
                           <p className="text-xs font-bold uppercase tracking-tight">Verified & Distributed Node</p>
                        </div>
                     </div>
                     <button className="p-3 rounded-2xl bg-surface2 border border-border opacity-30 hover:opacity-100 transition-all">
                        <MoreVertical size={18} />
                     </button>
                  </div>
               </motion.div>
            </div>
         ) : (
            /* EMPTY STATE */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="p-12 rounded-[4rem] bg-surface shadow-2xl border border-border flex flex-col items-center max-w-sm">
                   <div className="w-24 h-24 rounded-[3rem] bg-surface2 border border-border shadow-inner flex items-center justify-center mb-8">
                      <HelpCircle size={40} className="opacity-10" />
                   </div>
                   <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>Matrix Empty</h2>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">Initialize assessment logic by deploying a new question node to the grid.</p>
                   <button 
                     onClick={() => setAdding(true)}
                     className="mt-10 px-8 py-3.5 rounded-2xl bg-accent text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2"
                   >
                     <Plus size={16} /> Deploy New Node
                   </button>
               </div>
            </div>
         )}
      </main>
    </div>
  );
};

const QuestionNode = ({ question, isActive, onClick, onDelete, idx }) => (
   <motion.div
     initial={{ opacity: 0, x: -10 }}
     animate={{ opacity: 1, x: 0 }}
     transition={{ delay: idx * 0.02 }}
     onClick={onClick}
     className={`group relative p-5 rounded-[2rem] border transition-all cursor-pointer flex flex-col gap-2 overflow-hidden ${isActive ? 'bg-surface2 border-brand/40 shadow-lg ring-1 ring-brand/10' : 'bg-surface border-transparent hover:bg-surface2'}`}
   >
     <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
           <span className="text-[9px] font-black uppercase tracking-widest opacity-20">Node {idx + 1}</span>
           <span className="text-[8px] font-black text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">W:{question.points}</span>
        </div>
        <button 
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <Trash2 size={12} />
        </button>
     </div>
     <h4 className={`text-[11px] font-black tracking-tight line-clamp-2 leading-tight ${isActive ? 'text-brand' : 'opacity-70'}`}>{question.question}</h4>
   </motion.div>
);

export default CourseQuiz;

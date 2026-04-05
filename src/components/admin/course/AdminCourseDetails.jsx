import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { 
  PlusCircle, MoreHorizontal, ArrowLeft, Edit, 
  Video, Puzzle, Users, CheckCircle, Clock, 
  Globe, Info, BarChart, Settings, ExternalLink, 
  Trash2, MessageSquare, BookOpen, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

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

export const AdminCourseDetails = () => {
  const { token, loading: authLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPoint, setNewPoint] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!token || authLoading) return;
    fetchCourse();
    fetchOverview();
  }, [id, token, authLoading]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/course/${id}`);
      setCourse(res.data.data);
    } catch (err) {
      console.error("Failed to fetch course:", err.message);
      toast.error("Cloud sync failed for course head");
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const res = await apiClient.get(`/overview/${id}`);
      setOverview(res.data.data?.overview || []);
    } catch (err) {
      console.error("Failed to fetch overview:", err.message);
    }
  };

  const handleAddPoint = async () => {
    if (!newPoint.trim()) return;
    const toastId = toast.loading("Appending outcome...");
    try {
      const res = await apiClient.patch(`/overview/${id}`, { point: newPoint });
      setOverview(res.data.data.overview);
      setNewPoint("");
      toast.success("Outcome added", { id: toastId });
    } catch (err) {
      toast.error("Failed to save outcome", { id: toastId });
    }
  };

  if (loading && !course) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Indexing course content...</p>
      </div>
    );
  }

  if (!course) return <div className="text-center py-20 opacity-40">Course not found or access denied.</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* ====================== HEADER / CONTROL BAR ====================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col">
           <button 
             onClick={() => navigate("/admin/courses")}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-2"
           >
             <ArrowLeft size={14} /> Back to Inventory
           </button>
           <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
             {course.title}
           </h1>
           <div className="flex items-center gap-4 mt-2">
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${course.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>
                {course.isPublished ? 'Live on Platform' : 'Development Draft'}
              </span>
              <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest flex items-center gap-1.5"><Globe size={12} /> {course.category}</span>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={() => navigate(`/admin/courses/edit/${id}`)}
             className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-surface border border-border text-xs font-black uppercase tracking-widest hover:bg-surface2 transition-all"
           >
             <Edit size={16} /> Edit Meta
           </button>
           <button 
             className="p-2.5 rounded-2xl bg-surface border border-border opacity-30 hover:opacity-100 transition-all"
           >
             <Settings size={18} />
           </button>
        </div>
      </div>

      {/* ====================== DASHBOARD GRID ====================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left: Main Controls (8 units) */}
        <div className="xl:col-span-8 space-y-6">
           
           {/* Section: Management Pulse */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PulseCard 
                icon={<Video />} 
                label="Course Lessons" 
                value={course.totalLessons || 0} 
                sub="Modules Uploaded" 
                onClick={() => navigate(`/admin/resources/${id}`)}
                color={C.brand}
              />
              <PulseCard 
                icon={<Puzzle />} 
                label="Examination" 
                value="1 Active" 
                sub="Quiz Configured" 
                onClick={() => navigate(`/admin/quiz/${id}`)}
                color={C.accent}
              />
              <PulseCard 
                icon={<Users />} 
                label="Students" 
                value={course.enrollmentCount || 0} 
                sub="Total Enrolled" 
                color={C.success}
              />
           </div>

           {/* Section: Course Narrative (Overview) */}
           <div className="p-8 rounded-[2.5rem] bg-surface border border-border shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                 <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-surface2 text-brand/60"><BookOpen /></div>
                    <div>
                       <h3 className="text-sm font-black uppercase tracking-widest">Learning Outcomes</h3>
                       <p className="text-[10px] font-bold opacity-40 uppercase tracking-tight">Define what students will master</p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-3">
                 <input 
                   type="text" 
                   value={newPoint}
                   placeholder="New outcome point..."
                   onChange={(e) => setNewPoint(e.target.value)}
                   className="flex-1 px-5 py-3.5 rounded-2xl border text-sm font-medium focus:ring-2 transition-all"
                   style={{ background: 'var(--surface2)', borderColor: 'var(--border)', '--tw-ring-color': C.brand }}
                 />
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={handleAddPoint}
                   className="px-6 py-3.5 rounded-2xl bg-brand text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-brand/20"
                 >
                   Append
                 </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <AnimatePresence>
                    {overview.map((point, idx) => (
                       <motion.div 
                         key={idx}
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: idx * 0.05 }}
                         className="group p-4 rounded-3xl bg-surface2 border border-border/50 hover:border-brand/40 transition-all flex gap-3 items-start"
                       >
                          <div className="mt-1 w-4 h-4 rounded-full border-2 border-brand/20 flex items-center justify-center">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                          </div>
                          <p className="text-xs font-bold opacity-70 group-hover:opacity-100 transition-opacity leading-relaxed">{point}</p>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Right: Technical Specs (4 units) */}
        <div className="xl:col-span-4 space-y-6">
           
           {/* Section: Course Specs */}
           <div className="p-6 rounded-[2.5rem] bg-surface2/50 border border-border border-dashed space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 text-center">Technical Metadata</h4>
              
              <div className="space-y-4">
                 <SpecRow label="Duration" value={course.duration || 'N/A'} icon={<Clock size={14} />} />
                 <SpecRow label="Level" value={course.level} icon={<BarChart size={14} />} />
                 <SpecRow label="Market Price" value={`₹${course.price}`} icon={<Zap size={14} />} />
                 <SpecRow label="Instructor" value={course.instructor || 'Staff'} icon={<Users size={14} />} />
              </div>

              <div className="pt-4 border-t border-border/50 space-y-2">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Tags</p>
                 <div className="flex flex-wrap gap-2">
                    {(course.tags || '').split(',').map((tag, i) => (
                       <span key={i} className="px-3 py-1 rounded-lg bg-surface2 border border-border text-[9px] font-bold opacity-50">{tag.trim()}</span>
                    ))}
                 </div>
              </div>
           </div>

           {/* Section: Thumbnail Analysis */}
           <div className="rounded-[2.5rem] overflow-hidden border border-border shadow-xl bg-surface">
              <img src={course.imageUrl || 'https://via.placeholder.com/400x225'} className="w-full aspect-video object-cover" alt="" />
              <div className="p-6">
                 <h4 className="text-xs font-black uppercase mb-1">Catalog Visual</h4>
                 <p className="text-[10px] opacity-40 font-bold mb-4">Current marketplace thumbnail state.</p>
                 <button 
                   onClick={() => navigate(`/admin/courses/edit/${id}`)}
                   className="w-full py-3 rounded-2xl bg-surface2 border border-border text-[10px] font-black uppercase tracking-widest hover:bg-surface3 transition-all"
                 >
                   Swap Display Asset
                 </button>
              </div>
           </div>

           {/* Danger Zone */}
           <button className="w-full py-4 rounded-3xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              <Trash2 size={16} /> Purge Course Record
           </button>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const PulseCard = ({ icon, label, value, sub, onClick, color }) => (
  <motion.button
    whileHover={onClick ? { y: -5, scale: 1.02 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={`p-6 rounded-[2.5rem] bg-surface border border-border shadow-xl flex flex-col text-left gap-4 transition-all ${onClick ? 'cursor-pointer hover:border-brand/40 group' : 'cursor-default'}`}
  >
    <div className="flex items-center justify-between">
       <div className="p-3 rounded-2xl bg-surface2 transition-colors group-hover:bg-brand/10" style={{ color }}>
          {icon}
       </div>
       {onClick && <ArrowLeft className="rotate-180 opacity-20 group-hover:opacity-100 transition-all" size={16} />}
    </div>
    <div>
       <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{label}</p>
       <h4 className="text-xl font-black mt-1">{value}</h4>
       <p className="text-[10px] font-bold opacity-30 mt-0.5">{sub}</p>
    </div>
  </motion.button>
);

const SpecRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between">
     <div className="flex items-center gap-2 opacity-50">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
     </div>
     <span className="text-[11px] font-black uppercase">{value}</span>
  </div>
);


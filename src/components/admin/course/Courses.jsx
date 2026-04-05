import React, { useEffect, useState } from "react";
import apiClient from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { 
  Pencil, Trash, CheckCircle, XCircle, Plus, BookOpen, Layers, IndianRupee, 
  MoreVertical, Eye, Share2, Search, Filter, Book, Trash2, 
  Globe, Zap, ChevronRight, AlertCircle, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
  success: "#10B981",
  warning: "#F59E0B",
  surface: "var(--surface)",
  surface2: "var(--surface2)",
  surface3: "var(--surface3)",
  border: "var(--border)",
  textMuted: "var(--text-muted)"
};

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || authLoading) return;
    fetchCourses();
  }, [token, authLoading]);

  const fetchCourses = async () => {
    try {
      const res = await apiClient.get("/courses");
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err.message);
      toast.error("Failed to sync course catalog");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course permanently?")) return;
    const toastId = toast.loading("Removing course...");
    try {
      await apiClient.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success("Course purged successfully", { id: toastId });
    } catch (err) {
      toast.error("Delete failed. Still linked?", { id: toastId });
    }
  };

  const togglePublish = async (id, currentStatus) => {
    const toastId = toast.loading(currentStatus ? "Unpublishing..." : "Publishing...");
    try {
      await apiClient.patch(`/courses/${id}`, { isPublished: !currentStatus });
      setCourses((prev) => prev.map((c) => c._id === id ? { ...c, isPublished: !currentStatus } : c));
      toast.success(currentStatus ? "Course set to Draft" : "Course is now LIVE!", { id: toastId });
    } catch (err) {
      toast.error("Status update failed", { id: toastId });
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || c.category === filterCategory;
    const matchesStatus = filterStatus === "All" || 
      (filterStatus === "Published" ? c.isPublished : !c.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["All", ...new Set(courses.map(c => c.category))];

  return (
    <div className="space-y-6 pb-12">
      {/* ====================== HEADER & SEARCH ====================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
             Course <span style={{ color: C.brand }}>Catalog</span>
           </h2>
           <p className="text-sm opacity-40 font-bold uppercase tracking-widest mt-1">Inventory Management & Control</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-2xl border text-sm w-full md:w-64 transition-all focus:ring-2"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', '--tw-ring-color': C.brand }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/courses/new")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-tighter text-white shadow-xl"
            style={{ background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})` }}
          >
            <Plus size={18} /> Add New
          </motion.button>
        </div>
      </div>

      {/* ====================== FILTERS ====================== */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-[10px] uppercase font-black tracking-widest opacity-30 mr-2">Filters:</span>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all ${filterCategory === cat ? 'border-brand text-brand bg-brand/5' : 'border-border/50 opacity-50 hover:opacity-100'}`}
          >
            {cat}
          </button>
        ))}
        <div className="h-4 w-[1px] bg-border mx-2" />
        {["All", "Published", "Draft"].map(stat => (
          <button 
            key={stat} 
            onClick={() => setFilterStatus(stat)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all ${filterStatus === stat ? 'border-brand text-brand bg-brand/5' : 'border-border/50 opacity-50 hover:opacity-100'}`}
          >
            {stat}
          </button>
        ))}
      </div>

      {/* ====================== CATALOG GRID ====================== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
           <p className="text-xs font-black uppercase tracking-[0.2em] opacity-30">Syncing Catalog...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 rounded-[3rem] border border-dashed opacity-40" style={{ borderColor: 'var(--border)' }}>
           <BookOpen size={48} className="mx-auto mb-4" />
           <p className="text-lg font-black uppercase tracking-tight">Catalog is Empty</p>
           <p className="text-xs font-medium opacity-50 mt-1">No courses match your current search/filter criteria.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredCourses.map((course, idx) => (
              <AdminCourseCard 
                key={course._id} 
                course={course} 
                idx={idx} 
                onTogglePublish={togglePublish} 
                onDelete={deleteCourse}
                onEdit={(id) => navigate(`/admin/courses/edit/${id}`)}
                onView={(id) => navigate(`/admin/courses/${id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const AdminCourseCard = ({ course, idx, onTogglePublish, onDelete, onEdit, onView }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.4, delay: idx * 0.05 }}
    className="group relative flex flex-col rounded-[2.5rem] border shadow-2xl overflow-hidden hover:ring-2 transition-all"
    style={{ background: 'var(--surface)', borderColor: 'var(--border)', '--tw-ring-color': C.brand }}
  >
    {/* Image Area */}
    <div className="relative h-44 overflow-hidden bg-black/20" onClick={() => onView(course._id)}>
      <img
        src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
        alt={course.title}
        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] backdrop-blur-md bg-white/10 text-white border border-white/20 shadow-lg">
          {course.category}
        </span>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md bg-black/40 text-white border border-white/10 shadow-xl">
         <IndianRupee size={12} className="text-brand" />
         <span className="text-sm font-black tabular-nums">{course.price}</span>
      </div>
    </div>

    {/* Info Panel */}
    <div className="p-6 flex flex-col flex-1 gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="font-black text-base leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-brand transition-colors" style={{ color: 'var(--text)' }}>
          {course.title}
        </h3>
        <p className="text-[10px] font-bold opacity-30 truncate uppercase tracking-tight">By {course.instructor || 'Staff Instructor'}</p>
      </div>

      <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.1em] opacity-40">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface2 border border-border/10 focus:ring-1"><Layers size={12} /> {course.level}</span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface2 border border-border/10"><BookOpen size={12} /> {course.totalLessons || 0} MODULES</span>
      </div>

      {/* Advanced Status */}
      <div className="flex items-center justify-between pt-2">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-tighter ${course.isPublished ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]'}`}>
           <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${course.isPublished ? 'bg-emerald-400' : 'bg-amber-400'}`} />
           {course.isPublished ? 'Live on Marketplace' : 'Under Review / Draft'}
        </div>
      </div>

      {/* Management Matrix */}
      <div className="mt-4 pt-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
        <motion.button
          whileHover={{ scale: 1.05, background: course.isPublished ? C.error + '20' : C.brand + '20' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTogglePublish(course._id, course.isPublished)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1.25rem] text-[9px] font-black uppercase tracking-widest transition-all border border-border/10"
          style={{ 
            color: course.isPublished ? C.error : C.brand
          }}
        >
          {course.isPublished ? <XCircle size={14} /> : <CheckCircle size={14} />}
          {course.isPublished ? 'Unpublish' : 'Publish'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, background: 'var(--surface3)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(course._id)}
          className="p-2.5 rounded-xl transition-all border border-border/10 text-text-muted"
        >
          <Pencil size={14} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, background: C.error + '20', color: C.error }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(course._id)}
          className="p-2.5 rounded-xl transition-all border border-border/10 opacity-30 hover:opacity-100"
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export default Courses;

import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Library, Layout, Zap, GraduationCap, 
  Search, Filter, ChevronRight, BookOpen, 
  PlusCircle, Activity, Globe, Info
} from "lucide-react";
import apiClient from "../../../api/axiosConfig";

import toast from "react-hot-toast";

const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
  surface: "var(--surface)",
  surface2: "var(--surface2)",
  border: "var(--border)"
};

export const Resources = () => {
  const { token, loading: authLoading } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/courses");
      setCourses(response.data.data || []);
    } catch (e) {
      console.error("Resource course fetch error:", e);
      toast.error("Cloud synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || authLoading) return;
    fetchCourses();
  }, [token, authLoading]);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ====================== HEADER / SEARCH ====================== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-border/50">
        <div>
           <button 
             onClick={() => navigate("/admin/admindashboard")}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity mb-2"
           >
             Admin Control
           </button>
           <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
             Resource <span className="text-brand">Navigator</span>
           </h2>
           <p className="text-[11px] font-bold opacity-30 mt-1 uppercase tracking-wider">Catalog Management • Lesson Control • Quiz Architect</p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={16} />
          <input
            type="text"
            placeholder="Search catalog by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border transition-all text-sm font-medium outline-none focus:ring-2"
            style={{ 
              background: 'var(--surface)', 
              borderColor: 'var(--border)',
              '--tw-ring-color': 'rgba(var(--brand-rgb), 0.2)'
            }}
          />
        </div>
      </div>

      {/* ====================== CATALOG GRID ====================== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: C.brand }} />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Retrieving course library...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-32 opacity-20 border border-dashed border-border rounded-[3rem]">
           <Library size={64} className="mx-auto mb-4" />
           <h3 className="text-lg font-black uppercase tracking-widest">No Matches Identified</h3>
           <p className="text-[10px] font-bold">Try adjusting your search criteria or catalog filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
           <AnimatePresence>
             {filteredCourses.map((course, idx) => (
                <ResourceCourseCard 
                  key={course._id} 
                  course={course} 
                  idx={idx} 
                  onLessons={() => navigate(`/admin/resources/${course._id}`)}
                  onQuiz={() => navigate(`/admin/quiz/${course._id}`)}
                />
             ))}
           </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const ResourceCourseCard = ({ course, idx, onLessons, onQuiz }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: idx * 0.05 }}
    className="group relative flex flex-col rounded-[2.5rem] border bg-surface hover:bg-surface2 transition-all shadow-xl hover:shadow-2xl overflow-hidden"
    style={{ borderColor: 'var(--border)' }}
  >
    {/* Display Section */}
    <div className="relative h-44 overflow-hidden bg-black/20 p-4">
      <img
        src={course.imageUrl || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800"}
        alt={course.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      <div className="relative h-full flex flex-col justify-between">
         <div className="flex justify-between items-start">
            <span className="px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md bg-white/10 text-white border border-white/10">
              {course.category}
            </span>
            <div className={`w-3 h-3 rounded-full border-2 border-surface ${course.isPublished ? 'bg-emerald-500' : 'bg-amber-400'}`} />
         </div>
         
         <div className="space-y-1">
            <h3 className="font-black text-white text-base tracking-tight line-clamp-1">
               {course.title}
            </h3>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest flex items-center gap-2">
               <Info size={12} /> {course.level || 'Beginner'} Access
            </p>
         </div>
      </div>
    </div>

    {/* Controls Section */}
    <div className="p-6 space-y-4">
       <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-3xl bg-surface2 border border-border/50 flex flex-col items-center justify-center text-center">
             <span className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">Modules</span>
             <span className="text-xs font-black">{course.totalLessons || Math.floor(Math.random() * 20) + 5}</span>
          </div>
          <div className="p-3 rounded-3xl bg-surface2 border border-border/50 flex flex-col items-center justify-center text-center">
             <span className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">State</span>
             <span className={`text-[9px] font-black uppercase tracking-widest ${course.isPublished ? 'text-emerald-500' : 'text-amber-400'}`}>
                {course.isPublished ? 'Live' : 'Draft'}
             </span>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-3">
          <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={onLessons}
             className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-surface border border-border group-hover:border-brand/40"
          >
             <Layout size={14} className="text-brand" />
             Lessons
          </motion.button>
          <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={onQuiz}
             className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-surface border border-border group-hover:border-accent/40"
          >
             <Zap size={14} className="text-accent" />
             Quizzes
          </motion.button>
       </div>
    </div>
  </motion.div>
);

export default Resources;



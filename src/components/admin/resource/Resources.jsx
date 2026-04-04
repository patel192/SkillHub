import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Library, Layout, Zap, GraduationCap } from "lucide-react";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../context/AuthContext";

const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
};

export const Resources = () => {
  const { token, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || authLoading) return;
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get("/courses");
        setCourses(response.data.data || []);
      } catch (e) {
        console.error("Resource course fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token, authLoading]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
             Resource <span style={{ color: C.brand }}>Manager</span>
           </h2>
           <p className="text-sm opacity-50 mt-1">Select a course to manage lessons, quizzes, and educational assets.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <div className="w-10 h-10 border-4 border-t-transparent animate-spin rounded-full" style={{ borderColor: C.brand }} />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-24 rounded-3xl border border-dashed opacity-40" style={{ borderColor: 'var(--border)' }}>
           <Library size={48} className="mx-auto mb-4" />
           <p className="text-lg font-medium">No courses available to manage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <AnimatePresence>
             {courses.map((course, idx) => (
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
    className="group relative flex flex-col rounded-3xl border shadow-xl overflow-hidden bg-surface transition-all"
    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
  >
    <div className="relative h-40 overflow-hidden bg-black/20">
      <img
        src={course.imageUrl || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800"}
        alt={course.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      <div className="absolute top-4 left-4">
        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md bg-white/20 text-white">
          {course.category}
        </span>
      </div>
    </div>

    <div className="p-5 flex flex-col gap-3">
      <h3 className="font-bold text-base leading-tight line-clamp-2 min-h-[2.5rem]">
         {course.title}
      </h3>
      
      <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-black opacity-30">
         <span className="flex items-center gap-1.5"><GraduationCap size={14} /> Admin Tools</span>
      </div>

      <div className="flex gap-2 mt-2">
         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLessons}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-extrabold transition-all border bg-surface2 hover:bg-surface3"
            style={{ borderColor: 'var(--border)' }}>
            <Layout size={14} style={{ color: C.brand }} />
            Lessons
         </motion.button>
         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onQuiz}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-extrabold transition-all border bg-surface2 hover:bg-surface3"
            style={{ borderColor: 'var(--border)' }}>
            <Zap size={14} style={{ color: C.accent }} />
            Quizzes
         </motion.button>
      </div>
    </div>
  </motion.div>
);

export default Resources;

export default Resources;

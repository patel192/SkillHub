import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, CheckCircle, XCircle, Plus, BookOpen, Layers, IndianRupee, MoreVertical, Eye, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
};

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This action is permanent.")) return;
    try {
      await axios.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Course delete failed:", err.message);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await axios.patch(`/courses/${id}`, { isPublished: !currentStatus }, { headers: { Authorization: `Bearer ${token}` } });
      setCourses((prev) => prev.map((c) => c._id === id ? { ...c, isPublished: !currentStatus } : c));
    } catch (err) {
      console.error("Publish toggle failed:", err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
             Course <span style={{ color: C.brand }}>Catalog</span>
           </h2>
           <p className="text-sm opacity-50 mt-1">Create, edit, and publish educational content for your students.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/admin/courses/new")}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-white shadow-xl transition-all"
          style={{ background: `linear-gradient(135deg, var(--brand), var(--brand-light))` }}
        >
          <Plus size={20} />
          Create New Course
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <div className="w-10 h-10 border-4 border-t-transparent animate-spin rounded-full" style={{ borderColor: C.brand }} />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-24 rounded-3xl border border-dashed opacity-40" style={{ borderColor: 'var(--border)' }}>
           <BookOpen size={48} className="mx-auto mb-4" />
           <p className="text-lg font-medium">No courses found in the system yet.</p>
           <button onClick={() => navigate("/admin/courses/new")} className="mt-4 text-sm font-bold underline" style={{ color: C.brand }}>GET STARTED</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {courses.map((course, idx) => (
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
    transition={{ delay: idx * 0.05 }}
    className="group relative flex flex-col rounded-3xl border shadow-xl overflow-hidden"
    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
  >
    {/* Image / Thumbnail */}
    <div className="relative h-48 overflow-hidden bg-black/20">
      <img
        src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
        alt={course.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-white/20 text-white">
          {course.category}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 flex items-baseline gap-1">
        <span className="text-xl font-black text-white flex items-center">
          <IndianRupee size={16} />{course.price}
        </span>
      </div>
    </div>

    {/* Info Content */}
    <div className="p-5 flex flex-col flex-1 gap-2">
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-brand transition-colors" style={{ '--tw-text-opacity': 1, color: 'var(--text)' }}>
          {course.title}
        </h3>
      </div>

      <div className="flex items-center gap-4 text-[11px] opacity-40 font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><Layers size={14} /> {course.level}</span>
        <span className="flex items-center gap-1.5"><BookOpen size={14} /> {course.totalLessons || 0} Lessons</span>
      </div>

      {/* Badge State */}
      <div className="mt-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-sm ${course.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>
           {course.isPublished ? <CheckCircle size={10} /> : <Clock size={10} />}
           {course.isPublished ? 'Published & Active' : 'Draft / Unpublished'}
        </span>
      </div>

      {/* Admin Actions Bar */}
      <div className="mt-5 pt-4 border-t flex flex-wrap gap-2" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePublish(course._id, course.isPublished); }}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-bold transition-all border"
          style={{ 
            background: course.isPublished ? 'transparent' : 'var(--surface2)',
            borderColor: course.isPublished ? C.error : 'var(--border)',
            color: course.isPublished ? C.error : 'var(--text)'
          }}
        >
          {course.isPublished ? <XCircle size={14} /> : <CheckCircle size={14} />}
          {course.isPublished ? 'Unpublish' : 'Publish'}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onEdit(course._id); }}
          className="p-2.5 rounded-xl transition-colors border"
          style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(course._id); }}
          className="p-2.5 rounded-xl transition-colors hover:bg-red-400/10 hover:text-red-400 border border-transparent"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default Courses;

import React, { useState } from "react";
import apiClient from "../../../api/axiosConfig";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Save, Image as ImageIcon, Layout, 
  DollarSign, BarChart, Globe, Zap, CheckCircle, Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const C = {
  brand: "var(--brand)",
  brandDark: "var(--brand-dark)",
  accent: "var(--accent)",
  surface: "var(--surface)",
  surface2: "var(--surface2)",
  border: "var(--border)"
};

export const AddCourse = () => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "Web Development",
    imageUrl: "",
    price: 0,
    duration: "",
    level: "Beginner",
    language: "English",
    tags: "",
    isPublished: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || authLoading) return;
    
    setLoading(true);
    const toastId = toast.loading("Forging new course...");
    
    try {
      await apiClient.post("/course", formData);
      toast.success("Course created successfully!", { id: toastId });
      setTimeout(() => navigate("/admin/courses"), 1500);
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error(error.response?.data?.message || "Creation failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate("/admin/courses")}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </button>
        <div className="flex items-center gap-4">
           <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${formData.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>
              {formData.isPublished ? 'Live on Marketplace' : 'Draft Mode'}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Form Side (7 units) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-7 space-y-6"
        >
          <Section icon={<Layout />} title="Course Identity" subtitle="Fundamental details about your content">
             <div className="space-y-4">
                <InputGroup label="Course Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Master React in 30 Days" required />
                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="Instructor Name" name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Admin User" required />
                   <SelectGroup 
                      label="Category" 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      options={["Web Development", "Data Science", "Design", "Marketing", "AI", "Other"]} 
                   />
                </div>
                <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest opacity-30 px-1">Description</label>
                   <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-4 rounded-2xl border text-sm focus:ring-2 transition-all"
                      style={{ background: 'var(--surface2)', borderColor: 'var(--border)', '--tw-ring-color': C.brand }}
                      placeholder="What will students learn?..."
                   />
                </div>
             </div>
          </Section>

          <Section icon={<DollarSign />} title="Pricing & Logic" subtitle="Manage access and difficulty levels">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Price (INR)" type="number" name="price" value={formData.price} onChange={handleChange} icon={<Zap size={14} />} />
                <InputGroup label="Duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 12 Hours" />
                <SelectGroup label="Experience Level" name="level" value={formData.level} onChange={handleChange} options={["Beginner", "Intermediate", "Advanced"]} />
                <SelectGroup label="Language" name="language" value={formData.language} onChange={handleChange} options={["English", "Hindi", "Spanish", "French", "Other"]} />
             </div>
          </Section>

          <Section icon={<ImageIcon />} title="Media & Visibility" subtitle="How your course appears to others">
             <div className="space-y-4">
                <InputGroup label="Thumbnail URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://unsplash.com/..." />
                <InputGroup label="Tags (Comma separated)" name="tags" value={formData.tags} onChange={handleChange} placeholder="react, webdev, js" />
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-surface2 border border-border/50 cursor-pointer hover:border-brand/50 transition-all">
                   <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="w-5 h-5 rounded-lg border-2 border-brand text-brand focus:ring-0" />
                   <div className="flex flex-col">
                      <span className="text-sm font-black">Publish Immediately</span>
                      <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Enable students to enroll as soon as you save</span>
                   </div>
                </label>
             </div>
          </Section>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] text-white shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${C.brand}, var(--brand-light))` }}
          >
            {loading ? <div className="w-5 h-5 border-2 border-t-transparent animate-spin rounded-full" /> : <Save size={18} />}
            Forge Course
          </motion.button>
        </motion.div>

        {/* Preview Side (5 units) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-5 sticky top-8 space-y-6"
        >
          <div className="flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-widest opacity-30">
             <Info size={14} /> Live Marketplace Preview
          </div>
          
          <div className="p-4 rounded-[3.5rem] bg-surface/50 border border-border shadow-inner">
             <div className="rounded-[2.5rem] border bg-surface overflow-hidden shadow-2xl scale-[1.02] origin-top" style={{ borderColor: 'var(--border)' }}>
                <div className="h-48 bg-surface2 relative overflow-hidden">
                   {formData.imageUrl ? (
                      <img src={formData.imageUrl} className="w-full h-full object-cover" alt="" />
                   ) : (
                      <div className="flex flex-col items-center justify-center h-full opacity-20"><ImageIcon size={48} /> <p className="text-[10px] font-black uppercase mt-2">No Thumbnail</p></div>
                   )}
                   <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-black uppercase bg-white/10 backdrop-blur-md border border-white/20 text-white truncate max-w-[150px]">
                      {formData.category}
                   </div>
                </div>
                <div className="p-6 space-y-4">
                   <div className="space-y-1">
                      <h3 className="font-black text-lg line-clamp-1">{formData.title || 'Untitled Course'}</h3>
                      <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">By {formData.instructor || 'Staff Instructor'}</p>
                   </div>
                   <div className="flex items-center gap-2">
                       <div className="px-2 py-0.5 rounded bg-surface2 border border-border/10 text-[9px] font-black opacity-40 uppercase">{formData.level}</div>
                       <div className="px-2 py-0.5 rounded bg-surface2 border border-border/10 text-[9px] font-black opacity-40 uppercase">{formData.duration || '0 Hours'}</div>
                   </div>
                   <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-xl font-black text-brand">₹{formData.price || 0}</span>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-surface2 rounded-full border border-border/50 opacity-50">
                         <Zap size={10} className="text-brand" />
                         <span className="text-[8px] font-black uppercase">Instant Access</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface2/50 border border-border border-dashed space-y-3">
             <h4 className="text-xs font-black uppercase tracking-widest opacity-40 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Catalog Standards</h4>
             <ul className="space-y-1.5">
                {['High quality thumbnails (16:9)', 'Engaging title & SEO tags', 'Detailed breakdown of modules'].map((item, i) => (
                   <li key={i} className="text-[10px] font-bold opacity-60 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-brand" /> {item}
                   </li>
                ))}
             </ul>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// ==========================================
// FORM COMPONENTS
// ==========================================

const Section = ({ icon, title, subtitle, children }) => (
  <div className="p-8 rounded-[2.5rem] bg-surface border border-border shadow-xl space-y-6">
     <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-surface2 text-brand/60">{icon}</div>
        <div>
           <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
           <p className="text-[10px] font-bold opacity-40 uppercase tracking-tight">{subtitle}</p>
        </div>
     </div>
     {children}
  </div>
);

const InputGroup = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-1.5 group">
     <label className="text-[10px] font-black uppercase tracking-widest opacity-30 px-1">{label}</label>
     <div className="relative">
        {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand/40">{icon}</div>}
        <input 
           {...props} 
           className="w-full px-4 py-3.5 rounded-2xl border text-sm font-medium focus:ring-2 transition-all"
           style={{ background: 'var(--surface2)', borderColor: 'var(--border)', '--tw-ring-color': C.brand }}
        />
     </div>
  </div>
);

const SelectGroup = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1.5 focus-within:scale-[1.02] transition-transform">
     <label className="text-[10px] font-black uppercase tracking-widest opacity-30 px-1">{label}</label>
     <select 
        {...props} 
        className="w-full px-4 py-3.5 rounded-2xl border text-sm font-bold focus:ring-2 transition-all appearance-none cursor-pointer"
        style={{ background: 'var(--surface2)', borderColor: 'var(--border)', '--tw-ring-color': C.brand }}
     >
        {options.map(opt => <option key={opt}>{opt}</option>)}
     </select>
  </div>
);


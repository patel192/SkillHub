import apiClient from "../../../api/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, User, BookOpen, MessageSquare, ChevronRight, Filter, Clock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const C = {
  brand: "var(--brand)",
  brandLight: "var(--brand-light)",
  accent: "var(--accent)",
  error: "var(--error)",
  success: "#22C55E",
};

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!token || authLoading) return;
    const fetchReports = async () => {
      try {
        const res = await apiClient.get("/reports");
        setReports(res.data?.reports || []);
      } catch (err) {
        console.error("❌ Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [token, authLoading]);

  const getTargetIcon = (type) => {
    switch (type) {
      case "User": return <User className="opacity-50" size={16} />;
      case "Course": return <BookOpen className="opacity-50" size={16} />;
      case "Post": return <MessageSquare className="opacity-50" size={16} />;
      default: return <AlertTriangle className="opacity-50" size={16} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
             System <span style={{ color: C.brand }}>Reports</span>
           </h2>
           <p className="text-sm opacity-50 mt-1">Review user-submitted reports for courses, profiles, and community posts.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <div className="w-10 h-10 border-4 border-t-transparent animate-spin rounded-full" style={{ borderColor: C.brand }} />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-24 rounded-3xl border border-dashed opacity-40" style={{ borderColor: 'var(--border)' }}>
           <AlertTriangle size={48} className="mx-auto mb-4" />
           <p className="text-lg font-medium">No reports currently in the queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {reports.map((r, idx) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/admin/reports/${r._id}`)}
                className="group relative p-6 rounded-3xl border shadow-xl flex flex-col gap-4 cursor-pointer transition-all hover:scale-[1.01]"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl transition-colors" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                       {getTargetIcon(r.targetType)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{r.targetType}</p>
                      <h3 className="font-bold text-sm leading-tight text-white line-clamp-1">
                        {r.targetType === "User" ? r.targetId?.fullname : r.targetType === "Course" ? r.targetId?.title : "System Post"}
                      </h3>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${r.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>
                    {r.status || 'pending'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl border bg-white/5" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-[13px] opacity-70 italic line-clamp-2 leading-relaxed">
                    "{r.description || "No description provided"}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black">{r.reporter?.fullname?.[0] || 'A'}</div>
                    <span className="text-[11px] opacity-40">By {r.reporter?.fullname || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-40 text-[10px] font-bold">
                     <Clock size={12} />
                     {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};


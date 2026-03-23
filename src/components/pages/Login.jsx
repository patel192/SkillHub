import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Github,
  Chrome,
  ChevronLeft,
  Loader2
} from "lucide-react";

// ==========================================
// ANIMATION VARIANTS
// ==========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const shakeVariants = {
  shake: {
    x: [0, -8, 8, -8, 8, 0],
    transition: { duration: 0.4 }
  }
};

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const FloatingBlob = ({ color, delay = 0, className }) => (
  <motion.div
    animate={{ 
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2],
      x: [0, 20, -20, 0],
      y: [0, -20, 20, 0]
    }}
    transition={{ 
      duration: 10,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`}
    style={{ background: color }}
  />
);

const InputField = ({ 
  icon: Icon, 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  error, 
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  placeholder,
  autoComplete
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div variants={itemVariants} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-300">
          {label}
        </label>
        {error && (
          <motion.span 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-400 text-xs flex items-center gap-1"
          >
            <AlertCircle size={12} />
            {error}
          </motion.span>
        )}
      </div>
      
      <motion.div
        animate={{
          boxShadow: isFocused 
            ? "0 0 0 2px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.15)"
            : error 
              ? "0 0 0 1px rgba(239, 68, 68, 0.5)"
              : "0 0 0 1px rgba(255, 255, 255, 0.1)"
        }}
        className="relative rounded-xl overflow-hidden bg-slate-900/50 backdrop-blur-sm transition-all duration-200"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={18} />
        </div>
        
        <input
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full pl-12 pr-12 py-3.5 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

const SocialButton = ({ icon: Icon, label, onClick }) => (
  <motion.button
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm"
  >
    <Icon size={18} />
    <span>{label}</span>
  </motion.button>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export const Login = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const formRef = useRef(null);
  
  const [form, setForm] = useState({ 
    email: "", 
    password: "",
    rememberMe: false 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      controls.start("shake");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/loginuser", form);
      
      if (res.status === 200) {
        const { data, token } = res.data;

        // Store auth data
        localStorage.setItem("token", token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("fullname", data.fullname);
        localStorage.setItem("role", data.role);
        
        // Remember me functionality
        if (form.rememberMe) {
          localStorage.setItem("rememberedEmail", form.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Success animation before redirect
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Redirect based on role
        navigate(
          data.role === "admin"
            ? "/admin/admindashboard"
            : "/user/dashboard"
        );
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid email or password";
      setErrors({ 
        submit: errorMessage 
      });
      controls.start("shake");
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setForm(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden relative">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBlob 
          color="radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)"
          delay={0}
          className="w-[500px] h-[500px] -top-20 -left-20"
        />
        <FloatingBlob 
          color="radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)"
          delay={2}
          className="w-[400px] h-[400px] bottom-0 right-0"
        />
        <FloatingBlob 
          color="radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)"
          delay={4}
          className="w-[300px] h-[300px] top-1/2 left-1/3"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Left Panel - Branding */}
      <motion.div 
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 border-r border-white/5"
        style={{
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
        }}
      >
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-white">SkillHub</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Welcome back to{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SkillHub
              </span>
            </h1>
            <p className="text-lg text-slate-400">
              Continue your journey to mastery. Your next project awaits.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "120K+", label: "Learners" },
              { value: "500+", label: "Projects" }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Feature List */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-3"
          >
            {[
              { icon: Zap, text: "Pick up where you left off" },
              { icon: Shield, text: "Secure, encrypted connection" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="flex items-center gap-3 text-slate-300 text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <feature.icon size={16} className="text-indigo-400" />
                </div>
                {feature.text}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative z-10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
        >
          <p className="text-slate-300 mb-4 text-sm leading-relaxed">"SkillHub's project-based approach helped me land my dream job at a Fortune 500 company. The mentorship was invaluable."</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              SM
            </div>
            <div>
              <div className="text-white font-medium text-sm">Sarah Miller</div>
              <div className="text-xs text-slate-500">Senior Developer at Microsoft</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
        <motion.div
          ref={formRef}
          variants={shakeVariants}
          animate={controls}
          initial="hidden"
          className="w-full max-w-md"
        >
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SkillHub</span>
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/50"
          >
            <motion.div variants={itemVariants} className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400 text-sm">Sign in to continue your learning journey</p>
            </motion.div>

            {/* Social Login */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
              <SocialButton icon={Github} label="GitHub" />
              <SocialButton icon={Chrome} label="Google" />
            </motion.div>

            <motion.div variants={itemVariants} className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-slate-900/50 text-slate-500">Or continue with email</span>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                icon={Mail}
                label="Email Address"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="name@company.com"
                autoComplete="username"
              />

              <div className="space-y-2">
                <InputField
                  icon={Lock}
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  showPasswordToggle
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-white/20 bg-slate-900 text-indigo-500 focus:ring-indigo-500/20"
                    />
                    <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                  </label>
                  
                  <Link 
                    to="/forgot-password" 
                    className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                  >
                    <AlertCircle size={16} />
                    {errors.submit}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.p variants={itemVariants} className="mt-6 text-center text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                Create account
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.p>

            <motion.p variants={itemVariants} className="mt-6 text-center text-xs text-slate-600">
              Protected by reCAPTCHA and subject to our{" "}
              <a href="#" className="text-slate-500 hover:text-slate-400 transition-colors">Privacy Policy</a>
              {" "}and{" "}
              <a href="#" className="text-slate-500 hover:text-slate-400 transition-colors">Terms of Service</a>
            </motion.p>
          </motion.div>

          {/* Back to Home */}
          <motion.div 
            variants={itemVariants}
            className="mt-6 text-center"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
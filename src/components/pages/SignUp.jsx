import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Shield, 
  Zap, 
  Mail, 
  Lock, 
  User, 
  AlertCircle,
  Github,
  Chrome,
  ChevronLeft
} from "lucide-react";

// ==========================================
// ANIMATION VARIANTS
// ==========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const FloatingBlob = ({ color, delay = 0, className }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ 
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      x: [0, 30, -30, 0],
      y: [0, -30, 30, 0]
    }}
    transition={{ 
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
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
  placeholder 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <motion.div variants={itemVariants} className="space-y-2">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        {label}
        {error && (
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-red-400 text-xs flex items-center gap-1"
          >
            <AlertCircle size={12} />
            {error}
          </motion.span>
        )}
      </label>
      
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? "0 0 0 2px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.2)"
            : "0 0 0 1px rgba(255, 255, 255, 0.1)"
        }}
        className="relative rounded-xl overflow-hidden bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={18} />
        </div>
        
        <input
          ref={inputRef}
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-slate-500 outline-none"
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        
        {value && !error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400"
          >
            <CheckCircle2 size={18} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const SocialButton = ({ icon: Icon, label, onClick, delay }) => (
  <motion.button
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300"
  >
    <Icon size={20} />
    <span>{label}</span>
  </motion.button>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export const SignUp = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const formRef = useRef(null);
  
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "user",
    avatar: "",
    isActive: "true",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullname.trim()) newErrors.fullname = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be 8+ characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      const res = await axios.post("/user", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Success animation before redirect
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate("/login");
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.message || "Signup failed. Please try again." 
      });
      controls.start("shake");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Account", description: "Basic info" },
    { title: "Security", description: "Create password" },
    { title: "Verify", description: "Confirm email" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden relative">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBlob 
          color="radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)"
          delay={0}
          className="w-[600px] h-[600px] -top-40 -left-40"
        />
        <FloatingBlob 
          color="radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)"
          delay={2}
          className="w-[500px] h-[500px] top-1/2 right-0"
        />
        <FloatingBlob 
          color="radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)"
          delay={4}
          className="w-[400px] h-[400px] bottom-0 left-1/3"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Left Panel - Branding */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 border-r border-white/5"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
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

        <div className="relative z-10 space-y-8">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl xl:text-6xl font-bold leading-tight"
          >
            Start your journey to{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              mastery
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-slate-400 max-w-md"
          >
            Join 120,000+ developers learning by building real-world projects with expert mentorship.
          </motion.p>

          {/* Feature List */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="space-y-4"
          >
            {[
              { icon: Zap, text: "AI-powered learning paths" },
              { icon: Shield, text: "Industry-recognized certificates" },
              { icon: CheckCircle2, text: "Job placement assistance" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="flex items-center gap-3 text-slate-300"
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
          transition={{ delay: 1, duration: 0.8 }}
          className="relative z-10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
        >
          <p className="text-slate-300 mb-4">"SkillHub transformed my career. I went from bootcamp grad to senior engineer in 18 months."</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              AC
            </div>
            <div>
              <div className="text-white font-medium">Alex Chen</div>
              <div className="text-sm text-slate-500">Senior Engineer at Google</div>
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

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center">
                  <motion.div
                    animate={{
                      backgroundColor: idx <= currentStep ? "rgb(99, 102, 241)" : "rgba(255,255,255,0.1)",
                      scale: idx === currentStep ? 1.1 : 1
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  >
                    {idx + 1}
                  </motion.div>
                  {idx < steps.length - 1 && (
                    <div className={`w-12 sm:w-20 h-0.5 mx-2 ${idx < currentStep ? "bg-indigo-500" : "bg-white/10"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              {steps.map((step, idx) => (
                <span key={idx} className={idx === currentStep ? "text-indigo-400" : ""}>
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/50"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
              <p className="text-slate-400">Enter your details to get started</p>
            </motion.div>

            {/* Social Sign Up */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
              <SocialButton icon={Github} label="GitHub" />
              <SocialButton icon={Chrome} label="Google" />
            </motion.div>

            <motion.div variants={itemVariants} className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900/50 text-slate-500">Or continue with email</span>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                icon={User}
                label="Full Name"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                error={errors.fullname}
                placeholder="John Doe"
              />

              <InputField
                icon={Mail}
                label="Email Address"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="john@example.com"
              />

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
              />

              {/* Password Strength Indicator */}
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        form.password.length >= level * 2 
                          ? level <= 2 ? "bg-red-500" : level === 3 ? "bg-yellow-500" : "bg-green-500"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Must be at least 8 characters with numbers and symbols
                </p>
              </motion.div>

              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                >
                  <AlertCircle size={16} />
                  {errors.submit}
                </motion.div>
              )}

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.p variants={itemVariants} className="mt-6 text-center text-slate-400 text-sm">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors inline-flex items-center gap-1 group"
              >
                Sign in
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.p>

            <motion.p variants={itemVariants} className="mt-6 text-center text-xs text-slate-600">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
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

export default SignUp;
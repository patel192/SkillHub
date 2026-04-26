import { useSelector } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosConfig";
import {
  Eye, EyeOff, ArrowRight, CheckCircle2, Sparkles,
  Shield, Zap, Mail, Lock, User, AlertCircle,
  Github, Chrome, ChevronLeft, Code,
} from "lucide-react";


// ─────────────────────────────────────────
// DESIGN TOKENS — matches PublicLayout
// ─────────────────────────────────────────
const C = {
  brand:      "#16A880",
  brandDark:  "#0D7A5F",
  brandLight: "#1FC99A",
  accent:     "#F59E0B",
  bg:         "#0A0F0D",
  surface:    "#111814",
  surface2:   "#182219",
  surface3:   "#1E2B22",
  border:     "rgba(22,168,128,0.15)",
  borderHov:  "rgba(22,168,128,0.40)",
  text:       "#E8F5F0",
  textMuted:  "#7A9E8E",
  textDim:    "#3D5C4E",
  error:      "#F87171",
  errorBg:    "rgba(248,113,113,0.08)",
  errorBorder:"rgba(248,113,113,0.25)",
  success:    "#34D399",
};

// ─────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
};
const shakeVariants = {
  shake: { x: [0, -10, 10, -8, 8, 0], transition: { duration: 0.45 } },
};

// ─────────────────────────────────────────
// PASSWORD STRENGTH
// ─────────────────────────────────────────
const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8)               score++;
  if (/[A-Z]/.test(pwd))            score++;
  if (/[0-9]/.test(pwd))            score++;
  if (/[^A-Za-z0-9]/.test(pwd))     score++;
  return score;
};
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", C.error, C.accent, "#FBBF24", C.success];

// ─────────────────────────────────────────
// FLOATING AMBIENT BLOB
// ─────────────────────────────────────────
const FloatingBlob = ({ style, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35], x: [0, 24, -24, 0], y: [0, -24, 24, 0] }}
    transition={{ duration: 9, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute rounded-full blur-[110px] pointer-events-none"
    style={style}
  />
);

// ─────────────────────────────────────────
// INPUT FIELD
// ─────────────────────────────────────────
const InputField = ({
  icon: Icon, label, type = "text", name, value, onChange,
  error, showPasswordToggle, showPassword, onTogglePassword, placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  const strength = name === "password" ? getStrength(value) : 0;
  const hasValue  = value && value.length > 0;
  const isValid   = hasValue && !error;

  return (
    <motion.div variants={itemVariants} className="space-y-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {label}
        </label>
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[12px] flex items-center gap-1"
              style={{ color: C.error }}
            >
              <AlertCircle size={11} />
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Input wrapper */}
      <motion.div
        animate={{
          boxShadow: error
            ? `0 0 0 1.5px ${C.errorBorder}`
            : focused
            ? `0 0 0 1.5px ${C.brand}88, 0 0 20px ${C.brand}18`
            : `0 0 0 1px ${"var(--border)"}`,
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-xl overflow-hidden"
        style={{ background: "var(--surface2)" }}
      >
        {/* Left icon */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
          style={{ color: focused ? C.brand : "var(--text-muted)" }}
        >
          <Icon size={17} />
        </div>

        <input
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={name === "password" ? "new-password" : name}
          className="w-full pl-11 pr-11 py-4 bg-transparent outline-none text-[15px] placeholder-[#3D5C4E]"
          style={{ color: "var(--text)" }}
        />

        {/* Right — toggle or checkmark */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {showPasswordToggle ? (
            <button
              type="button"
              onClick={onTogglePassword}
              className="transition-colors duration-200"
              style={{ color: focused ? C.brand : "var(--text-muted)" }}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          ) : (
            <AnimatePresence>
              {isValid && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <CheckCircle2 size={16} style={{ color: C.success }} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Password strength bar */}
      {name === "password" && hasValue && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 pt-0.5">
          <div className="flex gap-1.5 h-1">
            {[1, 2, 3, 4].map((lvl) => (
              <motion.div
                key={lvl}
                className="flex-1 rounded-full"
                animate={{ background: strength >= lvl ? strengthColor[strength] : "var(--surface3)" }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          <p className="text-[11px]" style={{ color: strengthColor[strength] || "var(--text-muted)" }}>
            {strengthLabel[strength] || "Enter a password"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────
// SOCIAL BUTTON
// ─────────────────────────────────────────
const SocialButton = ({ icon: Icon, label }) => (
  <motion.button
    variants={itemVariants}
    whileHover={{ y: -2, boxShadow: `0 4px 20px ${C.brand}18` }}
    whileTap={{ scale: 0.97 }}
    type="button"
    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-[14px] font-medium border transition-all duration-200"
    style={{ background: "var(--surface3)", borderColor: "var(--border)", color: "var(--text-muted)" }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
  >
    <Icon size={18} />
    {label}
  </motion.button>
);

// ─────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────
const steps = [
  { title: "Account", desc: "Basic info" },
  { title: "Security", desc: "Password" },
  { title: "Done", desc: "Verify" },
];

const StepIndicator = ({ current }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              animate={{
                background: idx <= current
                  ? `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`
                  : "var(--surface3)",
                scale: idx === current ? 1.12 : 1,
                boxShadow: idx === current ? `0 0 16px ${C.brand}55` : "none",
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white border"
              style={{ borderColor: idx <= current ? C.brand : "var(--border)" }}
            >
              {idx < current ? <CheckCircle2 size={14} /> : idx + 1}
            </motion.div>
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: idx === current ? C.brand : "var(--text-muted)" }}
            >
              {step.title}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 mx-3 h-[1.5px] rounded-full" style={{ background: idx < current ? C.brand : "var(--surface3)" }} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────
// LEFT PANEL FEATURE LIST
// ─────────────────────────────────────────
const FEATURES = [
  { icon: Zap,          text: "AI-powered personalized learning paths" },
  { icon: Shield,       text: "Industry-recognized certificates" },
  { icon: CheckCircle2, text: "Job placement assistance" },
];

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export const SignUp = () => {
  const navigate = useNavigate();
  const { token, userId } = useSelector((state) => state.auth);
  const controls = useAnimation();
  const formRef = useRef(null);

  const [form, setForm] = useState({
    fullname: "", email: "", password: "",
    role: "user", avatar: "", isActive: "true",
    
  });
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors,       setErrors]       = useState({});
  const [currentStep,  setCurrentStep]  = useState(0);
  const [mousePos,     setMousePos]     = useState({ x: 0, y: 0 });
  const [submitted,    setSubmitted]    = useState(false);

  // Parallax mouse tracking for left panel
  useEffect(() => {
    const onMove = (e) => setMousePos({
      x: (e.clientX / window.innerWidth  - 0.5) * 18,
      y: (e.clientY / window.innerHeight - 0.5) * 18,
    });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.fullname.trim())                          errs.fullname = "Required";
    if (!form.email.trim())                             errs.email    = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email))         errs.email    = "Invalid email";
    if (!form.password)                                 errs.password = "Required";
    else if (form.password.length < 8)                  errs.password = "Min 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
    // Step hint
    if (name === "fullname" || name === "email") setCurrentStep(0);
    if (name === "password") setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { controls.start("shake"); return; }
    setLoading(true);
    try {
      const signupForm = {
        ...form,
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      };
      const res = await apiClient.post("/user", signupForm);
       const { user, token } = res.data;
        
        dispatch(loginSuccess({ user, token, role: user.role }));
        
        setSubmitted(true);
      setCurrentStep(2);
      await new Promise((r) => setTimeout(r, 1100));
      navigate("/login");
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Signup failed. Please try again." });
      controls.start("shake");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden relative"
      style={{ background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}
    >
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* ── AMBIENT BACKGROUND ─────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingBlob delay={0} style={{ width: 520, height: 520, top: -120, left: -120, background: `radial-gradient(circle, ${C.brand}28 0%, transparent 70%)` }} />
        <FloatingBlob delay={3} style={{ width: 420, height: 420, bottom: 0, right: "10%", background: "radial-gradient(circle, #6366F128 0%, transparent 70%)" }} />
        <FloatingBlob delay={6} style={{ width: 340, height: 340, bottom: "20%", left: "35%", background: `radial-gradient(circle, ${C.accent}18 0%, transparent 70%)` }} />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${C.brand}14 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 50%, transparent 100%)",
          }}
        />
      </div>

      {/* ── LEFT PANEL — Branding ──────────────── */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 xl:p-16 border-r"
        style={{
          borderColor: "var(--border)",
          transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
        }}
      >
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 group z-10 relative">
          <motion.div
            whileHover={{ scale: 1.06, rotate: 6 }}
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`, boxShadow: `0 0 24px ${C.brand}44` }}
          >
            <Code className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}>
            SkillHub
          </span>
        </Link>

        {/* Hero copy */}
        <div className="relative z-10 space-y-7">
          <motion.h1
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Start your journey{" "}
            <br />
            to{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              mastery
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[17px] leading-relaxed max-w-md"
            style={{ color: "var(--text-muted)" }}
          >
            Join 120,000+ developers learning by building real-world projects
            with expert mentorship and AI-powered paths.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            {FEATURES.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.78 + idx * 0.1 }}
                className="flex items-center gap-3 text-[15px]"
                style={{ color: "var(--text-muted)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${C.brand}18`, border: `1px solid ${"var(--border)"}` }}
                >
                  <f.icon size={15} style={{ color: C.brand }} />
                </div>
                {f.text}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Testimonial card */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="relative z-10 p-5 rounded-2xl border"
          style={{ background: "var(--surface2)", borderColor: "var(--border)" }}
        >
          {/* Quote mark */}
          <span className="text-3xl font-bold leading-none" style={{ color: `${C.brand}44` }}>"</span>
          <p className="text-[14px] leading-relaxed -mt-1 mb-4" style={{ color: "var(--text-muted)" }}>
            SkillHub transformed my career. I went from bootcamp grad to senior
            engineer in 18 months.
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})` }}
            >
              AC
            </div>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Alex Chen</p>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Senior Engineer at Google</p>
            </div>
            {/* Stars */}
            <div className="ml-auto flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[12px]" style={{ color: C.accent }}>★</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── RIGHT PANEL — Form ─────────────────── */}
      <div
        className="w-full lg:w-[52%] flex items-center justify-center p-6 sm:p-10 lg:p-14 relative"
        style={{ minHeight: "100vh" }}
      >
        <motion.div
          ref={formRef}
          variants={shakeVariants}
          animate={controls}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})` }}
              >
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                SkillHub
              </span>
            </Link>
          </div>

          {/* Step indicator */}
          <StepIndicator current={currentStep} />

          {/* Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl p-7 sm:p-8 border shadow-2xl"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: `0 32px 64px ${"var(--bg)"}88, 0 0 0 1px ${"var(--border)"}`,
            }}
          >
            {/* Heading */}
            <motion.div variants={itemVariants} className="mb-6">
              <h2
                className="text-[28px] font-bold mb-1"
                style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
              >
                Create your account
              </h2>
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                Enter your details to get started for free
              </p>
            </motion.div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <SocialButton icon={Github}  label="GitHub" />
              <SocialButton icon={Chrome}  label="Google" />
            </div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "var(--border)" }} />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-3 text-[12px] font-medium uppercase tracking-wider"
                  style={{ background: "var(--surface)", color: "var(--text-muted)" }}
                >
                  Or continue with email
                </span>
              </div>
            </motion.div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                onTogglePassword={() => setShowPassword((p) => !p)}
                placeholder="Min. 8 characters"
              />

              {/* Submit error */}
              <AnimatePresence>
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 rounded-xl flex items-center gap-2.5 text-[13px]"
                    style={{
                      background: C.errorBg,
                      border: `1px solid ${C.errorBorder}`,
                      color: C.error,
                    }}
                  >
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {errors.submit}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: `0 0 32px ${C.brand}55` }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-bold text-[16px] text-white flex items-center justify-center gap-2 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: submitted
                    ? C.success
                    : `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  boxShadow: `0 0 24px ${C.brand}44`,
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Account Created!
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign in link */}
            <motion.p
              variants={itemVariants}
              className="mt-5 text-center text-[13px]"
              style={{ color: "var(--text-muted)" }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold inline-flex items-center gap-1 group transition-colors"
                style={{ color: C.brand }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.brandLight)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.brand)}
              >
                Sign in
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.p>

            {/* Legal */}
            <motion.p
              variants={itemVariants}
              className="mt-5 text-center text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              By creating an account, you agree to our{" "}
              <a
                href="#"
                className="transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text)")}
              >
                Privacy Policy
              </a>
            </motion.p>
          </motion.div>

          {/* Back to home */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[13px] transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
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
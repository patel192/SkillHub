import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosConfig";
import {
  Eye, EyeOff, ArrowRight, Mail, Lock, AlertCircle,
  CheckCircle2, Shield, Zap, Github, Chrome, ChevronLeft,
  Loader2, Code, TrendingUp, Users,
} from "lucide-react";

// ─────────────────────────────────────────
// DESIGN TOKENS — identical to PublicLayout & SignUp
// ─────────────────────────────────────────
const C = {
  brand:       "#16A880",
  brandDark:   "#0D7A5F",
  brandLight:  "#1FC99A",
  accent:      "#F59E0B",
  bg:          "#0A0F0D",
  surface:     "#111814",
  surface2:    "#182219",
  surface3:    "#1E2B22",
  border:      "rgba(22,168,128,0.15)",
  borderHov:   "rgba(22,168,128,0.40)",
  text:        "#E8F5F0",
  textMuted:   "#7A9E8E",
  textDim:     "#3D5C4E",
  error:       "#F87171",
  errorBg:     "rgba(248,113,113,0.08)",
  errorBorder: "rgba(248,113,113,0.25)",
  success:     "#34D399",
};

// ─────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 15 } },
};
const shakeVariants = {
  shake: { x: [0, -9, 9, -7, 7, 0], transition: { duration: 0.42 } },
};

// ─────────────────────────────────────────
// FLOATING AMBIENT BLOB
// ─────────────────────────────────────────
const FloatingBlob = ({ style, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.75 }}
    animate={{
      scale:   [1, 1.18, 1],
      opacity: [0.3, 0.5, 0.3],
      x: [0, 22, -22, 0],
      y: [0, -22, 22, 0],
    }}
    transition={{ duration: 10, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute rounded-full blur-[120px] pointer-events-none"
    style={style}
  />
);

// ─────────────────────────────────────────
// INPUT FIELD
// ─────────────────────────────────────────
const InputField = ({
  icon: Icon, label, type = "text", name, value,
  onChange, error, showPasswordToggle, showPassword,
  onTogglePassword, placeholder, autoComplete,
  rightSlot,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div variants={itemVariants} className="space-y-1.5">
      {/* Label + error row */}
      <div className="flex items-center justify-between">
        <label
          className="text-[13px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text)"Muted }}
        >
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
            ? `0 0 0 1.5px ${C.brand}88, 0 0 22px ${C.brand}18`
            : `0 0 0 1px ${"var(--border)"}`,
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-xl overflow-hidden"
        style={{ background: "var(--surface)"2 }}
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
          autoComplete={autoComplete}
          className="w-full pl-11 pr-12 py-4 bg-transparent outline-none text-[15px] placeholder-[#3D5C4E]"
          style={{ color: "var(--text)" }}
        />

        {/* Right slot — eye toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{ color: focused ? C.brand : "var(--text-muted)" }}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </motion.div>

      {/* Optional slot below (e.g. remember me / forgot) */}
      {rightSlot}
    </motion.div>
  );
};

// ─────────────────────────────────────────
// SOCIAL BUTTON
// ─────────────────────────────────────────
const SocialButton = ({ icon: Icon, label }) => (
  <motion.button
    variants={itemVariants}
    whileHover={{ y: -2, boxShadow: `0 6px 22px ${C.brand}18` }}
    whileTap={{ scale: 0.97 }}
    type="button"
    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-[14px] font-medium border transition-all duration-200"
    style={{ background: "var(--surface)"3, borderColor: "var(--border)", color: "var(--text)"Muted }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "var(--border)"Hov;
      e.currentTarget.style.color = "var(--text)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "var(--border)";
      e.currentTarget.style.color = "var(--text)"Muted;
    }}
  >
    <Icon size={17} />
    {label}
  </motion.button>
);

// ─────────────────────────────────────────
// LEFT PANEL DATA
// ─────────────────────────────────────────
const QUICK_STATS = [
  { value: "120K+", label: "Active Learners",  icon: Users },
  { value: "98%",   label: "Placement Rate",   icon: TrendingUp },
];
const FEATURES = [
  { icon: Zap,    text: "Pick up exactly where you left off" },
  { icon: Shield, text: "Secure, end-to-end encrypted session" },
];

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export const Login = () => {
  const navigate  = useNavigate();
  const controls  = useAnimation();
  const formRef   = useRef(null);

  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});
  const [success,      setSuccess]      = useState(false);
  const [mousePos,     setMousePos]     = useState({ x: 0, y: 0 });

  // Load remembered email
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) setForm((p) => ({ ...p, email: remembered, rememberMe: true }));
  }, []);

  // Parallax for left panel
  useEffect(() => {
    const onMove = (e) =>
      setMousePos({
        x: (e.clientX / window.innerWidth  - 0.5) * 16,
        y: (e.clientY / window.innerHeight - 0.5) * 16,
      });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.email.trim())                           errs.email    = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email))       errs.email    = "Invalid email";
    if (!form.password)                               errs.password = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { controls.start("shake"); return; }
    setLoading(true);
    try {
      const res = await apiClient.post("/loginuser", form);
      if (res.status === 200) {
        const { data, token } = res.data;
        localStorage.setItem("token",    token);
        localStorage.setItem("userId",   data.id);
        localStorage.setItem("fullname", data.fullname);
        localStorage.setItem("role",     data.role);
        if (form.rememberMe) localStorage.setItem("rememberedEmail", form.email);
        else                 localStorage.removeItem("rememberedEmail");

        setSuccess(true);
        await new Promise((r) => setTimeout(r, 900));
        navigate(data.role === "admin" ? "/admin/admindashboard" : "/user/dashboard");
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Invalid email or password." });
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
        <FloatingBlob
          delay={0}
          style={{ width: 500, height: 500, top: -100, left: -100,
            background: `radial-gradient(circle, ${C.brand}28 0%, transparent 70%)` }}
        />
        <FloatingBlob
          delay={2.5}
          style={{ width: 400, height: 400, bottom: 0, right: 0,
            background: "radial-gradient(circle, #6366F128 0%, transparent 70%)" }}
        />
        <FloatingBlob
          delay={5}
          style={{ width: 300, height: 300, top: "50%", left: "35%",
            background: `radial-gradient(circle, ${C.accent}18 0%, transparent 70%)` }}
        />
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

      {/* ── LEFT PANEL ─────────────────────────── */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 xl:p-16 border-r"
        style={{
          borderColor: "var(--border)",
          transform: `translate(${mousePos.x * 0.35}px, ${mousePos.y * 0.35}px)`,
        }}
      >
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 group z-10 relative">
          <motion.div
            whileHover={{ scale: 1.06, rotate: 6 }}
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
              boxShadow: `0 0 24px ${C.brand}44`,
            }}
          >
            <Code className="w-5 h-5 text-white" />
          </motion.div>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
          >
            SkillHub
          </span>
        </Link>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8 max-w-md">
          <motion.div
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1
              className="text-5xl xl:text-[52px] font-bold leading-[1.1] tracking-tight mb-4"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Welcome back{" "}
              <br />
              to{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SkillHub
              </span>
            </h1>
            <p className="text-[17px] leading-relaxed" style={{ color: "var(--text)"Muted }}>
              Continue your journey to mastery. Your next project awaits — pick
              up right where you left off.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {QUICK_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border flex flex-col gap-1"
                style={{ background: "var(--surface)"2, borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <stat.icon size={14} style={{ color: C.brand }} />
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
                >
                  {stat.value}
                </div>
                <div className="text-[13px]" style={{ color: "var(--text)"Muted }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="space-y-3"
          >
            {FEATURES.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -18, opacity: 0 }}
                animate={{ x: 0,   opacity: 1 }}
                transition={{ delay: 0.72 + idx * 0.1 }}
                className="flex items-center gap-3 text-[15px]"
                style={{ color: "var(--text)"Muted }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${C.brand}18`, border: `1px solid ${"var(--border)"}` }}
                >
                  <f.icon size={14} style={{ color: C.brand }} />
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
          transition={{ delay: 0.95 }}
          className="relative z-10 p-5 rounded-2xl border"
          style={{ background: "var(--surface)"2, borderColor: "var(--border)" }}
        >
          <span className="text-3xl font-bold leading-none" style={{ color: `${C.brand}44` }}>"</span>
          <p className="text-[14px] leading-relaxed -mt-1 mb-4" style={{ color: "var(--text)"Muted }}>
            SkillHub's project-based approach helped me land my dream job at a
            Fortune 500 company. The mentorship was invaluable.
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, #6366F1, #818CF8)` }}
            >
              SM
            </div>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Sarah Miller</p>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Senior Developer at Microsoft</p>
            </div>
            <div className="ml-auto flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[12px]" style={{ color: C.accent }}>★</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── RIGHT PANEL — Form ─────────────────── */}
      <div className="w-full lg:w-[52%] flex items-center justify-center p-6 sm:p-10 lg:p-14 relative">
        <motion.div
          ref={formRef}
          variants={shakeVariants}
          animate={controls}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
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
            <motion.div variants={itemVariants} className="mb-6 text-center">
              {/* Avatar icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `linear-gradient(135deg, ${C.brand}22, ${C.brandLight}22)`,
                  border: `1px solid ${"var(--border)"}`,
                }}
              >
                <Code className="w-6 h-6" style={{ color: C.brand }} />
              </div>
              <h2
                className="text-[28px] font-bold mb-1"
                style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
              >
                Welcome back
              </h2>
              <p className="text-[14px]" style={{ color: "var(--text)"Muted }}>
                Sign in to continue your learning journey
              </p>
            </motion.div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <SocialButton icon={Github} label="GitHub" />
              <SocialButton icon={Chrome} label="Google" />
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
                autoComplete="current-password"
              />

              {/* Remember me + forgot password */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between text-[13px]"
              >
                <label
                  className="flex items-center gap-2 cursor-pointer group select-none"
                  style={{ color: "var(--text)"Muted }}
                >
                  <div
                    className="relative w-4 h-4 rounded flex items-center justify-center border transition-all"
                    style={{
                      background: form.rememberMe ? C.brand : "transparent",
                      borderColor: form.rememberMe ? C.brand : "var(--text-muted)",
                    }}
                  >
                    {form.rememberMe && <CheckCircle2 size={10} className="text-white" />}
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="font-semibold transition-colors"
                  style={{ color: C.brand }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.brandLight)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.brand)}
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Submit error */}
              <AnimatePresence>
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
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
                whileHover={{
                  scale: 1.02,
                  boxShadow: success
                    ? `0 0 32px ${C.success}55`
                    : `0 0 32px ${C.brand}55`,
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-bold text-[16px] text-white flex items-center justify-center gap-2 group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: success
                    ? C.success
                    : `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  boxShadow: `0 0 24px ${C.brand}44`,
                }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Signed In!
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign up link */}
            <motion.p
              variants={itemVariants}
              className="mt-5 text-center text-[13px]"
              style={{ color: "var(--text)"Muted }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold inline-flex items-center gap-1 group transition-colors"
                style={{ color: C.brand }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.brandLight)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.brand)}
              >
                Create account
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.p>

            {/* Legal */}
            <motion.p
              variants={itemVariants}
              className="mt-5 text-center text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              Protected by reCAPTCHA and subject to our{" "}
              <a
                href="#"
                className="transition-colors"
                style={{ color: "var(--text)"Muted }}
                onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text)"Muted)}
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="transition-colors"
                style={{ color: "var(--text)"Muted }}
                onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text)"Muted)}
              >
                Terms of Service
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

export default Login;
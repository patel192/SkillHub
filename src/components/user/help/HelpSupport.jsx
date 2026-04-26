import { useSelector } from "react-redux";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Book,
  CreditCard,
  User,
  ShieldCheck,
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  ExternalLink,
  Sun,
  Moon,
  LifeBuoy,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react";


// ─────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────
const C = {
  brand: "#16A880",
  brandLight: "#1FC99A",
  accent: "#F59E0B",
  error: "#F87171",
};

const CATEGORIES = [
  {
    icon: Book,
    title: "Getting Started",
    desc: "Learn the basics of SkillHub and how to set up your profile.",
    id: "getting-started",
  },
  {
    icon: ShieldCheck,
    title: "Account & Security",
    desc: "Manage your password, 2FA, and privacy settings.",
    id: "account",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    desc: "Understand subscription plans, invoices, and refunds.",
    id: "billing",
  },
  {
    icon: User,
    title: "Courses & Certificates",
    desc: "How to enroll, complete courses, and claim your certificates.",
    id: "courses",
  },
];

const FAQS = [
  {
    q: "How do I claim my course certificate?",
    a: "Once you complete 100% of the lessons in a course and pass the final assessment, your certificate will be automatically generated. You can find it under the 'Certificates' tab in your dashboard.",
  },
  {
    q: "Can I change my subscription plan later?",
    a: "Yes! You can upgrade or downgrade your plan at any time from your Settings > Billing section. Upgrades take effect immediately, while downgrades start at the next billing cycle.",
  },
  {
    q: "Is there a student discount available?",
    a: "Absolutely. Students with a valid .edu email address are eligible for a 50% discount on all Pro plans. Contact our support team with proof of enrollment to apply.",
  },
  {
    q: "How long do I have access to a purchased course?",
    a: "Once you enroll in a course, you get lifetime access to all its content, including future updates made by the instructors.",
  },
];

// ─────────────────────────────────────────
// INTERNAL COMPONENTS
// ─────────────────────────────────────────

const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div
    className="border rounded-2xl overflow-hidden transition-all duration-300"
    style={{
      background: "var(--surface)",
      borderColor: isOpen ? C.brand : "var(--border)",
    }}
  >
    <button
      onClick={onClick}
      className="w-full px-6 py-5 flex items-center justify-between text-left"
    >
      <span className="font-semibold text-[15px]" style={{ color: "var(--text)" }}>
        {question}
      </span>
      <div
        className="p-1.5 rounded-full"
        style={{ background: isOpen ? `${C.brand}15` : "var(--surface2)" }}
      >
        {isOpen ? (
          <Minus size={16} style={{ color: C.brand }} />
        ) : (
          <Plus size={16} style={{ color: "var(--text-muted)" }} />
        )}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div
            className="px-6 pb-6 text-[14px] leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              {answer}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────

export const HelpSupport = () => {
  const { settings, updateSettings } = useSelector((state) => state.settings);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleTheme = () => {
    const newTheme = settings?.theme === "dark" ? "light" : "dark";
    updateSettings({ ...settings, theme: newTheme });
  };

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      {/* ── Header / Hero ─────────────────── */}
      <section className="relative text-center pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
          style={{ background: `${C.brand}12`, color: C.brand, border: `1px solid ${C.brand}22` }}
        >
          <LifeBuoy size={14} />
          Support Center
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
        >
          How can we{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            help you
          </span>{" "}
          today?
        </motion.h1>

        {/* Theme Toggle — special feature as requested */}
        <div className="absolute top-0 right-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            {settings?.theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm font-medium">
              {settings?.theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto relative group mt-8"
        >
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors"
            size={20}
            style={{ color: searchQuery ? C.brand : "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search for articles, guides, and tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-2xl shadow-xl outline-none text-[15px] transition-all"
            style={{
              background: "var(--surface)",
              border: `1px solid ${"var(--border)"}`,
              color: "var(--text)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
            }}
          />
        </motion.div>
      </section>

      {/* ── Categories ──────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl border transition-all cursor-pointer group"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
              style={{
                background: `${C.brand}12`,
                color: C.brand,
                border: `1px solid ${C.brand}22`,
              }}
            >
              <cat.icon size={22} />
            </div>
            <h3 className="font-bold text-[17px] mb-2" style={{ color: "var(--text)" }}>
              {cat.title}
            </h3>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
              {cat.desc}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: C.brand }}>
              Explore <ExternalLink size={12} />
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── FAQs ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
            style={{ color: C.brand }}
          >
            <HelpCircle size={16} />
            FAQ Section
          </motion.div>
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
          >
            Common questions answered
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Can't find what you're looking for? Try searching above or browse our full
            knowledge base.
          </p>
          <button
            className="px-6 py-3 rounded-xl font-bold text-[14px] transition-all"
            style={{
              background: "var(--surface2)",
              color: "var(--text)",
              border: `1px solid ${"var(--border)"}`,
            }}
          >
            View All Documentation
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                question={faq.q}
                answer={faq.a}
                isOpen={activeFaq === idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              />
            ))
          ) : (
            <div className="p-12 text-center border rounded-2xl border-dashed" style={{ borderColor: "var(--border)" }}>
              <p style={{ color: "var(--text-muted)" }}>No matching questions found.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Contact Section ────────────────── */}
      <section
        className="rounded-3xl p-8 md:p-12 border overflow-hidden relative"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full pointer-events-none"
          style={{ background: `${C.brand}15` }}
        />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Fraunces', serif", color: "var(--text)" }}
            >
              Still need support?
            </h2>
            <p className="text-[15px] mb-8" style={{ color: "var(--text-muted)" }}>
              Our dedicated support team is available 24/7 to help you with any technical or
              billing issues.
            </p>

            <div className="space-y-4">
              {[
                { icon: MessageCircle, label: "Live Chat", value: "Avg. response time: 2 mins", color: C.brand },
                { icon: Mail, label: "Email Support", value: "support@skillhub.com", color: C.accent },
                { icon: Phone, label: "Phone Support", value: "+1 (555) 000-0000", color: "#6366F1" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${item.color}15`, color: item.color }}
                  >
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold" style={{ color: "var(--text)" }}>
                      {item.label}
                    </h4>
                    <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-8 rounded-2xl border shadow-2xl"
            style={{ background: "var(--surface2)", borderColor: "var(--border)" }}
          >
            <h3 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>
              Quick Contact
            </h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What can we help with?"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}`, color: "var(--text)" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Message
                </label>
                <textarea
                  placeholder="Describe your issue..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{ background: "var(--surface)", border: `1px solid ${"var(--border)"}`, color: "var(--text)" }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${C.brand}, ${C.brandLight})`,
                  boxShadow: `0 10px 20px ${C.brand}33`,
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpSupport;

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
const medalIcons = {
  bronze: "https://cdn-icons-png.flaticon.com/512/2583/2583343.png",
  silver: "https://cdn-icons-png.flaticon.com/512/2583/2583340.png",
  gold: "https://cdn-icons-png.flaticon.com/512/2583/2583329.png",
  platinum: "https://cdn-icons-png.flaticon.com/512/2583/2583334.png",
};
export const AchievementPopup = ({ achievement, onClose }) => {
    useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // auto-close after 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  const { name, icon, pointsRequired } = achievement;

  // Pick medal type based on points
  let medal = "bronze";
  if (pointsRequired >= 100) medal = "silver";
  if (pointsRequired >= 250) medal = "gold";
  if (pointsRequired >= 400) medal = "platinum";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 border border-cyan-500">
          {/* Medal Icon */}
          <motion.img
            key={medal}
            src={medalIcons[medal]}
            alt={`${medal} medal`}
            className="w-14 h-14"
            initial={{ rotate: -45, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          />

          {/* Text */}
          <div>
            <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
              <Award size={18} className="text-yellow-400 animate-bounce" />
              Achievement Unlocked!
            </h3>
            <p className="text-sm text-gray-300">{name}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Report } from "./Report";
export const ReportModal = ({ isOpen, onClose, targetType, targetId }) => {
  return (
     <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative w-full max-w-lg p-6 rounded-2xl bg-[#1E293B] shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>

            {/* Report Form */}
            <ReportForm targetType={targetType} targetId={targetId} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

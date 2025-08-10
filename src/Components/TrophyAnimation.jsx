import React from "react";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";

const TrophyAnimation = ({ show }) => {
  if (!show) return null;

  return (
    <motion.div
      className="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ scale: 0, rotate: 0 }}
      animate={{ scale: 1.5, rotate: 360 }}
      transition={{ duration: 1 }}
    >
      <FaTrophy className="text-yellow-400 text-7xl drop-shadow-lg" />
    </motion.div>
  );
};

export default TrophyAnimation;

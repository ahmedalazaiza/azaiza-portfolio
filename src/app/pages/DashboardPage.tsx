import React from "react";
import { motion } from "motion/react";
import Adashboard from "../Adashboard";

export default function DashboardPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <Adashboard />
    </motion.main>
  );
}

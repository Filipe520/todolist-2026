import { motion } from "motion/react";
import { useApp } from "../AppProvider";

export default function ProgressBar() {
  const { totItens, totCompleted, PercentageProgressBar } = useApp();
  return (
    <div>
      <div>
        {totItens} X {totCompleted} X {Math.round(PercentageProgressBar)}%
      </div>
      <div className="bg-gray-800 h-1 rounded-full w-full">
        <motion.div
          animate={{ width: `${PercentageProgressBar}%` }}
          className="bg-blue-400 w-full h-full rounded-full"
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        />
      </div>
    </div>
  );
}

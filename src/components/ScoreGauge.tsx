import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

function getScoreColor(score: number) {
  if (score >= 75) return { stroke: "hsl(var(--success))", bg: "hsl(var(--success) / 0.1)" };
  if (score >= 50) return { stroke: "hsl(var(--warning))", bg: "hsl(var(--warning) / 0.1)" };
  return { stroke: "hsl(var(--destructive))", bg: "hsl(var(--destructive) / 0.1)" };
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

export function ScoreGauge({ score, label = "ATS Score", size = 200 }: ScoreGaugeProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-display font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-sm text-muted-foreground font-medium">{getScoreLabel(score)}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );
}

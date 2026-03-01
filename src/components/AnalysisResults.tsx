import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, Lightbulb, Tag, FileWarning, BarChart3 } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import { ScoreGauge } from "./ScoreGauge";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

function SeverityBadge({ severity }: { severity: string }) {
  const config = {
    high: { className: "bg-destructive/10 text-destructive", icon: XCircle },
    medium: { className: "bg-warning/10 text-warning", icon: AlertTriangle },
    low: { className: "bg-muted text-muted-foreground", icon: CheckCircle },
  }[severity] || { className: "bg-muted text-muted-foreground", icon: CheckCircle };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3" />
      {severity}
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="space-y-8">
      {/* Score Overview */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0}
        className="rounded-2xl bg-card p-8 shadow-card border border-border"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreGauge score={result.atsScore} />
          <div className="flex-1 grid grid-cols-2 gap-4">
            <StatCard
              label="Keyword Match"
              value={`${result.keywordMatchPercent}%`}
              icon={<Tag className="h-5 w-5" />}
              color={result.keywordMatchPercent >= 70 ? "success" : result.keywordMatchPercent >= 40 ? "warning" : "destructive"}
            />
            <StatCard
              label="Sections Found"
              value={`${result.sectionsFound.length}/${result.sectionsFound.length + result.sectionsMissing.length}`}
              icon={<BarChart3 className="h-5 w-5" />}
              color={result.sectionsMissing.length === 0 ? "success" : "warning"}
            />
            <StatCard
              label="Issues Found"
              value={`${result.formattingIssues.length}`}
              icon={<FileWarning className="h-5 w-5" />}
              color={result.formattingIssues.length === 0 ? "success" : result.formattingIssues.length <= 2 ? "warning" : "destructive"}
            />
            <StatCard
              label="Missing Keywords"
              value={`${result.missingKeywords.length}`}
              icon={<AlertTriangle className="h-5 w-5" />}
              color={result.missingKeywords.length === 0 ? "success" : result.missingKeywords.length <= 3 ? "warning" : "destructive"}
            />
          </div>
        </div>
      </motion.div>

      {/* Keywords */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={1} className="rounded-2xl bg-card p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Matched Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matchedKeywords.map((kw) => (
              <span key={kw} className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                {kw}
              </span>
            ))}
            {result.matchedKeywords.length === 0 && (
              <p className="text-sm text-muted-foreground">कोई matching keyword नहीं मिला</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={2} className="rounded-2xl bg-card p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Missing Keywords — ये add करें! 🔴
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.map((kw) => (
              <span key={kw} className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive border border-destructive/20">
                🔴 {kw}
              </span>
            ))}
            {result.missingKeywords.length === 0 && (
              <p className="text-sm text-success">सभी keywords match हो गए! ✅</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Formatting Issues */}
      {result.formattingIssues.length > 0 && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3} className="rounded-2xl bg-card p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-warning" />
            Formatting Issues — यहाँ गलतियाँ हैं 🔴
          </h3>
          <div className="space-y-3">
            {result.formattingIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 border-l-4 border-destructive">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge severity={issue.severity} />
                    <span className="text-xs text-muted-foreground">{issue.location}</span>
                  </div>
                  <p className="text-sm text-foreground">🔴 {issue.issue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Resume Highlights with Red Markers */}
      {result.resumeHighlights && result.resumeHighlights.length > 0 && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={3.5} className="rounded-2xl bg-card p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Resume में यहाँ सुधार करें — Red Pen Marks 🖊️
          </h3>
          <div className="space-y-3">
            {result.resumeHighlights.map((highlight, i) => (
              <div key={i} className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">
                      <span className="line-through decoration-destructive decoration-2">"{highlight.text}"</span>
                    </p>
                    <p className="text-sm text-destructive font-medium">🔴 {highlight.issue}</p>
                    <SeverityBadge severity={highlight.severity} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Section Feedback */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={4} className="rounded-2xl bg-card p-6 shadow-card border border-border">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Section-wise Analysis
        </h3>
        <div className="space-y-4">
          {result.sectionFeedback.map((sf) => (
            <div key={sf.section} className="rounded-lg bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{sf.section}</span>
                <span className={`text-sm font-bold ${sf.score >= 70 ? "text-success" : sf.score >= 40 ? "text-warning" : "text-destructive"}`}>
                  {sf.score}/100
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                <motion.div
                  className={`h-full rounded-full ${sf.score >= 70 ? "bg-success" : sf.score >= 40 ? "bg-warning" : "bg-destructive"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${sf.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-2">{sf.feedback}</p>
              {sf.suggestions.length > 0 && (
                <ul className="space-y-1">
                  {sf.suggestions.map((s, j) => (
                    <li key={j} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">→</span> {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={5} className="rounded-2xl bg-card p-6 shadow-card border border-border">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          AI Suggestions — Resume ऐसे improve करें
        </h3>
        <div className="space-y-3">
          {result.overallSuggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 border border-primary/10">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {i + 1}
              </div>
              <p className="text-sm text-foreground">{s}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sections Status */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={6} className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-3">✅ Sections मिलें</h3>
          <div className="flex flex-wrap gap-2">
            {result.sectionsFound.map((s) => (
              <span key={s} className="rounded-lg bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
                ✅ {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-3">❌ Sections नहीं मिलीं — ये add करें</h3>
          <div className="flex flex-wrap gap-2">
            {result.sectionsMissing.map((s) => (
              <span key={s} className="rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive">
                🔴 {s}
              </span>
            ))}
            {result.sectionsMissing.length === 0 && (
              <p className="text-sm text-success">सभी sections मौजूद हैं! ✅</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  const colorClass = {
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
  }[color] || "text-muted-foreground bg-muted";

  return (
    <div className="rounded-xl bg-muted/30 p-4 flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

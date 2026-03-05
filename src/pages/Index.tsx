import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Loader2, Sparkles, LogOut } from "lucide-react";
import { ResumeUploader } from "@/components/ResumeUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { extractResumeText } from "@/lib/resume-parser";
import type { AnalysisResult } from "@/types/analysis";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!file) {
      toast({ title: "Resume upload करें", description: "कृपया पहले अपना resume upload करें।", variant: "destructive" });
      return;
    }
    if (!jobDescription.trim()) {
      toast({ title: "Job Description डालें", description: "कृपया job description paste करें।", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const resumeText = await extractResumeText(file);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-resume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ resumeText, jobDescription }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        if (response.status === 429) {
          toast({ title: "Rate limit", description: "बहुत सारे requests। कृपया कुछ देर बाद try करें।", variant: "destructive" });
          return;
        }
        if (response.status === 402) {
          toast({ title: "Credits खत्म", description: "AI credits add करें।", variant: "destructive" });
          return;
        }
        throw new Error(err.error || "Analysis failed");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({
        title: "Error",
        description: err.message || "Resume analyze करने में error आई। फिर try करें।",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="bg-gradient-hero text-primary-foreground">
        <div className="container max-w-5xl py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground/90 mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Resume Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              AI Resume Analyzer
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              अपना resume upload करें, job description paste करें — AI बताएगा कि आपका resume कितना ATS-friendly है और कहाँ सुधार करना है 🔴
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Upload Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              📄 Resume Upload करें
            </label>
            <ResumeUploader
              file={file}
              onFileSelect={setFile}
              onClear={() => { setFile(null); setResult(null); }}
              isLoading={isAnalyzing}
            />
          </div>

          {/* Job Description */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              📋 Job Description Paste करें
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="यहाँ job description paste करें...&#10;&#10;Example: We are looking for a React developer with 3+ years of experience in TypeScript, Node.js..."
              className="w-full h-[168px] rounded-xl border-2 border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all"
              disabled={isAnalyzing}
            />
          </div>
        </motion.div>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file || !jobDescription.trim()}
            className="group relative inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-display font-semibold text-primary-foreground shadow-elevated transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-pulse-glow"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileSearch className="h-5 w-5" />
                🔍 Resume Analyze करें
              </>
            )}
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AnalysisResults result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>AI Resume Analyzer — ATS Friendly Checker ✨</p>
        <p className="mt-2">© 2026 Mohd Kaif</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Built with AI assistance</p>
      </footer>
    </div>
  );
};

export default Index;

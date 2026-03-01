export interface AnalysisResult {
  atsScore: number;
  scoreBreakdown: {
    keywordMatch: number;
    formatting: number;
    sectionCompleteness: number;
    readability: number;
  };
  keywordMatchPercent: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionsFound: string[];
  sectionsMissing: string[];
  personalInfoCheck: {
    found: string[];
    missing: string[];
  };
  skillCategories: {
    category: string;
    skills: string[];
  }[];
  formattingIssues: {
    issue: string;
    severity: "high" | "medium" | "low";
    location: string;
  }[];
  sectionFeedback: {
    section: string;
    score: number;
    feedback: string;
    suggestions: string[];
  }[];
  overallSuggestions: string[];
  resumeHighlights: {
    text: string;
    issue: string;
    severity: "high" | "medium" | "low";
  }[];
  atsRewrite: {
    revisedSummary: string;
    revisedSkills: string;
    improvedBullets: string[];
  };
}

export interface AnalysisResult {
  atsScore: number;
  keywordMatchPercent: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionsFound: string[];
  sectionsMissing: string[];
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
}

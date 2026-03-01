📄 AI Resume Analyzer – ATS Friendly Resume Checker

An AI-powered web application that analyzes resumes for ATS (Applicant Tracking System) compatibility based on a selected job role or job description.
The tool provides realistic ATS scoring, highlights missing keywords, detects formatting issues, and suggests actionable improvements — just like real-world ATS platforms.

🚀 Key Features

📤 Upload Resume (PDF / DOCX)

🧠 AI-based Resume Parsing

🎯 Job Role / Job Description Matching

📊 ATS Score (0–100) with detailed breakdown

🔍 Keyword Match & Missing Keywords Detection

🧱 Section Analysis (Summary, Skills, Experience, Education, Projects)

🚨 Formatting & Date Issues Detection

✍️ AI-powered Resume Improvement Suggestions

🧑‍💼 Role Mismatch Detection (Prevents fake high scores)

🧠 How ATS Scoring Works

The ATS score is calculated using a realistic scoring engine, not random or inflated values.

Component	Weight
Keyword Match	40%
Resume Formatting	20%
Section Completeness	20%
Readability & Clarity	20%

⚠️ Important:
A low score does not mean the candidate is weak.
It usually means the resume is not aligned with the selected job role.

🔍 Example Analysis Output
{
  "atsScore": 32,
  "keywordMatch": "5%",
  "sectionsFound": 5,
  "issuesFound": 13,
  "missingKeywords": ["Python", "SQL", "Machine Learning"],
  "formattingIssues": ["Future dates detected", "Non-standard layout"],
  "recommendations": [
    "Add a Projects section",
    "Align resume with selected job role",
    "Replace tool names with skill-based keywords"
  ]
}
⚠️ Role Mismatch Detection (Key Feature)

If a resume background does not match the selected role (e.g. CA/Audit resume analyzed for Data Science Engineer), the system:

Clearly flags Role Mismatch

Avoids misleading high ATS scores

Explains why the score is low

Suggests better role alignment or resume rewrite

This makes the analyzer honest, transparent, and industry-aligned.

🛠️ Tech Stack
Frontend

React.js

Tailwind CSS

Chart-based score visualization

Backend

Node.js

Express.js

Resume Parsing (PDF & DOCX)

AI/LLM-based text analysis

AI Logic

Skill-based keyword normalization

ATS-safe scoring rules

Role-aware evaluation prompts

📁 Project Structure
ai-resume-analyzer/
│
├── client/              # React frontend
│   ├── components/
│   ├── pages/
│   └── styles/
│
├── server/              # Node.js backend
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── prompts/             # ATS & AI analysis prompts
├── README.md
└── .env.example
🧪 Supported Use Cases

Students checking ATS readiness

Job seekers targeting specific roles

Career coaches & resume reviewers

Recruiters doing quick resume screening

SaaS-based resume analysis platforms

❗ Disclaimer

This tool does not replicate any specific company’s ATS.
It provides realistic guidance based on industry best practices.

ATS systems vary by company and role, but alignment + keywords + formatting remain universal.

📌 Future Enhancements

Resume Rewrite with AI

Job Description Auto-Import

Resume Version History

Authentication & User Dashboard

Download ATS-Optimized Resume

Premium Scoring Reports

📄 License

MIT License
Free to use, modify, and distribute.

👨‍💻 Author

Mohd Kaif
📍 India
🔗 LinkedIn: https://www.linkedin.com/in/thekaifqureshi

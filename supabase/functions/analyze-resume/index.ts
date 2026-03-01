import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: "Resume text and job description are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer used by top companies.

Analyze the following resume against the job description provided.

**RESUME:**
${resumeText}

**JOB DESCRIPTION:**
${jobDescription}

Perform a thorough analysis and return a structured JSON response. Calculate scores based on:
- Keyword match (40% weight): How many keywords from the JD appear in the resume
- Resume formatting (20% weight): Single-column layout, no tables, clear headings, standard fonts
- Section presence (20% weight): Summary/Objective, Skills, Experience, Education, Projects, Certifications
- Readability & clarity (20% weight): Clear job titles, quantified achievements, proper grammar

Detect problems like:
- Tables or columns in layout
- Missing standard headings
- Graphics/icons references
- Unclear or vague job titles
- Over-styled or fancy formatting
- Missing important keywords from JD

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "atsScore": <number 0-100>,
  "keywordMatchPercent": <number 0-100>,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "sectionsFound": ["Summary", "Skills", "Experience", "Education"],
  "sectionsMissing": ["Projects", "Certifications"],
  "formattingIssues": [
    {"issue": "description of issue", "severity": "high|medium|low", "location": "where in resume"}
  ],
  "sectionFeedback": [
    {"section": "Skills", "score": 80, "feedback": "detailed feedback", "suggestions": ["suggestion1"]},
    {"section": "Experience", "score": 70, "feedback": "detailed feedback", "suggestions": ["suggestion1"]}
  ],
  "overallSuggestions": ["suggestion1", "suggestion2"],
  "resumeHighlights": [
    {"text": "exact text from resume with issue", "issue": "what's wrong", "severity": "high|medium|low"}
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an ATS resume analyzer. Return ONLY valid JSON. No markdown formatting, no code blocks, no explanations." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Clean markdown code blocks if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse analysis. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

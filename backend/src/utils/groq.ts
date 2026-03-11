import axios from "axios"

export default async function analyzeResume(text: string) {

  try {

    const trimmedText = text.slice(0, 8000)

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content: `You are a senior technical recruiter and ATS specialist with 15+ years of experience evaluating resumes across software engineering, data science, design, marketing, finance, and operations roles.

Your job is to evaluate resumes with the same critical eye a real recruiter would — do not inflate scores. A resume with no measurable achievements, vague bullet points, or missing sections should score in the 40–60 range. Only genuinely strong resumes should score above 80.

Always return valid JSON and nothing else.`
          },
          {
            role: "user",
            content: `Analyze the following resume thoroughly.

STEP 1 — Infer the candidate's target role from their experience, skills, and job titles (e.g. "Frontend Engineer", "Data Analyst", "Product Manager").

STEP 2 — Score the resume from 0–100 in each category, relative to what a strong candidate for that role would look like. Be honest and critical.

Scoring guide:
- 80–100: Excellent. Clear, specific, quantified, highly relevant.
- 60–79: Decent but missing key elements or lacks specificity.
- 40–59: Weak. Vague, generic, or missing important sections.
- 0–39: Poor. Major issues with structure, relevance, or content.

Categories:
- atsScore: Is the resume ATS-friendly? (clean formatting, standard section names, no tables/columns/graphics, readable fonts)
- skillsScore: Are the listed skills relevant and strong for the inferred role?
- experienceScore: Does the experience show real impact? Are there quantified achievements, not just task lists?
- structureScore: Is the resume well-organized, easy to scan, with clear sections?
- keywordScore: Does it contain role-specific keywords a recruiter or ATS would look for?

Return this exact JSON structure:

{
  "inferredRole": "string — the role you identified (e.g. 'Full Stack Developer')",

  "atsScore": number,
  "skillsScore": number,
  "experienceScore": number,
  "structureScore": number,
  "keywordScore": number,

  "summary": "2–3 sentences. Be specific — mention the candidate's actual background, what they do well, and the single biggest thing holding them back.",

  "strengths": [
    "Specific strength with context from the resume",
    "Specific strength with context from the resume",
    "Specific strength with context from the resume"
  ],

  "weaknesses": [
    "Specific weakness with context from the resume",
    "Specific weakness with context from the resume",
    "Specific weakness with context from the resume"
  ],

  "improvements": [
    "Concrete, actionable improvement — be specific, not generic",
    "Concrete, actionable improvement — be specific, not generic",
    "Concrete, actionable improvement — be specific, not generic",
    "Concrete, actionable improvement — be specific, not generic",
    "Concrete, actionable improvement — be specific, not generic"
  ],

  "keywordsDetected": [
    "actual keyword found in the resume",
    "actual keyword found in the resume"
  ],

  "missingKeywords": [
    "important keyword missing for this role",
    "important keyword missing for this role",
    "important keyword missing for this role"
  ]
}

Rules:
- strengths, weaknesses, and improvements must reference specifics from THIS resume — no generic advice
- keywordsDetected must only include keywords actually present in the resume text
- missingKeywords should list high-value keywords a ${trimmedText.slice(0, 100)} candidate should have but doesn't
- Do not return placeholder text or generic statements

Resume:
${trimmedText}

Return ONLY the JSON object. No explanation, no markdown, no extra text.`
          }
        ],

        temperature: 0.2,
        max_tokens: 1200
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    let aiResponse = response.data.choices?.[0]?.message?.content || ""

    aiResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    let parsed

    try {

      parsed = JSON.parse(aiResponse)

      
      const requiredFields = ["atsScore", "skillsScore", "experienceScore", "structureScore", "keywordScore"]
      for (const field of requiredFields) {
        if (typeof parsed[field] !== "number") {
          throw new Error(`Missing or invalid field: ${field}`)
        }
      }

      
      parsed.overallScore = Math.round(
        (parsed.atsScore * 0.25) +
        (parsed.skillsScore * 0.20) +
        (parsed.experienceScore * 0.25) +
        (parsed.structureScore * 0.15) +
        (parsed.keywordScore * 0.15)
      )

      
      parsed.strengths = parsed.strengths || []
      parsed.weaknesses = parsed.weaknesses || []
      parsed.improvements = parsed.improvements || []
      parsed.keywordsDetected = parsed.keywordsDetected || []
      parsed.missingKeywords = parsed.missingKeywords || []

    } catch (parseError) {


      console.error("Failed to parse Groq response:", parseError)
      console.error("Raw response was:", aiResponse)

      throw new Error("The AI returned an unexpected response. Please try again.")

    }

    return parsed

  } catch (error: any) {

    console.error("GROQ ERROR:", error.response?.data || error.message)

    throw error

  }

}
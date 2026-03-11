import axios from "axios"

export default async function matchJobDescription(resumeText: string, jobDescription: string) {

  try {

    const trimmedResume = resumeText.slice(0, 6000)
    const trimmedJob = jobDescription.slice(0, 2000)

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content: `You are a senior technical recruiter with 15+ years of experience matching candidates to job descriptions. 
            
You compare resumes against job postings with precision — identifying exactly what matches, what is missing, and how strong the candidate is for this specific role.

Be critical and honest. A candidate missing core requirements should score 40–60. Only strong matches should score above 80.

Always return valid JSON and nothing else.`
          },
          {
            role: "user",
            content: `Compare the resume against the job description below.

Return this exact JSON structure:

{
  "matchScore": number (0–100, how well the resume matches this specific job),

  "verdict": "string — one sentence, e.g. 'Strong match with gaps in cloud infrastructure' or 'Weak match — missing most required skills'",

  "summary": "2–3 sentences explaining the overall match quality, what the candidate brings to this role, and what's holding them back",

  "matchedSkills": [
    "skill or experience from the resume that directly matches the job requirements",
    "skill or experience from the resume that directly matches the job requirements"
  ],

  "missingSkills": [
    "specific skill or requirement from the job that is absent from the resume",
    "specific skill or requirement from the job that is absent from the resume"
  ],

  "tailoredImprovements": [
    "specific, actionable change to make this resume stronger for THIS job",
    "specific, actionable change to make this resume stronger for THIS job",
    "specific, actionable change to make this resume stronger for THIS job",
    "specific, actionable change to make this resume stronger for THIS job"
  ],

  "keywordsToAdd": [
    "high-value keyword from the job description missing in the resume",
    "high-value keyword from the job description missing in the resume",
    "high-value keyword from the job description missing in the resume"
  ],

  "standoutQualities": [
    "something in the resume that makes this candidate stand out for this role",
    "something in the resume that makes this candidate stand out for this role"
  ]
}

Rules:
- matchedSkills and missingSkills must reference specifics from BOTH the resume and job description
- tailoredImprovements must be specific to THIS job — no generic advice
- keywordsToAdd must come directly from the job description text
- standoutQualities should highlight genuine strengths relevant to this role

Resume:
${trimmedResume}

Job Description:
${trimmedJob}

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

      
      if (typeof parsed.matchScore !== "number") {
        throw new Error("Missing matchScore")
      }

     
      parsed.matchedSkills = parsed.matchedSkills || []
      parsed.missingSkills = parsed.missingSkills || []
      parsed.tailoredImprovements = parsed.tailoredImprovements || []
      parsed.keywordsToAdd = parsed.keywordsToAdd || []
      parsed.standoutQualities = parsed.standoutQualities || []

    } catch (parseError) {
      console.error("Failed to parse Groq match response:", parseError)
      console.error("Raw response was:", aiResponse)
      throw new Error("The AI returned an unexpected response. Please try again.")
    }

    return parsed

  } catch (error: any) {
    console.error("GROQ MATCH ERROR:", error.response?.data || error.message)
    throw error
  }

}
import axios from "axios"

export default async function rewriteBullet(bullet: string, role: string) {

  try {

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content: `You are an expert resume writer with 15+ years of experience writing compelling, ATS-optimized resume bullet points for top tech companies.

You transform weak, vague bullet points into powerful, quantified achievement statements that get interviews.

Your rewrites always:
- Start with a strong action verb (Engineered, Architected, Delivered, Reduced, Increased, etc.)
- Include specific metrics or impact where possible (percentages, numbers, scale)
- Show business value, not just tasks
- Are concise — one sentence, under 25 words
- Are specific to the candidate's role

Always return valid JSON and nothing else.`
          },
          {
            role: "user",
            content: `Rewrite this resume bullet point for a ${role || "software engineer"}.

Original bullet: "${bullet}"

Return this exact JSON:

{
  "rewritten": "the improved bullet point",
  "explanation": "1 sentence explaining what was improved and why it's stronger",
  "improvements": [
    "specific thing that was improved",
    "specific thing that was improved",
    "specific thing that was improved"
  ]
}

Rules:
- rewritten must start with a past-tense action verb
- include realistic metrics if the original has none — make them plausible for the role
- do not invent technologies that weren't implied
- keep it under 25 words
- explanation should be specific, not generic

Return ONLY the JSON. No markdown, no extra text.`
          }
        ],

        temperature: 0.4,
        max_tokens: 400
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

      if (!parsed.rewritten) throw new Error("Missing rewritten field")

      parsed.improvements = parsed.improvements || []

    } catch (parseError) {
      console.error("Failed to parse rewriter response:", parseError)
      throw new Error("The AI returned an unexpected response. Please try again.")
    }

    return parsed

  } catch (error: any) {
    console.error("GROQ REWRITER ERROR:", error.response?.data || error.message)
    throw error
  }

}
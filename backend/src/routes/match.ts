import express from "express"
import multer from "multer"
import fs from "fs"
const pdf = require("pdf-parse")
import matchJobDescription from "../utils/groqMatch"

const router = express.Router()

const upload = multer({
  dest: "uploads/"
})

router.post("/", upload.single("resume"), async (req, res) => {
  try {

    console.log("Match request received")

    if (!req.file) {
      console.log("No file uploaded")
      return res.status(400).json({ error: "No file uploaded" })
    }

    const jobDescription = req.body.jobDescription

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: "Please provide a job description (at least 50 characters)" })
    }

    console.log("File saved:", req.file.path)

    const filePath = req.file.path
    const dataBuffer = fs.readFileSync(filePath)

    console.log("File read success")

    const pdfData = await pdf(dataBuffer)

    console.log("PDF parsed")

    const resumeText = pdfData.text

    console.log("Sending to Groq for matching")

    const result = await matchJobDescription(resumeText, jobDescription)

    console.log("Groq match response received")

    res.json(result)

    fs.unlinkSync(filePath)

  } catch (err: any) {
    console.error("MATCH ERROR:", err)
    res.status(500).json({ error: err.message || "Job match analysis failed" })
  }
})

export default router
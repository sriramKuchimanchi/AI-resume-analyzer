import express from "express"
import multer from "multer"
import fs from "fs"
import { v2 as cloudinary } from "cloudinary"
const pdf = require("pdf-parse")
import analyzeResume from "../utils/groq"
import pool from "../db"

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({ dest: "uploads/" })

router.post("/", upload.single("resume"), async (req, res) => {
  try {

    console.log("Upload request received")

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const filePath = req.file.path
    const originalName = req.file.originalname

    
    const dataBuffer = fs.readFileSync(filePath)
    const pdfData = await pdf(dataBuffer)
    const text = pdfData.text

    console.log("PDF parsed, sending to Groq")

   
    const result = await analyzeResume(text)

    console.log("Groq response received, uploading to Cloudinary")

    
    const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "resumeai",
      public_id: `resume_${Date.now()}`,
      use_filename: true,
      unique_filename: true,
    })

    result.resumeUrl = cloudinaryResult.secure_url
    result.resumeName = originalName

    console.log("Uploaded to Cloudinary:", cloudinaryResult.secure_url)

  
    try {
      await pool.query(
        `INSERT INTO analyses (overall_score, ats_score, skills_score, experience_score, structure_score, keyword_score, inferred_role, keywords_detected, missing_keywords)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          result.overallScore,
          result.atsScore,
          result.skillsScore,
          result.experienceScore,
          result.structureScore,
          result.keywordScore,
          result.inferredRole,
          result.keywordsDetected,
          result.missingKeywords,
        ]
      )
    } catch (dbErr) {
      console.error("DB save error (non-fatal):", dbErr)
    }

    res.json(result)

   
    fs.unlinkSync(filePath)

  } catch (err: any) {
    console.error("ERROR:", err)
    res.status(500).json({ error: err.message || "Resume analysis failed" })
  }
})

export default router
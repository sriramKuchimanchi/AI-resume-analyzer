import express from "express"
import pool from "../db"
import { requireAdmin } from "../middleware/authMiddleware"

const router = express.Router()

{/*  get method  */}

router.get("/", requireAdmin, async (req, res) => {
  try {
    const totalRes = await pool.query("SELECT COUNT(*) FROM analyses")
    const total = Number(totalRes.rows[0].count)

    if (total === 0) {
      return res.json({
        total: 0,
        averages: {},
        distribution: { poor: 0, fair: 0, good: 0, strong: 0 },
        topKeywords: [],
        topMissingKeywords: [],
        topRoles: [],
        recent: [],
      })
    }

    const avgRes = await pool.query(`
      SELECT
        ROUND(AVG(overall_score)) AS avg_overall,
        ROUND(AVG(ats_score)) AS avg_ats,
        ROUND(AVG(skills_score)) AS avg_skills,
        ROUND(AVG(experience_score)) AS avg_experience,
        ROUND(AVG(structure_score)) AS avg_structure,
        ROUND(AVG(keyword_score)) AS avg_keyword
      FROM analyses
    `)

    const distRes = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE overall_score < 40) AS poor,
        COUNT(*) FILTER (WHERE overall_score >= 40 AND overall_score < 60) AS fair,
        COUNT(*) FILTER (WHERE overall_score >= 60 AND overall_score < 80) AS good,
        COUNT(*) FILTER (WHERE overall_score >= 80) AS strong
      FROM analyses
    `)

    const keywordsRes = await pool.query(`
      SELECT keyword, COUNT(*) AS count
      FROM (SELECT UNNEST(keywords_detected) AS keyword FROM analyses) kw
      GROUP BY keyword
      ORDER BY count DESC
      LIMIT 10
    `)

    const missingRes = await pool.query(`
      SELECT keyword, COUNT(*) AS count
      FROM (SELECT UNNEST(missing_keywords) AS keyword FROM analyses) kw
      GROUP BY keyword
      ORDER BY count DESC
      LIMIT 10
    `)

    const rolesRes = await pool.query(`
      SELECT inferred_role, COUNT(*) AS count
      FROM analyses
      WHERE inferred_role IS NOT NULL
      GROUP BY inferred_role
      ORDER BY count DESC
      LIMIT 5
    `)

    const recentRes = await pool.query(`
      SELECT inferred_role, overall_score, created_at
      FROM analyses
      ORDER BY created_at DESC
      LIMIT 10
    `)

    res.json({
      total,
      averages: avgRes.rows[0],
      distribution: distRes.rows[0],
      topKeywords: keywordsRes.rows,
      topMissingKeywords: missingRes.rows,
      topRoles: rolesRes.rows,
      recent: recentRes.rows,
    })
  } catch (err: any) {
    console.error("Analytics error:", err)
    res.status(500).json({ error: "Failed to load analytics" })
  }
})

export default router
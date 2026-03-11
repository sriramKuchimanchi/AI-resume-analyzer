import express from "express"
import rewriteBullet from "../utils/groqRewriter"

const router = express.Router()

router.post("/", async (req, res) => {
  try {

    const { bullet, role } = req.body

    if (!bullet || bullet.trim().length < 5) {
      return res.status(400).json({ error: "Please provide a bullet point to rewrite." })
    }

    if (bullet.trim().length > 300) {
      return res.status(400).json({ error: "Bullet point is too long. Keep it under 300 characters." })
    }

    console.log("Rewrite request received for role:", role)

    const result = await rewriteBullet(bullet.trim(), role?.trim() || "")

    res.json(result)

  } catch (err: any) {
    console.error("REWRITE ERROR:", err)
    res.status(500).json({ error: err.message || "Rewrite failed. Please try again." })
  }
})

export default router
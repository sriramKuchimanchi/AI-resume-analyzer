import express from "express"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/login", (req, res) => {
  const { username, password } = req.body

  const validUsername = process.env.ADMIN_USERNAME
  const validPassword = process.env.ADMIN_PASSWORD
  const secret = process.env.JWT_SECRET

  if (!secret) {
    return res.status(500).json({ error: "JWT_SECRET not configured" })
  }

  if (username === validUsername && password === validPassword) {
    const token = jwt.sign({ role: "admin" }, secret, { expiresIn: "8h" })
    return res.json({ token })
  }

  return res.status(401).json({ error: "Invalid credentials" })
})

export default router
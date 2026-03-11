import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]
  const secret = process.env.JWT_SECRET

  if (!secret) {
    return res.status(500).json({ error: "JWT_SECRET not configured" })
  }

  try {
    jwt.verify(token, secret)
    next()
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
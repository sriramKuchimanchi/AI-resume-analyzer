import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import analyzeRoute from "./routes/analyze"
import matchRoute from "./routes/match"
import analyticsRoute from "./routes/analytics"
import rewriteRoute from "./routes/rewrite"
import adminRoute from "./routes/admin"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

app.use("/analyze", analyzeRoute)
app.use("/match", matchRoute)
app.use("/analytics", analyticsRoute)
app.use("/rewrite", rewriteRoute)
app.use("/admin", adminRoute)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
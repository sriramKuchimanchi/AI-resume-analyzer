📄 ResumeAI – AI-Powered Resume Analyzer

ResumeAI is a full-stack AI application that analyzes resumes, matches them with job descriptions, rewrites bullet points, and provides recruiter-level feedback using AI.

🚀 Features
📊 Resume analysis with detailed scoring (ATS, skills, experience, etc.)
🧠 AI-powered feedback (strengths, weaknesses, improvements)
🔍 Job matching against real job descriptions
✍️ Resume bullet point rewriter
📈 Admin analytics dashboard
☁️ Resume storage via Cloudinary
🔐 Admin authentication with JWT
🧠 How the System Works (Beginner Explanation)
📄 Resume Analysis Flow
User uploads a resume (PDF)
Backend:
Extracts text using pdf-parse
Sends text to AI (Groq)
AI returns structured JSON:
Scores
Strengths & weaknesses
Missing keywords
Backend:
Saves analytics to DB
Uploads file to Cloudinary
Frontend displays:
Score breakdown
Resume preview
Improvements

👉 Core logic:

🔍 Job Matcher Flow
Upload resume + paste job description
Backend:
Extracts resume text
Sends both to AI
AI compares:
Matching skills
Missing skills
Match score
✍️ Resume Rewriter Flow
User inputs weak bullet point
AI rewrites it with:
Strong action verbs
Metrics
Impact
📊 Admin Dashboard
Total analyses
Average scores
Keyword trends
Role distribution
Recent activity

👉 Protected using JWT admin auth

🔐 Admin Authentication
Username & password from .env
Generates JWT token
Stored in sessionStorage

Example:

sessionStorage.setItem("admin_token", token)
⚙️ Environment Variables

Create .env inside backend:

PORT=8080

GROQ_API_KEY=

DB_HOST=
DB_PORT=
DB_NAME=resumeai
DB_USER=
DB_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123

JWT_SECRET=
🛠️ How to Run the Project
1️⃣ Backend
cd backend
npm install
npm run dev

Runs on:

http://localhost:8080
2️⃣ Frontend
cd frontend
npm install
npm run dev

Runs on:

http://localhost:5173
🗄️ Database Setup (PostgreSQL)

Create database:

CREATE DATABASE resumeai;

Create table:

CREATE TABLE analyses (
  id SERIAL PRIMARY KEY,
  overall_score INT,
  ats_score INT,
  skills_score INT,
  experience_score INT,
  structure_score INT,
  keyword_score INT,
  inferred_role TEXT,
  keywords_detected TEXT[],
  missing_keywords TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
🔑 How to Get API Keys (Step-by-Step)
🧠 1. Groq API (REQUIRED)

Used for:

Resume analysis
Job matching
Resume rewriting
Steps:
Go to 👉 https://console.groq.com
Sign up / login
Click API Keys
Click Create API Key
Copy key

Add to .env:

GROQ_API_KEY=your_key_here
☁️ 2. Cloudinary (REQUIRED for file uploads)

Used for:

Storing uploaded resumes
Serving resume preview URLs
Steps:
Go to 👉 https://cloudinary.com
Sign up
Go to Dashboard

You’ll see:

Cloud Name
API Key
API Secret

Add to .env:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
🗄️ 3. PostgreSQL (Database)

You can use:

Option A: Local PostgreSQL
Install PostgreSQL
Create DB (resumeai)
Use credentials
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
Option B: Cloud DB (Recommended)

Use:

Neon (https://neon.tech
)
Supabase (https://supabase.com
)

They give:

Host
User
Password
DB name
🔐 4. JWT Secret

Used for:

Admin authentication
Generate:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Add:

JWT_SECRET=your_secret_here
🔐 5. Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123

Login page:

http://localhost:5173/admin/login
📦 Key Backend Concepts
✅ File Upload + Parsing
multer → save file → pdf-parse → extract text
✅ Cloudinary Upload
cloudinary.uploader.upload(filePath)

Returns:

secure_url (used in frontend)
✅ AI Processing

All AI calls go through:

https://api.groq.com/openai/v1/chat/completions
✅ Error Handling (Important)

Your code:

Cleans AI response
Parses JSON safely
Validates required fields

This is production-level robustness

🧪 Common Issues & Fixes
❌ File not uploading
Check multer config
Check file size
❌ AI not responding
Invalid GROQ_API_KEY
Check backend logs
❌ Resume parsing fails
Ensure PDF is text-based (not scanned)
❌ Cloudinary upload fails
Wrong API keys
Check .env
❌ Admin login not working
Check username/password in .env

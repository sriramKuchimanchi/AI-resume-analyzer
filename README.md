# 📄 ResumeAI — AI-Powered Resume Intelligence Platform

ResumeAI is a full-stack AI application that analyzes resumes, matches them with job descriptions, rewrites content, and provides recruiter-level insights using modern LLM-powered pipelines.

Built to simulate **real-world ATS systems and hiring workflows**.

---

## 🚀 Features

### 📊 Resume Analysis

* AI-powered scoring across:

  * ATS compatibility
  * Skills relevance
  * Experience strength
  * Resume structure
  * Keyword optimization
* Generates structured evaluation with actionable insights

---

### 🧠 AI Feedback Engine

* Detailed:

  * Strengths
  * Weaknesses
  * Improvement suggestions
* Mimics recruiter-style feedback

---

### 🔍 Job Matching System

* Compare resume against job descriptions
* Outputs:

  * Match percentage
  * Missing skills
  * Relevant overlaps
* Helps tailor resumes for specific roles

---

### ✍️ Resume Bullet Rewriter

* Converts weak bullet points into strong ones
* Adds:

  * Action verbs
  * Quantifiable impact
  * Professional tone

---

### 📈 Admin Analytics Dashboard

* Track platform usage:

  * Total analyses
  * Average scores
  * Keyword trends
  * Role distribution
* Real-time insights into resume data

---

### ☁️ Cloud Storage

* Upload resumes securely
* Stored using Cloudinary
* Instant preview via hosted URLs

---

### 🔐 Admin Authentication

* JWT-based authentication system
* Secure admin dashboard access

---

## 🧠 System Architecture (How It Works)

This app follows an **AI processing pipeline**:

### 📄 Resume Analysis Flow

1. User uploads resume (PDF)
2. Backend:

   * Extracts text using `pdf-parse`
   * Sends content to LLM (Groq)
3. AI returns structured JSON:

   * Scores
   * Keywords
   * Feedback
4. Backend:

   * Stores analytics in PostgreSQL
   * Uploads file to Cloudinary
5. Frontend displays:

   * Score breakdown
   * Resume preview
   * Improvement suggestions

---

### 🔍 Job Matching Flow

1. User uploads resume + job description
2. Backend extracts resume text
3. AI compares:

   * Matching skills
   * Missing skills
   * Overall compatibility
4. Returns match score + insights

---

### ✍️ Resume Rewriter Flow

1. User inputs weak bullet point
2. AI rewrites using:

   * Strong verbs
   * Metrics
   * Business impact

---

### 📊 Analytics Flow

* Stores every analysis in DB
* Aggregates:

  * Scores
  * Trends
  * Role insights

---

## ⚙️ Environment Variables

Create `.env` inside backend:

```env id="env1"
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
```

---

## 🔑 API Key Setup Guide

### ⚡ Groq (REQUIRED)

Used for:

* Resume analysis
* Job matching
* Bullet rewriting

Steps:

1. Go to https://console.groq.com
2. Create API key
3. Add to `.env`

```env id="groq"
GROQ_API_KEY=your_key_here
```

---

### ☁️ Cloudinary (REQUIRED)

Used for:

* Resume storage
* File hosting

Steps:

1. Go to https://cloudinary.com
2. Copy credentials from dashboard

```env id="cloud"
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

### 🗄 PostgreSQL (Database)

#### Local Setup

```sql id="sql1"
CREATE DATABASE resumeai;
```

```sql id="sql2"
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
```

#### Cloud (Recommended)

* Neon → https://neon.tech
* Supabase → https://supabase.com

---

### 🔐 JWT Secret

```bash id="jwt"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```env id="jwt2"
JWT_SECRET=your_secret_here
```

---

## 🛠 Installation & Setup

### 1. Clone Repository

```bash id="clone"
git clone https://github.com/your-username/resume-ai.git
cd resume-ai
```

---

### 2. Backend Setup

```bash id="backend"
cd backend
npm install
npm run dev
```

Runs on:

```bash id="backend-url"
http://localhost:8080
```

---

### 3. Frontend Setup

```bash id="frontend"
cd frontend
npm install
npm run dev
```

Runs on:

```bash id="frontend-url"
http://localhost:5173
```

---

## 🔌 API Overview

### Resume Analysis

* `POST /analyze` → Analyze resume

### Job Matching

* `POST /match` → Compare resume with job description

### Resume Rewriting

* `POST /rewrite` → Improve bullet points

### Admin

* `POST /admin/login`
* `GET /admin/stats`

---

## 🧩 Core Backend Concepts

### 📄 File Processing

* Uses `multer` for uploads
* Uses `pdf-parse` for text extraction

---

### ☁️ Cloud Upload

```js id="cloudinary"
cloudinary.uploader.upload(filePath)
```

Returns:

* `secure_url` → used in frontend

---

### 🧠 AI Integration

* Uses Groq API:

```
https://api.groq.com/openai/v1/chat/completions
```

---

### ⚠️ Error Handling (Production Level)

* Cleans AI responses
* Safely parses JSON
* Validates required fields

---

## ⚡ UX Highlights

* ⚡ Instant resume scoring
* 🎯 Real-time job matching
* ✍️ One-click bullet rewriting
* 📊 Visual analytics dashboard
* 📄 Resume preview via cloud storage

---

## 🚀 Future Enhancements

* 📄 Resume ATS simulation (real parser scoring)
* 🧠 Multi-role job matching
* 📊 Advanced analytics (graphs & trends)
* 📁 Resume version tracking
* 🤖 Personalized AI career coach
* 🌐 Deployment (Docker + CI/CD)

---

## 🐛 Common Issues

### ❌ File upload fails

✔ Check:

* multer config
* file size limits

---

### ❌ AI not responding

✔ Check:

* GROQ_API_KEY
* backend logs

---

### ❌ Resume parsing fails

✔ Ensure:

* PDF is text-based (not scanned)

---

### ❌ Cloudinary upload fails

✔ Check:

* API keys in `.env`

---

### ❌ Admin login not working

✔ Verify:

* ADMIN_USERNAME
* ADMIN_PASSWORD



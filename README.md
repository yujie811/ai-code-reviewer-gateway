# 🛡️ AI Code Reviewer with Security Gateway

> An AI-powered code review tool with a built-in **security gateway** that sanitizes input before sending it to the LLM.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-06b6d4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 🔍 **AI Code Review** — Submit code and get instant feedback on bugs, security issues, and performance
- 🛡️ **Security Gateway** — Sensitive data redaction + Prompt injection detection before LLM call
- 📊 **Audit Logging** — Every API call is logged with warnings from the gateway
- 🎨 **Minimal Design** — Clean, modern UI inspired by OpenAI & ByteDance
- 🌐 **Multi-language** — Supports JavaScript, TypeScript, Python, Java, and Go

---

## 🏗️ Architecture
User Input → Security Gateway → LLM API → Structured Report
│
├── Sensitive Info Redaction (API keys, tokens, passwords)
├── Prompt Injection Detection
└── Length Limiting

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A DashScope API Key ([get one here](https://dashscope.aliyun.com))

### Setup

```bash
git clone https://github.com/yujie811/ai-code-reviewer-gateway.git
cd ai-code-reviewer-gateway
npm install

Create a .env file:
DASHSCOPE_API_KEY=sk-your-api-key
Then run:

bash
npm run dev
Open http://localhost:3000.

🧩 Tech Stack
Layer	Technology
Frontend	Next.js 16, React 19, Tailwind CSS 4
Backend	Next.js API Routes
AI	Qwen-Turbo (DashScope / Alibaba Cloud)
Security	Custom Gateway Layer (input sanitization)

📁 Project Structure
src/
├── app/
│   ├── api/
│   │   └── review/
│   │       └── route.ts    # API endpoint + gateway integration
│   ├── layout.tsx
│   └── page.tsx            # Main UI
└── lib/
    └── gateway.ts          # Security gateway logic


🔒 Security Gateway Details
All code submitted for review passes through a security gateway that:

Redacts — Detects and masks API keys, tokens, passwords, and private keys

Detects — Identifies prompt injection attempts (e.g., "ignore previous instructions")

Limits — Truncates code exceeding 1500 lines to prevent abuse

📄 License
MIT
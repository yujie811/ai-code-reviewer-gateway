<p align="center">
  <h1 align="center">🛡️ AI Code Reviewer</h1>
  <p align="center">An AI-powered code review tool with a built-in <strong>security gateway</strong>.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.0-06b6d4?logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/AI-Qwen--Turbo-purple" alt="AI">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

---

## Introduction

AI Code Reviewer is a full-stack web application that reviews code for **bugs**, **security vulnerabilities**, and **performance issues** using AI. Its key innovation is the built-in **Security Gateway** — a middleware layer that sanitizes user input before it reaches the LLM, making it safe for enterprise use.

### Why Security Gateway?

When companies integrate AI into their products, a common concern is data leakage and prompt injection. This project demonstrates a practical solution: all code passes through a gateway that **redacts sensitive data**, **detects injection attempts**, and **enforces limits** before any data leaves the server.

---

## Features

- 🔍 **AI-Powered Code Review** — Supports JavaScript, TypeScript, Python, Java, and Go
- 🛡️ **Security Gateway** — Three-layer protection before LLM calls
- 📊 **Audit Logging** — Every request is logged with gateway warnings
- 🎨 **Modern UI** — Minimal, responsive design
- ⚡ **Blazing Fast** — Built on Next.js with Turbopack

---

## Architecture
Browser → Next.js Frontend → API Route (/api/review)
│
▼
Security Gateway
├── Sensitive Info Redaction
├── Prompt Injection Detection
└── Length Limiting
│
▼
Qwen-Turbo API
│
▼
Structured Report → Browser

---

## Quick Start

### Prerequisites

- Node.js 18+
- A [DashScope API Key](https://dashscope.aliyun.com) (Alibaba Cloud)

### Installation

```bash
git clone https://github.com/yujie811/ai-code-reviewer-gateway.git
cd ai-code-reviewer-gateway
npm install
```
### Configuration
Create a .env file in the project root:
```bash
DASHSCOPE_API_KEY=sk-your-api-key-here
```
### Development
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

---

## 🔒 Security Gateway Details
All code passes through a security gateway that:

Redacts — Detects and masks API keys, tokens, passwords

Detects — Identifies prompt injection attempts

Limits — Truncates code exceeding 1500 lines

---

## 📄 License
MIT
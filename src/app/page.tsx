'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const languages = ['javascript', 'typescript', 'python', 'java', 'go'];

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setResult(data.result || '审查完成，未发现问题。');
    } catch {
      setResult('请求失败，请检查后端是否启动。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0b] text-[#e5e5e5] font-sans overflow-hidden">
      {/* 背景光晕 */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px]" />

      <main className="relative max-w-3xl mx-auto px-6 py-20">
        {/* 头部 */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight text-white mb-3">
            AI Code Review
          </h1>
          <p className="text-lg text-zinc-500 font-light">
            提交代码，即时发现 Bug · 安全漏洞 · 性能问题
          </p>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          {/* 语言切换器 */}
          <div className="flex items-center bg-[#111114] border border-zinc-800 rounded-full p-[3px]">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`relative px-4 py-1.5 text-xs rounded-full font-medium transition-all duration-300 ${
                  language === lang
                    ? 'text-white'
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {language === lang && (
                  <span className="absolute inset-0 bg-white/10 rounded-full" />
                )}
                <span className="relative z-10">
                  {lang === 'javascript' ? 'JS' :
                   lang === 'typescript' ? 'TS' :
                   lang.charAt(0).toUpperCase() + lang.slice(1)}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <button
            onClick={handleReview}
            disabled={loading || !code.trim()}
            className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? '审查中…' : '提交审查'}
          </button>
        </div>

        {/* 代码输入区 */}
        <div className="bg-[#0d0d10] border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 focus-within:border-zinc-600">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800/50">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-zinc-600">code-input</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// 在此粘贴你的代码…"
            className="w-full h-80 bg-transparent p-5 font-mono text-sm text-zinc-300 placeholder:text-zinc-700 resize-none outline-none leading-relaxed"
          />
        </div>

        {/* 结果区 */}
        {result && (
          <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">
              审查报告
            </h2>
            <div className="bg-[#0d0d10] border border-zinc-800 rounded-2xl p-8 prose prose-invert prose-zinc max-w-none text-sm leading-relaxed">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* 底部 */}
        <p className="mt-20 text-center text-xs text-zinc-800 font-light">
          AI Code Reviewer · 安全网关版
        </p>
      </main>
    </div>
  );
}
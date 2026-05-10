'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const languages = ['javascript', 'typescript', 'python', 'java', 'go'];

interface HistoryItem {
  id: string;
  code: string;
  language: string;
  result: string;
  time: string;
}

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 页面加载时读取历史记录
  useEffect(() => {
    const saved = localStorage.getItem('review-history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // 保存到 localStorage
  const saveToHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 5); // 最多存5条
    setHistory(updated);
    localStorage.setItem('review-history', JSON.stringify(updated));
  };

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
      const reviewResult = data.result || '审查完成，未发现问题。';
      setResult(reviewResult);

      // 存入历史
      saveToHistory({
        id: Date.now().toString(),
        code: code.slice(0, 100), // 只存前100字符做预览
        language,
        result: reviewResult.slice(0, 200), // 只存前200字符做预览
        time: new Date().toLocaleString('zh-CN'),
      });
    } catch {
      setResult('请求失败，请检查后端是否启动。');
    } finally {
      setLoading(false);
    }
  };

  // 从历史记录加载
  const loadHistory = (item: HistoryItem) => {
    setResult(item.result);
    setShowHistory(false);
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

          {/* 历史记录按钮 */}
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              📋 历史 ({history.length})
            </button>
          )}

          <button
            onClick={handleReview}
            disabled={loading || !code.trim()}
            className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? '审查中…' : '提交审查'}
          </button>
        </div>

        {/* 历史记录面板 */}
        {showHistory && (
          <div className="mb-4 bg-[#111114] border border-zinc-800 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">最近审查记录</h3>
            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadHistory(item)}
                  className="w-full text-left p-3 bg-[#0d0d10] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-400">
                      {item.language}
                    </span>
                    <span className="text-xs text-zinc-600">{item.time}</span>
                  </div>
                  <p className="text-sm text-zinc-500 truncate">{item.code}</p>
                </button>
              ))}
            </div>
          </div>
        )}

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
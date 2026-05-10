'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const languages = [
  'javascript', 'typescript', 'python', 'java', 'go',
  'rust', 'cpp', 'c', 'csharp', 'swift', 'kotlin',
  'php', 'ruby', 'sql', 'html', 'css', 'shell', 'vue', 'react',
];

const themes = [
  { name: 'Midnight', bg: '#0a0a0b', surface: '#0d0d10', border: '#27272a', text: '#e5e5e5', sub: '#71717a', glow1: 'blue', glow2: 'purple' },
  { name: 'Slate', bg: '#0f172a', surface: '#1e293b', border: '#334155', text: '#e2e8f0', sub: '#94a3b8', glow1: 'slate', glow2: 'zinc' },
  { name: 'Espresso', bg: '#1c1917', surface: '#292524', border: '#44403c', text: '#e7e5e4', sub: '#a8a29e', glow1: 'amber', glow2: 'orange' },
  { name: 'Light', bg: '#ffffff', surface: '#f4f4f5', border: '#d4d4d8', text: '#18181b', sub: '#71717a', glow1: 'gray', glow2: 'zinc' },
];

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
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = themes[themeIdx];

  useEffect(() => {
    const saved = localStorage.getItem('review-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 5);
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
      const reviewResult = data.result || 'Review complete. No issues found.';
      setResult(reviewResult);
      saveToHistory({
        id: Date.now().toString(),
        code: code,
        language,
        result: reviewResult,
        time: new Date().toLocaleString('zh-CN'),
      });
    } catch {
      setResult('Request failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const openHistoryDetail = (item: HistoryItem) => {
    setSelectedHistory(item);
  };

  const backToEditor = () => {
    setSelectedHistory(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleExport = (text: string) => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-review-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const glowColor = (color: string) => {
    const map: Record<string, string> = {
      blue: 'bg-blue-500/10', purple: 'bg-purple-500/8',
      slate: 'bg-slate-500/10', zinc: 'bg-zinc-500/8',
      amber: 'bg-amber-500/10', orange: 'bg-orange-500/8',
      gray: 'bg-gray-200/50',
    };
    return map[color] || '';
  };

  const isLight = theme.name === 'Light';

  const formatLang = (lang: string) => {
    const map: Record<string, string> = {
      javascript: 'JavaScript', typescript: 'TypeScript', python: 'Python',
      java: 'Java', go: 'Go', rust: 'Rust', cpp: 'C++', c: 'C',
      csharp: 'C#', swift: 'Swift', kotlin: 'Kotlin', php: 'PHP',
      ruby: 'Ruby', sql: 'SQL', html: 'HTML', css: 'CSS',
      shell: 'Shell', vue: 'Vue', react: 'React',
    };
    return map[lang] || lang;
  };

  const reportStyle = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
    letterSpacing: '-0.01em',
  };

  const renderMarkdown = (content: string) => (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 style={{
            fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase' as const,
            letterSpacing: '0.05em', marginTop: '1.5em', marginBottom: '0.5em',
            color: theme.text, borderBottom: `1px solid ${theme.border}`, paddingBottom: '0.5em'
          }}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 style={{
            fontSize: '0.9rem', fontWeight: 500, marginTop: '1.2em', marginBottom: '0.3em',
            color: theme.text
          }}>{children}</h3>
        ),
        p: ({ children }) => (
          <p style={{
            marginBottom: '0.8em', lineHeight: 1.7, color: theme.sub
          }}>{children}</p>
        ),
        strong: ({ children }) => (
          <strong style={{ fontWeight: 600, color: theme.text }}>{children}</strong>
        ),
        code: ({ children }) => (
          <code style={{
            backgroundColor: theme.border, padding: '0.15em 0.4em', borderRadius: 4,
            fontSize: '0.85em', fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace'
          }}>{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div
      className="relative min-h-screen font-sans overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {!isLight && (
        <>
          <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] ${glowColor(theme.glow1)} rounded-full blur-[120px] transition-all duration-700`} />
          <div className={`absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] ${glowColor(theme.glow2)} rounded-full blur-[120px] transition-all duration-700`} />
        </>
      )}

      {/* ========== 历史详情页 ========== */}
      {selectedHistory ? (
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={backToEditor}
              className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
              style={{ color: theme.sub }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Editor
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: theme.surface, color: theme.sub }}>
                {formatLang(selectedHistory.language)}
              </span>
              <span className="text-xs" style={{ color: theme.sub }}>{selectedHistory.time}</span>
            </div>
          </div>

          <h3 className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: theme.sub }}>Source Code</h3>
          <div className="rounded-2xl overflow-hidden border mb-8" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: theme.border }}>
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <pre className="p-5 text-sm font-mono leading-relaxed whitespace-pre-wrap overflow-auto max-h-60" style={{ color: theme.text }}>
              {selectedHistory.code}
            </pre>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium uppercase tracking-widest" style={{ color: theme.sub }}>Review Report</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(selectedHistory.result)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: theme.border, color: theme.sub, backgroundColor: theme.surface }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </button>
              <button
                onClick={() => handleExport(selectedHistory.result)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ borderColor: theme.border, color: theme.sub, backgroundColor: theme.surface }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
            </div>
          </div>
          <div
            className="rounded-2xl p-8 border max-w-none text-sm leading-relaxed"
            style={{ backgroundColor: theme.surface, borderColor: theme.border, ...reportStyle }}
          >
            {renderMarkdown(selectedHistory.result)}
          </div>
        </div>
      ) : (
        /* ========== 主页 ========== */
        <main className="relative max-w-3xl mx-auto px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-light tracking-tight mb-3" style={{ color: isLight ? '#18181b' : '#fff' }}>
                AI Code Review
              </h1>
              <p className="text-lg font-light" style={{ color: theme.sub }}>
                Submit code. Find bugs · vulnerabilities · performance issues.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {history.length > 0 && (
                <button
                  onClick={() => setShowHistory(true)}
                  className="group flex items-center gap-2 text-xs hover:opacity-70 transition-opacity"
                  style={{ color: theme.sub }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="hidden sm:inline">History</span>
                </button>
              )}
              <button
                onClick={() => setThemeIdx((themeIdx + 1) % themes.length)}
                className="text-xs hover:opacity-70 transition-opacity"
                style={{ color: theme.sub }}
                title={`Theme: ${theme.name}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </button>
            </div>
          </div>

          {/* 工具栏 - OpenAI 风格 */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-transparent border rounded-lg pl-3.5 pr-8 py-2 text-sm outline-none cursor-pointer transition-all duration-200"
                style={{
                  borderColor: theme.border,
                  color: theme.text,
                  backgroundColor: theme.surface,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = isLight ? '#a1a1aa' : '#52525b')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.border)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang} style={{ backgroundColor: theme.surface, color: theme.text }}>
                    {formatLang(lang)}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: theme.sub }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <div className="flex-1" />

            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="px-5 py-2 text-sm rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isLight ? '#18181b' : '#ffffff',
                color: isLight ? '#ffffff' : '#18181b',
              }}
              onMouseEnter={(e) => { if (!loading && code.trim()) { e.currentTarget.style.opacity = '0.8'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {loading ? 'Reviewing…' : 'Submit Review'}
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden transition-all duration-300 border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: theme.border }}>
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs" style={{ color: theme.sub }}>code-input</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here…"
              className="w-full h-80 bg-transparent p-5 font-mono text-sm resize-none outline-none leading-relaxed"
              style={{ color: theme.text }}
            />
          </div>

          {result && (
            <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium uppercase tracking-widest" style={{ color: theme.sub }}>Review Report</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(result)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ borderColor: theme.border, color: theme.sub, backgroundColor: theme.surface }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </button>
                  <button
                    onClick={() => handleExport(result)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ borderColor: theme.border, color: theme.sub, backgroundColor: theme.surface }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>
              <div
                className="rounded-2xl p-8 border max-w-none text-sm leading-relaxed"
                style={{ backgroundColor: theme.surface, borderColor: theme.border, ...reportStyle }}
              >
                {renderMarkdown(result)}
              </div>
            </div>
          )}

          <p className="mt-20 text-center text-xs font-light" style={{ color: theme.sub }}>
            AI Code Reviewer · Security Gateway Edition
          </p>
        </main>
      )}

      {/* ========== 历史列表抽屉 ========== */}
      {showHistory && !selectedHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-md h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-500" style={{ backgroundColor: theme.bg, color: theme.text }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-light">Review History</h2>
                <button onClick={() => setShowHistory(false)} className="hover:opacity-70 transition-opacity" style={{ color: theme.sub }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              {history.length === 0 ? (
                <p className="text-sm" style={{ color: theme.sub }}>No history yet.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { openHistoryDetail(item); setShowHistory(false); }}
                      className="w-full text-left p-4 border rounded-xl transition-all duration-300 hover:opacity-80"
                      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.border, color: theme.sub }}>
                          {formatLang(item.language)}
                        </span>
                        <span className="text-xs" style={{ color: theme.sub }}>{item.time}</span>
                      </div>
                      <p className="text-sm truncate font-mono" style={{ color: theme.sub }}>{item.code.slice(0, 80)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
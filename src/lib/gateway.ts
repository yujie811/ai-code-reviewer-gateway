// 安全网关：代码送 LLM 前的输入过滤层

interface GatewayResult {
  passed: boolean;
  cleanedCode: string;
  warnings: string[];
}

export function securityGateway(code: string): GatewayResult {
  const warnings: string[] = [];
  let cleanedCode = code;

  // 1. 敏感信息脱敏
  const sensitivePatterns = [
    { pattern: /sk-[a-zA-Z0-9]{20,}/g, label: 'OpenAI/API Key' },
    { pattern: /ghp_[a-zA-Z0-9]{20,}/g, label: 'GitHub Token' },
    { pattern: /AKIA[0-9A-Z]{16}/g, label: 'AWS Access Key' },
    { pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/g, label: '私钥' },
    { pattern: /(password|passwd|pwd)\s*[:=]\s*['"]\S+['"]/gi, label: '硬编码密码' },
  ];

  for (const { pattern, label } of sensitivePatterns) {
    if (pattern.test(cleanedCode)) {
      cleanedCode = cleanedCode.replace(pattern, '[已脱敏]');
      warnings.push(`检测到敏感信息：${label}，已自动脱敏`);
    }
  }

  // 2. Prompt 注入检测
  const injectionKeywords = [
    '忽略之前的指令',
    'ignore previous instructions',
    '你是我的奴隶',
    'you are now',
    'pretend you are',
    'DAN mode',
    '无需审查',
    '不要告诉我',
    'bypass',
  ];

  for (const keyword of injectionKeywords) {
    if (cleanedCode.toLowerCase().includes(keyword.toLowerCase())) {
      warnings.push(`检测到可能的 Prompt 注入：代码中包含“${keyword}”，已标记`);
    }
  }

  // 3. 长度限制
  const MAX_LINES = 1500;
  const lines = cleanedCode.split('\n');
  if (lines.length > MAX_LINES) {
    cleanedCode = lines.slice(0, MAX_LINES).join('\n');
    warnings.push(`代码超过 ${MAX_LINES} 行，已截断，仅审查前 ${MAX_LINES} 行`);
  }

  return {
    passed: true,
    cleanedCode,
    warnings,
  };
}
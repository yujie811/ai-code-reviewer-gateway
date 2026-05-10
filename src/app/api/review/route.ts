import { NextRequest, NextResponse } from 'next/server';
import { securityGateway } from '@/lib/gateway';

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: '请提供代码' }, { status: 400 });
    }

    // ========== 安全网关处理 ==========
    const gatewayResult = securityGateway(code);

    console.log('[安全网关] 审查记录:', {
      time: new Date().toISOString(),
      originalLength: code.length,
      warnings: gatewayResult.warnings,
    });

    // ========== 调用通义千问 ==========
    const systemPrompt = `你是一位资深代码审查专家。请严格审查以下${language || '代码'}，重点检查：
1. **Bug**：逻辑错误、边界条件、空值处理
2. **安全漏洞**：注入风险、敏感信息泄露、权限问题
3. **性能问题**：不必要的循环、内存泄漏、低效算法
4. **代码规范**：命名、可读性、最佳实践

请用 Markdown 格式输出审查报告，使用小标题分类，每条问题给出严重程度（🔴严重 🟡建议 🟢优化）。如果代码整体质量很好，也要明确说明。`;

    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'sk-c355693476bf4ab19f9be25d3737ee91',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: gatewayResult.cleanedCode },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('LLM API 错误:', data);
      return NextResponse.json({ error: 'AI 服务暂时不可用' }, { status: 500 });
    }

    const aiResult = data.choices?.[0]?.message?.content || '审查完成，未发现问题。';

    // 在结果中附加网关警告
    const finalResult = gatewayResult.warnings.length > 0
      ? `> ⚠️ **安全网关提示**：\n> ${gatewayResult.warnings.join('\n> ')}\n\n---\n\n${aiResult}`
      : aiResult;

    return NextResponse.json({ result: finalResult });

  } catch (error) {
    console.error('审查失败:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
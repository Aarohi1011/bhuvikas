import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchRules, getRuleById } from '@/lib/searchEngine.js';

let client = null;
function getAnthropicClient() {
  if (!client && process.env.ANTHROPIC_API_KEY) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const query = (body.query || '').trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required.' },
        { status: 400 }
      );
    }

    // 1. Retrieve the top candidate rules using the Bhuvikas search engine
    const searchRes = searchRules(query, { limit: 4 });
    const topResults = searchRes.results || [];

    // 2. Fetch full rule text for each top result to provide complete statutory context
    const enrichedSources = topResults.map(r => {
      const full = getRuleById(r.number) || {};
      return {
        id: r.id,
        number: r.number,
        title: r.title,
        badge: r.badge,
        part: r.part,
        page: r.page,
        snippet: r.snippet,
        fullContent: full.content || r.snippet,
        provisos: full.provisos || [],
        attachedCaseLaws: full.attachedCaseLaws || []
      };
    });

    // Build grounded context prompt for Claude
    const contextPrompt = enrichedSources.map((s, idx) => {
      let txt = `### SOURCE ${idx + 1}: [${s.badge}] ${s.title} (${s.page ? `Gazette ${s.page}` : s.part})\n`;
      txt += `${s.fullContent}\n`;
      if (s.attachedCaseLaws && s.attachedCaseLaws.length > 0) {
        txt += `\nRelevant Court Precedents:\n` + s.attachedCaseLaws.map(c => `- ${c.caseName} (${c.citation}): ${c.summary}`).join('\n') + `\n`;
      }
      return txt;
    }).join('\n---\n');

    const systemPrompt = `You are a concise legal AI advisor for the Madhya Pradesh Bhumi Vikas Rules, 2012 (updated to March 2025).
Your instructions:
1. EXTREME BREVITY: Be concise, direct, and to the point. No conversational filler or long preambles.
2. VERDICT FIRST: Begin immediately with a clear bold verdict line: e.g. **Direct Verdict:** [Allowed / Not Permitted / Permitted subject to conditions].
3. TABLE FORMATTING: Whenever presenting numeric values, setbacks, FAR, road widths, plot categories, or dimensional rules, format them in a clean Markdown Table:
| Parameter | Statutory Requirement | Rule Citation |
|---|---|---|
4. BULLET POINTS: List essential conditions or exceptions in 2-4 concise bullet points citing exact Rule numbers (e.g., Rule 76(2), Gazette p. 91).
5. Language: Reply in crisp English (or clear Hinglish if asked in Hindi). Keep the entire answer under 180 words unless complex tabular data is required.`;

    const userPrompt = `STATUTORY CONTEXT FROM MADHYA PRADESH BHUMI VIKAS RULES, 2012:
${contextPrompt}

USER QUESTION:
"${query}"

Please provide a concise, to-the-point answer with a Direct Verdict, Markdown Table for specifications, and exact rule citations.`;

    let aiAnswer = "";

    if (process.env.ANTHROPIC_API_KEY) {
      // Call Claude AI
      const anthropic = getAnthropicClient();
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-5-5',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });
      const textBlock = message.content.find(c => c.type === 'text');
      aiAnswer = textBlock?.text || 'No response generated.';
    } else {
      // Smart Concise Statutory Synthesis Fallback when API key is not configured locally
      const primary = enrichedSources[0];
      aiAnswer = `### Statutory Summary: MP Bhumi Vikas Rules\n\n` +
        `**Direct Verdict:** Subject to **${primary ? primary.badge : 'Statutory Provisions'}** (${primary?.title || 'Planning Compliance'}).\n\n` +
        `| Statutory Rule | Subject Matter | Gazette Reference |\n` +
        `|---|---|---|\n` +
        enrichedSources.map(s => `| **${s.badge}** | ${s.title.length > 45 ? s.title.slice(0, 42) + '...' : s.title} | ${s.page ? `p. ${s.page}` : s.part} |`).join('\n') +
        `\n\n` +
        `**Key Statutory Specifications:**\n` +
        enrichedSources.map(s => {
          const cleanSnippet = (s.snippet || s.fullContent || '').replace(/[*_#`]/g, '').replace(/\s+/g, ' ').slice(0, 140).trim();
          return `- **${s.badge}:** ${cleanSnippet}...`;
        }).join('\n') +
        `\n\n> **Compliance Note:** Check local T&CP zonal plan and MP Nagar Palika sanction requirements.`;
    }

    return NextResponse.json({
      success: true,
      query,
      answer: aiAnswer,
      sources: enrichedSources.map(s => ({
        id: s.id,
        number: s.number,
        badge: s.badge,
        title: s.title,
        part: s.part,
        page: s.page,
        snippet: s.snippet
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Claude AI Search Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'AI search failed.' },
      { status: 500 }
    );
  }
}

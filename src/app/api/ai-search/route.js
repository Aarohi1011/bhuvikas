import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchRules, getRuleById } from '@/lib/searchEngine.js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

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

    const systemPrompt = `You are an expert legal advisor specializing in the Madhya Pradesh Bhumi Vikas Rules, 2012 (updated up to 6th March 2025).
Your job is to answer citizen, architect, builder, and engineer questions accurately in clear, structured language.

CRITICAL INSTRUCTIONS:
1. Grounding: Answer strictly and factual based on the provided statutory context of Madhya Pradesh Bhumi Vikas Rules.
2. Citation: Always cite the exact Rule number, Sub-rule, and Gazette page (e.g. 'Rule 76(3)(e), p. 90-91').
3. Clarity: Start with a direct bottom-line answer (e.g., "Yes, but subject to...", "No, under Rule..."), followed by key conditions/specifications in bullet points.
4. Language: If the user asks in Hindi/Hinglish, you may reply in clear Hindi/Hinglish with English rule names. Otherwise reply in professional English.
5. If the provided rules do not contain enough information to answer definitively, say so clearly.`;

    const userPrompt = `STATUTORY CONTEXT FROM MADHYA PRADESH BHUMI VIKAS RULES, 2012:
${contextPrompt}

USER QUESTION:
"${query}"

Please provide a clear, structured legal answer with exact rule numbers and page citations.`;

    // 3. Call Claude
    const message = await client.messages.create({
      model: 'claude-sonnet-5-5',
      max_tokens: 2000,
      thinking: { type: 'between_tools' },
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const textBlock = message.content.find(c => c.type === 'text');
    const aiAnswer = textBlock?.text || 'No response generated.';

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

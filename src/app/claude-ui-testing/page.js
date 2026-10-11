'use client';

import { useState, useEffect } from 'react';

export default function ClaudeUiTestingPage() {
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'instant' | 'api'

  // --- Claude AI State ---
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  // --- Instant Search State ---
  const [instantQuery, setInstantQuery] = useState('');
  const [instantType, setInstantType] = useState('all');
  const [instantResults, setInstantResults] = useState([]);
  const [instantFacets, setInstantFacets] = useState({ types: {} });
  const [instantLoading, setInstantLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Sample prompt queries for quick testing
  const samplePrompts = [
    'Can I open a commercial shop in the basement?',
    'What are the conditions for instant deemed approval for plots up to 186 sqm?',
    'Is basement parking counted in FAR or excluded?',
    'What is the minimum road width and open space for high rise buildings?',
    'Can the municipal corporation demolish illegal construction without notice?'
  ];

  // --- Execute Claude AI Search ---
  const handleAskClaude = async (queryToAsk) => {
    const q = queryToAsk || aiQuery;
    if (!q.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);
    setSelectedSource(null);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data);
      } else {
        setAiError(data.error || 'Failed to get answer from Claude.');
      }
    } catch (err) {
      setAiError(err.message || 'Network error occurred.');
    } finally {
      setAiLoading(false);
    }
  };

  // --- Execute Instant Search ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      setInstantLoading(true);
      try {
        const params = new URLSearchParams({
          q: instantQuery,
          type: instantType,
          limit: '20'
        });
        const res = await fetch(`/api/search?${params}`);
        const data = await res.json();
        if (data.success) {
          setInstantResults(data.results || []);
          setInstantFacets(data.facets || { types: {} });
        }
      } catch (err) {
        console.error('Instant search error:', err);
      } finally {
        setInstantLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [instantQuery, instantType]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans antialiased p-4 md:p-8">
      {/* Container */}
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <header className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Madhya Pradesh Bhumi Vikas Rules (2012–2025)
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  108 Rules • 86 Definitions
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Claude AI & Search Engine Explorer
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Developer Testing & Reference UI for Natural Language Search and Instant Statutory Lookup.
              </p>
            </div>

            {/* Route indicator for developers */}
            <div className="bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded-xl text-xs font-mono text-gray-300">
              <span className="text-gray-500">Route: </span>
              <span className="text-yellow-400">/claude-ui-testing</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#30363d] mt-6 gap-2">
            <button
              onClick={() => setActiveTab('ai')}
              className={`pb-3 px-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
                activeTab === 'ai'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>✨</span>
              <span>Ask Claude AI (Raw / Natural Language)</span>
            </button>
            <button
              onClick={() => setActiveTab('instant')}
              className={`pb-3 px-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
                activeTab === 'instant'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>⚡</span>
              <span>Instant Search Engine (0ms)</span>
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`pb-3 px-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
                activeTab === 'api'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>💻</span>
              <span>Developer API Guide</span>
            </button>
          </div>
        </header>

        {/* ============================================================ */}
        {/* TAB 1: CLAUDE AI NATURAL LANGUAGE SEARCH */}
        {/* ============================================================ */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* Input Card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <span>Enter Any Unformatted / Real-World Question:</span>
                </label>
                <span className="text-xs text-gray-400">Powered by Claude 3.5 + Grounded Bhumi Vikas Rules</span>
              </div>

              <div className="relative">
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask in plain English or Hindi (e.g. Can I open a commercial shop in the basement? How much setback is required for 18m height?)..."
                  rows={3}
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl p-3.5 text-sm text-gray-100 placeholder-gray-500 outline-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAskClaude();
                    }
                  }}
                />
              </div>

              {/* Sample Quick Prompt Chips */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium">Try clicking a sample question:</p>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAiQuery(p);
                        handleAskClaude(p);
                      }}
                      className="text-xs bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] px-3 py-1.5 rounded-lg transition-all text-left"
                    >
                      💡 {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-500">
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-[#21262d] rounded border border-[#30363d]">Enter</kbd> to submit
                </span>
                <div className="flex gap-2">
                  {aiQuery && (
                    <button
                      onClick={() => {
                        setAiQuery('');
                        setAiResponse(null);
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-all"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => handleAskClaude()}
                    disabled={aiLoading || !aiQuery.trim()}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-md flex items-center gap-2"
                  >
                    {aiLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span>Claude is Analyzing Rules...</span>
                      </>
                    ) : (
                      <>
                        <span>Ask Claude AI</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {aiError && (
              <div className="bg-red-900/20 border border-red-500/40 text-red-300 p-4 rounded-xl text-sm">
                <strong>Error: </strong> {aiError}
              </div>
            )}

            {/* Claude AI Answer Box */}
            {aiResponse && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="font-bold text-base text-white">Claude AI Statutory Answer</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(aiResponse.answer, 'ai-answer')}
                    className="text-xs bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copiedId === 'ai-answer' ? '✓ Copied' : 'Copy Answer'}
                  </button>
                </div>

                {/* Formatted Text */}
                <div className="prose prose-invert max-w-none text-gray-200 text-sm leading-relaxed whitespace-pre-line bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                  {aiResponse.answer}
                </div>

                {/* Sources Used by Claude */}
                {aiResponse.sources && aiResponse.sources.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">
                      Grounded Sources & Statutory Rules Cited:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiResponse.sources.map((s, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedSource(s)}
                          className="p-3 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded-xl cursor-pointer transition-all space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {s.badge}
                            </span>
                            {s.page && (
                              <span className="text-[11px] text-gray-400 font-mono">
                                Gazette {s.page}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-gray-200 line-clamp-1">{s.title}</p>
                          <p className="text-[11px] text-gray-400 line-clamp-2">{s.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Source Inspector Modal */}
            {selectedSource && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {selectedSource.badge}
                      </span>
                      <h4 className="font-bold text-base text-white">{selectedSource.title}</h4>
                    </div>
                    <button
                      onClick={() => setSelectedSource(null)}
                      className="text-gray-400 hover:text-white text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    Part: {selectedSource.part} • {selectedSource.page ? `Gazette ${selectedSource.page}` : 'Schedule'}
                  </div>
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedSource.snippet}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedSource(null)}
                      className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-xs text-gray-300 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: INSTANT SEARCH ENGINE (0ms KEYWORD / RULE LOOKUP) */}
        {/* ============================================================ */}
        {activeTab === 'instant' && (
          <div className="space-y-6">
            {/* Search Input Bar */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={instantQuery}
                  onChange={(e) => setInstantQuery(e.target.value)}
                  placeholder="Search by keyword, Rule Number (e.g. 14, 12A), or definition (e.g. FAR, basement, podium)..."
                  className="w-full bg-[#0d1117] border border-[#30363d] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition-all"
                />
                {instantLoading && (
                  <span className="absolute right-3.5 top-3.5 text-xs text-blue-400 animate-pulse">
                    Searching...
                  </span>
                )}
              </div>

              {/* Entity Type Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'rule', label: `Rules (${instantFacets.types?.rule || 0})` },
                  { id: 'definition', label: `Definitions (${instantFacets.types?.definition || 0})` },
                  { id: 'table', label: `Tables (${instantFacets.types?.table || 0})` },
                  { id: 'case_law', label: `Case Laws (${instantFacets.types?.case_law || 0})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setInstantType(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                      instantType === tab.id
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-[#21262d] text-gray-300 border-[#30363d] hover:bg-[#30363d]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                <span>Showing {instantResults.length} ranked results</span>
                <span className="font-mono text-emerald-400">Latency: &lt; 5ms</span>
              </div>

              {instantResults.length === 0 ? (
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-12 text-center text-gray-400">
                  <p className="text-base font-medium">No results found for &quot;{instantQuery}&quot;</p>
                  <p className="text-xs mt-1 text-gray-500">Try searching for &quot;FAR&quot;, &quot;Rule 14&quot;, &quot;Basement&quot;, or &quot;Parking&quot;.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {instantResults.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#161b22] hover:bg-[#1a202c] border border-[#30363d] rounded-xl p-4 transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                            item.type === 'rule' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            item.type === 'definition' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            item.type === 'table' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {item.badge}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">{item.part}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.page && (
                            <span className="text-xs font-mono text-gray-400 bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                              Gazette {item.page}
                            </span>
                          )}
                          <button
                            onClick={() => copyToClipboard(`M.P. Bhumi Vikas Rules, 2012 - ${item.badge} (${item.title})`, item.id)}
                            className="text-[11px] text-gray-400 hover:text-white bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]"
                          >
                            {copiedId === item.id ? '✓ Copied' : 'Cite'}
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>

                      <p className="text-xs text-gray-300 leading-relaxed font-sans">
                        {item.snippet}
                      </p>

                      {item.exclusions && item.exclusions.length > 0 && (
                        <div className="bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] text-[11px] text-amber-300">
                          <span className="font-bold">Exclusions: </span> {item.exclusions.join(' ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: DEVELOPER REFERENCE & API CODE SNIPPETS */}
        {/* ============================================================ */}
        {activeTab === 'api' && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-[#30363d] pb-3">
              Developer Reference: How to Use These Endpoints
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  POST /api/ai-search
                </span>
                <p className="text-xs text-gray-300">
                  Takes any raw/conversational question, finds relevant Bhumi Vikas rules, and prompts Claude to generate a structured statutory answer.
                </p>
                <pre className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] text-xs text-emerald-400 overflow-x-auto font-mono">
{`// Example React fetch:
const res = await fetch('/api/ai-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Can I open a commercial shop in the basement?' })
});
const data = await res.json();
console.log(data.answer);  // Claude's formatted legal answer
console.log(data.sources); // Array of cited rules with Gazette page numbers`}
                </pre>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#30363d]">
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  GET /api/search?q=FAR&type=all
                </span>
                <p className="text-xs text-gray-300">
                  Fast in-memory full-text search with exact rule boost, definition acronym matching, and facets (&lt; 5ms).
                </p>
                <pre className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] text-xs text-emerald-400 overflow-x-auto font-mono">
{`// Example React fetch:
const res = await fetch('/api/search?q=FAR&type=all&limit=10');
const data = await res.json();
console.log(data.results); // Ranked array of matching rules, definitions & tables
console.log(data.facets);  // Item counts by category`}
                </pre>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#30363d]">
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  GET /api/rules/[id]
                </span>
                <p className="text-xs text-gray-300">
                  Returns the complete text, subrules, provisos, and court comments for a specific rule (e.g. `/api/rules/14` or `/api/rules/76`).
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

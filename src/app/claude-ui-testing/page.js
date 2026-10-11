"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import {
  Sparkles,
  Search,
  Copy,
  Check,
  Eye,
  FileText,
  ShieldCheck,
  Scale,
  Building,
  ArrowRight,
  Sliders,
  Send,
} from "@/components/icons";

export default function ClaudeUiTestingPage() {
  const [activeTab, setActiveTab] = useState("ai"); // "ai" | "instant" | "api"

  // --- Claude AI State ---
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  // --- Instant Search State ---
  const [instantQuery, setInstantQuery] = useState("");
  const [instantType, setInstantType] = useState("all");
  const [instantResults, setInstantResults] = useState([]);
  const [instantFacets, setInstantFacets] = useState({ types: {} });
  const [instantLoading, setInstantLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Sample prompt queries for quick testing
  const samplePrompts = [
    "Can I open a commercial shop in the basement?",
    "What are the conditions for instant deemed approval for plots up to 186 sqm?",
    "Is basement parking counted in FAR or excluded?",
    "What is the minimum road width and open space for high rise buildings?",
    "Can the municipal corporation demolish illegal construction without notice?",
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
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data);
      } else {
        setAiError(data.error || "Failed to get answer from Claude.");
      }
    } catch (err) {
      setAiError(err.message || "Network error occurred.");
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
          limit: "20",
        });
        const res = await fetch(`/api/search?${params}`);
        const data = await res.json();
        if (data.success) {
          setInstantResults(data.results || []);
          setInstantFacets(data.facets || { types: {} });
        }
      } catch (err) {
        console.error("Instant search error:", err);
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
    <div style={{ backgroundColor: "var(--sand-white)", minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Top Header */}
        <div
          style={{
            backgroundColor: "var(--card-white)",
            borderRadius: "1.25rem",
            padding: "2rem",
            border: "1px solid var(--border-sand)",
            boxShadow: "0 10px 30px -10px rgba(11, 31, 42, 0.04)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span className="bv-badge-gold">AI SEARCH ENGINE LAB</span>
                <span style={{ color: "#94A3B8" }}>•</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  108 Rules • 86 Definitions • 17 Case Laws
                </span>
              </div>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--ink-navy)", letterSpacing: "-0.02em" }}>
                Claude AI & Statutory Search Engine
              </h1>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Grounded Natural Language Search & Instant Clause Lookup under MP Bhumi Vikas Niyam, 2012.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontFamily: "monospace",
                  padding: "0.35rem 0.65rem",
                  borderRadius: "0.5rem",
                  background: "var(--sand-white)",
                  border: "1px solid var(--border-sand)",
                  color: "var(--ink-navy)",
                }}
              >
                POST /api/ai-search
              </span>
              <Link href="/chat" className="bv-btn-primary" style={{ padding: "0.55rem 1rem", fontSize: "0.78rem" }}>
                <span>Open Production Chat</span>
                <ArrowRight width={14} height={14} />
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border-sand)",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "0.6rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                backgroundColor: activeTab === "ai" ? "var(--teal-primary)" : "transparent",
                color: activeTab === "ai" ? "#FFFFFF" : "var(--ink-navy)",
                border: activeTab === "ai" ? "1px solid var(--teal-primary)" : "1px solid var(--border-sand)",
                transition: "all 0.15s ease",
              }}
            >
              ✨ Ask Claude AI (Natural Language)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("instant")}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "0.6rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                backgroundColor: activeTab === "instant" ? "var(--teal-primary)" : "transparent",
                color: activeTab === "instant" ? "#FFFFFF" : "var(--ink-navy)",
                border: activeTab === "instant" ? "1px solid var(--teal-primary)" : "1px solid var(--border-sand)",
                transition: "all 0.15s ease",
              }}
            >
              ⚡ Instant Search Engine (0ms)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("api")}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "0.6rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                backgroundColor: activeTab === "api" ? "var(--teal-primary)" : "transparent",
                color: activeTab === "api" ? "#FFFFFF" : "var(--ink-navy)",
                border: activeTab === "api" ? "1px solid var(--teal-primary)" : "1px solid var(--border-sand)",
                transition: "all 0.15s ease",
              }}
            >
              💻 Developer API Guide
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: CLAUDE AI NATURAL LANGUAGE SEARCH */}
        {/* ============================================================ */}
        {activeTab === "ai" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Input Card */}
            <div className="bv-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="bv-label" style={{ marginBottom: 0 }}>
                  Enter Any Unformatted / Real-World Question
                </label>
                <span className="bv-badge-gold">Claude 3.5 Sonnet + Grounded Rules</span>
              </div>

              <div>
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask in plain English or Hindi (e.g. Can I open a commercial shop in the basement? What are the conditions for deemed approval for plots up to 186 sqm?)..."
                  rows={3}
                  className="bv-input"
                  style={{ fontSize: "0.88rem", resize: "vertical" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAskClaude();
                    }
                  }}
                />
              </div>

              {/* Sample Quick Prompt Chips */}
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
                  Try clicking a canonical question:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAiQuery(p);
                        handleAskClaude(p);
                      }}
                      style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: "0.5rem",
                        background: "var(--sand-white)",
                        border: "1px solid var(--border-sand)",
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        color: "var(--ink-navy)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--teal-primary)";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-sand)";
                        e.currentTarget.style.backgroundColor = "var(--sand-white)";
                      }}
                    >
                      💡 {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Press <strong>Enter</strong> to submit
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {aiQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setAiQuery("");
                        setAiResponse(null);
                      }}
                      className="bv-btn-secondary"
                      style={{ padding: "0.5rem 1rem", fontSize: "0.78rem" }}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleAskClaude()}
                    disabled={aiLoading || !aiQuery.trim()}
                    className="bv-btn-primary"
                    style={{ padding: "0.6rem 1.25rem", fontSize: "0.82rem", opacity: aiLoading || !aiQuery.trim() ? 0.6 : 1 }}
                  >
                    {aiLoading ? (
                      <>
                        <Sparkles width={16} height={16} />
                        <span>Claude is Analyzing Grounded Rules...</span>
                      </>
                    ) : (
                      <>
                        <span>Ask Claude AI</span>
                        <ArrowRight width={14} height={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {aiError && (
              <div
                style={{
                  backgroundColor: "#FFF1F2",
                  border: "1px solid #FECDD3",
                  color: "var(--status-error)",
                  padding: "1rem 1.25rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                <strong>Error: </strong> {aiError}
              </div>
            )}

            {/* Claude AI Answer Box (With Proper Markdown Parsing) */}
            {aiResponse && (
              <div className="bv-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-sand)", paddingBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--status-success)" }} />
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                      Claude AI Statutory Answer
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(aiResponse.answer, "ai-answer")}
                    className="bv-btn-secondary"
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                  >
                    {copiedId === "ai-answer" ? <Check width={14} height={14} /> : <Copy width={14} height={14} />}
                    <span>{copiedId === "ai-answer" ? "Copied" : "Copy Answer"}</span>
                  </button>
                </div>

                {/* Formatted Markdown Container */}
                <div
                  style={{
                    backgroundColor: "var(--sand-white)",
                    padding: "1.5rem",
                    borderRadius: "0.85rem",
                    border: "1px solid var(--border-sand)",
                  }}
                >
                  <MarkdownRenderer content={aiResponse.answer} />
                </div>

                {/* Grounded Sources Cited by Claude */}
                {aiResponse.sources && aiResponse.sources.length > 0 && (
                  <div style={{ paddingTop: "0.5rem" }}>
                    <h4 style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                      Grounded Sources & Statutory Rules Cited:
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem" }}>
                      {aiResponse.sources.map((s, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedSource(s)}
                          style={{
                            padding: "0.85rem 1rem",
                            borderRadius: "0.75rem",
                            backgroundColor: "#FFFFFF",
                            border: "1px solid var(--border-sand)",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--teal-primary)";
                            e.currentTarget.style.backgroundColor = "var(--sand-white)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--border-sand)";
                            e.currentTarget.style.backgroundColor = "#FFFFFF";
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                            <span className="bv-badge-teal">{s.badge || `Rule ${s.number}`}</span>
                            {s.page && <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "monospace" }}>Gazette {s.page}</span>}
                          </div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ink-navy)", marginBottom: "0.2rem" }}>
                            {s.title}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {s.snippet}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Source Inspector Modal */}
            {selectedSource && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  backgroundColor: "rgba(11, 31, 42, 0.6)",
                  backdropFilter: "blur(4px)",
                  zIndex: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "1.25rem",
                    border: "1px solid var(--border-sand)",
                    maxWidth: "640px",
                    width: "100%",
                    padding: "1.75rem",
                    boxShadow: "0 20px 40px -10px rgba(11, 31, 42, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    maxHeight: "85vh",
                    overflowY: "auto",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-sand)", paddingBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="bv-badge-gold">{selectedSource.badge}</span>
                      <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--ink-navy)" }}>{selectedSource.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedSource(null)}
                      style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-muted)", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    Part: {selectedSource.part} • {selectedSource.page ? `Gazette ${selectedSource.page}` : "Statutory Schedule"}
                  </div>

                  <div
                    style={{
                      backgroundColor: "var(--sand-white)",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border-sand)",
                      fontSize: "0.82rem",
                      color: "var(--ink-navy)",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedSource.snippet}
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => setSelectedSource(null)}
                      className="bv-btn-secondary"
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
        {activeTab === "instant" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="bv-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <Search width={18} height={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={instantQuery}
                  onChange={(e) => setInstantQuery(e.target.value)}
                  placeholder="Instant 0ms lookup across all 108 rules, 86 definitions, and tables (e.g. 'FAR', 'basement', 'parking', 'Rule 76')..."
                  className="bv-input"
                  style={{ paddingLeft: "2.75rem", fontSize: "0.9rem" }}
                />
              </div>

              {/* Type Facet Pills */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>Filter:</span>
                {[
                  { id: "all", label: "All Items" },
                  { id: "rule", label: "Rules" },
                  { id: "definition", label: "Definitions" },
                  { id: "table", label: "Tables" },
                  { id: "case_law", label: "Case Laws" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInstantType(type.id)}
                    style={{
                      padding: "0.25rem 0.65rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      backgroundColor: instantType === type.id ? "var(--teal-primary)" : "var(--sand-white)",
                      color: instantType === type.id ? "#FFFFFF" : "var(--ink-navy)",
                      border: "1px solid var(--border-sand)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
                {instantLoading ? "Searching index..." : `Found ${instantResults.length} matching statutory items`}
              </div>

              {instantResults.map((item, idx) => (
                <div key={idx} className="bv-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="bv-badge-gold">{item.badge || item.type}</span>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>{item.title}</h4>
                    </div>
                    {item.page && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>Gazette {item.page}</span>}
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {item.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: DEVELOPER API GUIDE */}
        {/* ============================================================ */}
        {activeTab === "api" && (
          <div className="bv-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <span className="bv-badge-teal">DEVELOPER INTEGRATION</span>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ink-navy)", marginTop: "0.3rem" }}>
                Bhuvikas Search Engine API Reference
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.82rem" }}>
              <div style={{ backgroundColor: "var(--sand-white)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border-sand)" }}>
                <strong style={{ color: "var(--teal-primary)" }}>1. Claude AI Natural Language Endpoint:</strong>
                <pre style={{ marginTop: "0.5rem", fontFamily: "monospace", fontSize: "0.78rem", color: "var(--ink-navy)" }}>
                  POST /api/ai-search{`\n`}
                  Content-Type: application/json{`\n\n`}
                  {JSON.stringify({ query: "Can I open a commercial shop in the basement?" }, null, 2)}
                </pre>
              </div>

              <div style={{ backgroundColor: "var(--sand-white)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border-sand)" }}>
                <strong style={{ color: "var(--teal-primary)" }}>2. Instant Full-Text Keyword Search Endpoint:</strong>
                <pre style={{ marginTop: "0.5rem", fontFamily: "monospace", fontSize: "0.78rem", color: "var(--ink-navy)" }}>
                  GET /api/search?q=FAR&type=all&limit=10
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

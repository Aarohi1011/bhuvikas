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
  Palette,
  Lock,
} from "@/components/icons";

export default function DashboardPage() {
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
                <span className="bv-badge-gold">BHUVIKAS AI REGULATORY DESK</span>
                <span style={{ color: "#94A3B8" }}>•</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  108 Rules • 86 Definitions • 17 Case Laws
                </span>
              </div>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--ink-navy)", letterSpacing: "-0.02em" }}>
                Claude AI Regulatory Chatbot & Dashboard
              </h1>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Evidence-Grounded AI Chatbot, Tabular Compliance Verdicts & Full Clause Verification under MP Bhumi Vikas Rules, 2012.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <Link href="/rules" className="bv-btn-primary" style={{ padding: "0.55rem 1rem", fontSize: "0.78rem" }}>
                <Sliders width={14} height={14} />
                <span>Rule Limits</span>
              </Link>
              <Link href="/creative" className="bv-btn-gold" style={{ padding: "0.55rem 1rem", fontSize: "0.78rem" }}>
                <Palette width={14} height={14} />
                <span>Creative</span>
              </Link>
              <Link href="/auth" className="bv-btn-outline" style={{ padding: "0.55rem 1rem", fontSize: "0.78rem" }}>
                <Lock width={14} height={14} />
                <span>Portal Auth</span>
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
                cursor: "pointer",
              }}
            >
              ✨ Ask Claude AI (Natural Language Chatbot)
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
                cursor: "pointer",
              }}
            >
              ⚡ Instant Statutory Search (108 Rules)
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
                cursor: "pointer",
              }}
            >
              🛠️ API Reference
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* TAB 1: CLAUDE AI NATURAL LANGUAGE CHATBOT  */}
        {/* ========================================== */}
        {activeTab === "ai" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Query Input Card */}
            <div
              style={{
                backgroundColor: "var(--card-white)",
                borderRadius: "1.25rem",
                padding: "1.75rem",
                border: "1px solid var(--border-sand)",
                boxShadow: "0 4px 20px -4px rgba(11, 31, 42, 0.03)",
              }}
            >
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--ink-navy)", marginBottom: "0.75rem" }}>
                Ask Any Complex MP Real Estate, Town Planning, or Bye-Law Query:
              </label>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAskClaude();
                    }
                  }}
                  placeholder="e.g. Can I construct a basement on a plot of 240 sqm? What are the setbacks and parking rules?"
                  rows={3}
                  style={{
                    flex: 1,
                    backgroundColor: "var(--sand-white)",
                    border: "1px solid var(--border-sand)",
                    borderRadius: "0.75rem",
                    padding: "0.85rem 1rem",
                    fontSize: "0.9rem",
                    color: "var(--ink-navy)",
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleAskClaude()}
                  disabled={aiLoading || !aiQuery.trim()}
                  style={{
                    backgroundColor: "var(--teal-primary)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "0.75rem",
                    padding: "0 1.75rem",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: aiLoading || !aiQuery.trim() ? "not-allowed" : "pointer",
                    opacity: aiLoading || !aiQuery.trim() ? 0.6 : 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.35rem",
                    minWidth: "120px",
                    boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Send width={18} height={18} />
                  <span>{aiLoading ? "Searching..." : "Ask Claude"}</span>
                </button>
              </div>

              {/* Sample Prompts */}
              <div style={{ marginTop: "1rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  Sample Legal Scenarios:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {samplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAiQuery(prompt);
                        handleAskClaude(prompt);
                      }}
                      style={{
                        backgroundColor: "rgba(15, 118, 110, 0.06)",
                        color: "var(--teal-primary)",
                        border: "1px solid rgba(15, 118, 110, 0.15)",
                        borderRadius: "9999px",
                        padding: "0.3rem 0.75rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(15, 118, 110, 0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(15, 118, 110, 0.06)")}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading Indicator */}
            {aiLoading && (
              <div
                style={{
                  backgroundColor: "var(--card-white)",
                  borderRadius: "1.25rem",
                  padding: "2.5rem",
                  border: "1px solid var(--border-sand)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div className="bv-spinner" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink-navy)" }}>
                    Claude AI is synthesizing MP Bhumi Vikas Rules...
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Retrieving statutory context from 108 rules, attached case laws, and gazette amendments.
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {aiError && (
              <div
                style={{
                  backgroundColor: "rgba(209, 73, 91, 0.08)",
                  borderRadius: "1rem",
                  padding: "1.25rem 1.5rem",
                  border: "1px solid rgba(209, 73, 91, 0.25)",
                  color: "var(--status-error)",
                  fontSize: "0.85rem",
                }}
              >
                <strong>Error:</strong> {aiError}
              </div>
            )}

            {/* Claude AI Response */}
            {aiResponse && (
              <div style={{ display: "grid", gridTemplateColumns: selectedSource ? "1.2fr 0.8fr" : "1fr", gap: "1.5rem" }}>
                
                {/* AI Answer Card */}
                <div
                  style={{
                    backgroundColor: "var(--card-white)",
                    borderRadius: "1.25rem",
                    padding: "2rem",
                    border: "1px solid var(--border-sand)",
                    boxShadow: "0 10px 30px -10px rgba(11, 31, 42, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-sand)", paddingBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--status-success)" }} />
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                          Plain-Language Statutory Verdict
                        </h3>
                        <span className="bv-badge-gold" style={{ fontSize: "0.68rem" }}>
                          Easy to Understand
                        </span>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        Simplified explanation grounded in Madhya Pradesh Bhumi Vikas Rules, 2012.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(aiResponse.answer, "ai-ans")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.3rem 0.65rem",
                        borderRadius: "0.45rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: "var(--sand-white)",
                        border: "1px solid var(--border-sand)",
                        color: "var(--ink-navy)",
                        cursor: "pointer",
                      }}
                    >
                      {copiedId === "ai-ans" ? <Check width={13} height={13} style={{ color: "var(--status-success)" }} /> : <Copy width={13} height={13} />}
                      <span>{copiedId === "ai-ans" ? "Copied" : "Copy Simple Answer"}</span>
                    </button>
                  </div>

                  {/* Rendered Markdown Response with Tables & Citations */}
                  <MarkdownRenderer content={aiResponse.answer} />

                  {/* Citations / Sources Ribbon */}
                  {aiResponse.sources && aiResponse.sources.length > 0 && (
                    <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-sand)" }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink-navy)", marginBottom: "0.75rem" }}>
                        Statutory Rules & Gazette Citations Used:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {aiResponse.sources.map((src) => (
                          <button
                            key={src.id}
                            type="button"
                            onClick={() => setSelectedSource(selectedSource?.id === src.id ? null : src)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              padding: "0.45rem 0.75rem",
                              borderRadius: "0.6rem",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              backgroundColor: selectedSource?.id === src.id ? "var(--ink-navy)" : "var(--sand-white)",
                              color: selectedSource?.id === src.id ? "#FFFFFF" : "var(--ink-navy)",
                              border: "1px solid var(--border-sand)",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <span className="bv-badge-gold" style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
                              {src.badge}
                            </span>
                            <span>{src.title}</span>
                            <Eye width={12} height={12} style={{ color: selectedSource?.id === src.id ? "var(--gold-accent)" : "var(--teal-primary)" }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Source Clause Preview Drawer */}
                {selectedSource && (
                  <div
                    style={{
                      backgroundColor: "var(--card-white)",
                      borderRadius: "1.25rem",
                      padding: "1.75rem",
                      border: "1px solid var(--border-sand)",
                      boxShadow: "0 10px 30px -10px rgba(11, 31, 42, 0.04)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      maxHeight: "680px",
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span className="bv-badge-gold">{selectedSource.badge}</span>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-navy)", marginTop: "0.35rem" }}>
                          {selectedSource.title}
                        </h3>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                          Part: {selectedSource.part} • Gazette: {selectedSource.page || "Official MP Notification"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedSource(null)}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "1.25rem",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "0.25rem",
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border-sand)", paddingTop: "0.75rem" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                        Statutory Rule Text:
                      </div>
                      <div style={{ backgroundColor: "var(--sand-white)", padding: "1rem", borderRadius: "0.75rem", fontSize: "0.82rem", lineHeight: 1.6, color: "var(--ink-navy)", border: "1px solid var(--border-sand)" }}>
                        {selectedSource.snippet}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: INSTANT STATUTORY KEYWORD SEARCH    */}
        {/* ========================================== */}
        {activeTab === "instant" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Search Controls */}
            <div
              style={{
                backgroundColor: "var(--card-white)",
                borderRadius: "1.25rem",
                padding: "1.75rem",
                border: "1px solid var(--border-sand)",
                boxShadow: "0 4px 20px -4px rgba(11, 31, 42, 0.03)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search
                    width={18}
                    height={18}
                    style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}
                  />
                  <input
                    type="text"
                    value={instantQuery}
                    onChange={(e) => setInstantQuery(e.target.value)}
                    placeholder="Search any rule number, keyword (FAR, setback, basement, deemed approval, road width)..."
                    style={{
                      width: "100%",
                      backgroundColor: "var(--sand-white)",
                      border: "1px solid var(--border-sand)",
                      borderRadius: "0.75rem",
                      padding: "0.85rem 1rem 0.85rem 2.75rem",
                      fontSize: "0.9rem",
                      color: "var(--ink-navy)",
                      outline: "none",
                    }}
                  />
                </div>

                <select
                  value={instantType}
                  onChange={(e) => setInstantType(e.target.value)}
                  style={{
                    backgroundColor: "var(--sand-white)",
                    border: "1px solid var(--border-sand)",
                    borderRadius: "0.75rem",
                    padding: "0 1rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--ink-navy)",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="all">All Content</option>
                  <option value="rule">Rules Only</option>
                  <option value="definition">Definitions Only</option>
                  <option value="table">Tables Only</option>
                  <option value="case_law">Case Precedents</option>
                </select>
              </div>

              {/* Facet Counts */}
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                <span>Found: <strong>{instantResults.length}</strong> matches</span>
                <span>•</span>
                <span>Rules: <strong>{instantFacets.types?.rule || 0}</strong></span>
                <span>•</span>
                <span>Definitions: <strong>{instantFacets.types?.definition || 0}</strong></span>
                <span>•</span>
                <span>Tables: <strong>{instantFacets.types?.table || 0}</strong></span>
                <span>•</span>
                <span>Case Laws: <strong>{instantFacets.types?.case_law || 0}</strong></span>
              </div>
            </div>

            {/* Results Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {instantLoading && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Searching regulations...
                </div>
              )}

              {!instantLoading && instantResults.length === 0 && (
                <div style={{ backgroundColor: "var(--card-white)", borderRadius: "1rem", padding: "3rem", textAlign: "center", border: "1px solid var(--border-sand)" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink-navy)" }}>No matching rules found</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Try searching for "FAR", "14", "basement", "parking", or "setback".
                  </div>
                </div>
              )}

              {!instantLoading && instantResults.map((r) => (
                <div
                  key={r.id}
                  style={{
                    backgroundColor: "var(--card-white)",
                    borderRadius: "1rem",
                    padding: "1.25rem 1.5rem",
                    border: "1px solid var(--border-sand)",
                    boxShadow: "0 2px 8px rgba(11, 31, 42, 0.02)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span className="bv-badge-gold">{r.badge}</span>
                      <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                        {r.title}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {r.page && (
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", backgroundColor: "var(--sand-white)", padding: "0.2rem 0.5rem", borderRadius: "0.35rem" }}>
                          {r.page}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(r.snippet, r.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-muted)",
                          padding: "0.25rem",
                        }}
                        title="Copy Snippet"
                      >
                        {copiedId === r.id ? <Check width={14} height={14} style={{ color: "var(--status-success)" }} /> : <Copy width={14} height={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: "0.82rem", lineHeight: 1.6, color: "var(--text-muted)" }}>
                    <MarkdownRenderer content={r.snippet} />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: API REFERENCE                       */}
        {/* ========================================== */}
        {activeTab === "api" && (
          <div
            style={{
              backgroundColor: "var(--card-white)",
              borderRadius: "1.25rem",
              padding: "2rem",
              border: "1px solid var(--border-sand)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ink-navy)", marginBottom: "1rem" }}>
              BhuVikas Statutory Search REST APIs
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Integrate the Madhya Pradesh Bhumi Vikas Rules search engine into external municipal ERPs or mobile apps.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import {
  Building,
  ShieldCheck,
  Scale,
  FileText,
  Search,
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  Sliders,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Info,
  History,
  Palette,
} from "@/components/icons";

export default function ChatPage() {
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
    deleteSession,
    sendMessage,
    isTyping,
    openClauseInspector,
    activeLanguage,
    setActiveLanguage,
  } = useChat();

  const { currentUser } = useAuth();

  const [inputMessage, setInputMessage] = useState("");
  const [searchHistory, setSearchHistory] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage.trim());
    setInputMessage("");
  };

  const handleCopyCitation = (citation, id) => {
    const text = `Clause: ${citation.ruleNumber} (${citation.subClause || ""})\nDocument: ${citation.documentTitle}\nPage: ${citation.pageNumber}\nExcerpt: ${citation.quotedClause}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes((searchHistory || "").toLowerCase())
  );

  const quickSuggestionChips = [
    "For a 240 m² plot on a 12 m wide road, what setback rules apply?",
    "Agar plot 240 sqm ka hai aur road 12m ki hai, toh setback kitna chahiye?",
    "Can I build a basement extending into front setback under Rule 60?",
    "What is the maximum permissible FAR on an 18m road in Indore?",
  ];

  return (
    <div style={{ display: "flex", height: "calc(100vh - 6.5rem)", overflow: "hidden", backgroundColor: "var(--sand-white)" }}>
      {/* Claude-Style Left Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "20rem" : "0",
          transform: sidebarOpen ? "none" : "translateX(-100%)",
          transition: "all 0.3s ease",
          backgroundColor: "var(--ink-navy)",
          color: "#94A3B8",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          zIndex: 20,
          borderRight: "1px solid #1A3342",
          overflow: "hidden",
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: "1rem", borderBottom: "1px solid #1A3342", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => createNewSession("New Regulation Consultation")}
            className="bv-btn-primary"
            style={{ width: "100%", padding: "0.65rem 1rem", fontSize: "0.78rem" }}
          >
            <Plus width={16} height={16} />
            <span>New Chat Consultation</span>
          </button>

          {/* Search History */}
          <div style={{ position: "relative" }}>
            <Search width={14} height={14} style={{ position: "absolute", left: "0.75rem", top: "0.65rem", color: "#64748B" }} />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              style={{
                width: "100%",
                padding: "0.55rem 0.75rem 0.55rem 2.2rem",
                fontSize: "0.75rem",
                backgroundColor: "#162E3D",
                color: "#FFFFFF",
                border: "1px solid #213C4D",
                borderRadius: "0.75rem",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Sessions List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <div style={{ padding: "0.25rem 0.5rem", fontSize: "0.65rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>
            Recent Consultations ({filteredSessions.length})
          </div>

          {filteredSessions.length === 0 ? (
            <div style={{ padding: "1rem", textAlign: "center", fontSize: "0.75rem", color: "#64748B" }}>No conversations found</div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  style={{
                    padding: "0.65rem 0.75rem",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: isActive ? "#162E3D" : "transparent",
                    color: isActive ? "#FFFFFF" : "#CBD5E1",
                    border: isActive ? "1px solid #213C4D" : "1px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ flex: 1, overflow: "hidden", paddingRight: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 800, padding: "0.1rem 0.35rem", borderRadius: "0.25rem", background: "#0B1F2A", color: "var(--warm-gold)" }}>
                        {session.language || "EN"}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "#64748B" }}>
                        {new Date(session.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {session.title}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    style={{ color: "#64748B", padding: "0.25rem", cursor: "pointer" }}
                    title="Delete session"
                  >
                    <Trash2 width={14} height={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: "0.75rem", borderTop: "1px solid #1A3342", backgroundColor: "#081720", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem" }}>
            <span>Language:</span>
            <div style={{ display: "flex", gap: "0.2rem" }}>
              <button
                onClick={() => setActiveLanguage("en")}
                style={{ padding: "0.2rem 0.45rem", borderRadius: "0.35rem", fontSize: "0.68rem", fontWeight: 700, backgroundColor: activeLanguage === "en" ? "var(--teal-primary)" : "#162E3D", color: "#FFFFFF" }}
              >
                EN
              </button>
              <button
                onClick={() => setActiveLanguage("hi")}
                style={{ padding: "0.2rem 0.45rem", borderRadius: "0.35rem", fontSize: "0.68rem", fontWeight: 700, backgroundColor: activeLanguage === "hi" ? "var(--teal-primary)" : "#162E3D", color: "#FFFFFF" }}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderTop: "1px solid #162E3D", paddingTop: "0.4rem" }}>
            <div style={{ width: "1.6rem", height: "1.6rem", borderRadius: "50%", background: "var(--teal-primary)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>
              {currentUser?.avatar || "A"}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser?.name || "Partner"}</div>
              <div style={{ fontSize: "0.65rem", color: "#64748B" }}>{currentUser?.role || "Broker"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", backgroundColor: "var(--sand-white)", overflow: "hidden", position: "relative" }}>
        {/* Chat Header Bar */}
        <header style={{ height: "3.75rem", padding: "0 1.5rem", backgroundColor: "#FFFFFF", borderBottom: "1px solid var(--border-sand)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ padding: "0.4rem", borderRadius: "0.5rem", border: "1px solid var(--border-sand)", background: "var(--sand-white)", color: "var(--ink-navy)", cursor: "pointer" }}
              title="Toggle sidebar"
            >
              <FileText width={16} height={16} />
            </button>
            <div style={{ overflow: "hidden" }}>
              <h2 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--ink-navy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {activeSession ? activeSession.title : "New Consultation"}
              </h2>
            </div>
            <span className="bv-badge-gold">MP Bhumi Vikas 2012</span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link href="/creative" className="bv-btn-secondary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.75rem" }}>
              <Palette width={14} height={14} style={{ color: "var(--teal-primary)" }} />
              <span>Create Listing</span>
            </Link>
          </div>
        </header>

        {/* Messages Stream */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {(!activeSession || activeSession.messages.length === 0) && (
            <div style={{ maxWidth: "600px", margin: "3rem auto", textAlign: "center", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Logo size="lg" showSubtitle={false} />
              </div>

              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                  Claude-Powered Regulation & Property Intelligence
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.4rem", lineHeight: 1.6 }}>
                  Ask any question regarding setback restrictions, permissible Floor Area Ratio (FAR), height limits,
                  or parking standards. BhuVikas AI analyzes governing clauses with zero hallucinations.
                </p>
              </div>

              {/* Starter Query Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", textAlign: "left" }}>
                {quickSuggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(chip)}
                    className="bv-card"
                    style={{ padding: "1rem", cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--teal-primary)", marginBottom: "0.35rem" }}>
                      {idx === 1 ? "हिन्दी परामर्श" : "Grounded Rule"}
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--ink-navy)", fontWeight: 600, lineHeight: 1.4 }}>
                      {chip}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSession &&
            activeSession.messages.map((msg) => {
              if (msg.sender === "user") {
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ maxWidth: "34rem", backgroundColor: "var(--teal-primary)", color: "#FFFFFF", padding: "1rem 1.25rem", borderRadius: "1.25rem 1.25rem 0.25rem 1.25rem", boxShadow: "0 2px 8px rgba(15, 118, 110, 0.2)" }}>
                      <div style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>{msg.text}</div>
                      <div style={{ fontSize: "0.65rem", color: "#99F6E4", textAlign: "right", marginTop: "0.35rem" }}>{msg.timestamp}</div>
                    </div>
                  </div>
                );
              }

              // Assistant Response Card
              const data = msg.data;
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div className="bv-card" style={{ maxWidth: "46rem", width: "100%", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", borderRadius: "1.25rem 1.25rem 1.25rem 0.25rem" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--status-success)" }}></span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "var(--ink-navy)" }}>
                          {msg.isAiGrounded ? "Claude AI Grounded Statutory Answer" : data?.verdict || "Rule Limits Established"}
                        </span>
                      </div>
                      <span className="bv-badge-gold">
                        {msg.isAiGrounded ? "Claude 3.5 Verified" : data?.language === "hi" ? "हिन्दी" : "English"}
                      </span>
                    </div>

                    {/* Claude AI Rich Markdown Answer or Fallback Summary */}
                    {msg.text ? (
                      <div style={{ padding: "0.25rem 0" }}>
                        <MarkdownRenderer content={msg.text} />
                      </div>
                    ) : (
                      <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--ink-navy)", lineHeight: 1.6 }}>
                        {data?.summary}
                      </p>
                    )}

                    {/* Grounded Sources Cited by Claude AI */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div style={{ padding: "0.75rem 0", borderTop: "1px solid var(--border-sand)" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                          Grounded Gazette Sources & Rules Cited:
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem" }}>
                          {msg.sources.map((s, sIdx) => (
                            <div
                              key={sIdx}
                              onClick={() => openClauseInspector({
                                ruleNumber: s.badge || s.number,
                                documentTitle: s.title,
                                quotedClause: s.snippet,
                                authority: s.page ? `Gazette ${s.page}` : s.part,
                              })}
                              style={{
                                padding: "0.6rem 0.75rem",
                                borderRadius: "0.6rem",
                                background: "var(--sand-white)",
                                border: "1px solid var(--border-sand)",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--teal-primary)")}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-sand)")}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                                <span className="bv-badge-teal">{s.badge || `Rule ${s.number}`}</span>
                                {s.page && <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{s.page}</span>}
                              </div>
                              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-navy)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                {s.title}
                              </div>
                              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1.3, marginTop: "0.15rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {s.snippet}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Limits Table */}
                    {data?.limits && (
                      <div style={{ borderRadius: "0.85rem", border: "1px solid var(--border-sand)", overflow: "hidden", background: "var(--sand-white)" }}>
                        <div style={{ padding: "0.6rem 1rem", background: "#ECE8E0", fontSize: "0.72rem", fontWeight: 800, color: "var(--ink-navy)", textTransform: "uppercase" }}>
                          Mandatory Building Limits & Thresholds
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          {data.limits.map((lim, lIdx) => (
                            <div key={lIdx} style={{ display: "flex", justifyContent: "space-between", padding: "0.65rem 1rem", borderTop: "1px solid var(--border-sand)", fontSize: "0.78rem" }}>
                              <div>
                                <strong style={{ color: "var(--ink-navy)" }}>{lim.label}</strong>
                                {lim.note && <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{lim.note}</div>}
                              </div>
                              <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--teal-primary)" }}>{lim.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stopping Rule Box */}
                    {data?.stoppingRuleWarning && (
                      <div style={{ padding: "0.85rem", borderRadius: "0.75rem", background: "#FEF3C7", border: "1px solid #FDE68A", color: "#92400E", fontSize: "0.78rem", display: "flex", gap: "0.5rem" }}>
                        <AlertTriangle width={18} height={18} style={{ color: "var(--status-warning)", marginTop: "0.1rem" }} />
                        <div>
                          <strong>Which Rule is Stopping / Restricting You:</strong>
                          <p style={{ marginTop: "0.2rem", lineHeight: 1.4 }}>{data.stoppingRuleWarning}</p>
                        </div>
                      </div>
                    )}

                    {/* Citations */}
                    {data?.citations && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--text-light)", textTransform: "uppercase" }}>
                          Official Gazette Citations
                        </div>
                        {data.citations.map((cite, cIdx) => (
                          <div key={cIdx} style={{ padding: "0.85rem", borderRadius: "0.75rem", border: "1px solid var(--border-sand)", background: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <span className="bv-badge-teal">{cite.ruleNumber} ({cite.subClause})</span>
                                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink-navy)" }}>{cite.documentTitle}</span>
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                                Printed Page {cite.pageNumber} • {cite.authority}
                              </div>
                            </div>
                            <button
                              onClick={() => openClauseInspector(cite)}
                              className="bv-btn-secondary"
                              style={{ padding: "0.35rem 0.65rem", fontSize: "0.72rem" }}
                            >
                              <Eye width={14} height={14} />
                              <span>Inspect</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {isTyping && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div className="bv-card" style={{ padding: "0.85rem 1.25rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Claude & Cerebras analyzing MP Bhumi Vikas Niyam clauses...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div style={{ padding: "1rem 1.5rem", backgroundColor: "#FFFFFF", borderTop: "1px solid var(--border-sand)", flexShrink: 0 }}>
          <form onSubmit={handleSend} style={{ maxWidth: "56rem", margin: "0 auto", position: "relative" }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about MP Bhumi Vikas Niyam (e.g., 'Setback for 240 m² plot on 12m road')..."
              className="bv-input"
              style={{ padding: "0.85rem 6rem 0.85rem 1.25rem", fontSize: "0.85rem" }}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="bv-btn-primary"
              style={{ position: "absolute", right: "0.5rem", top: "0.35rem", padding: "0.5rem 1rem", fontSize: "0.78rem" }}
            >
              <span>Send</span>
              <Send width={14} height={14} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

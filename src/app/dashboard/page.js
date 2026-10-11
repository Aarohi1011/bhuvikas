"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import Logo from "@/components/Logo";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { evaluateMPBuildingRule, MP_BHUMI_VIKAS_RULES } from "@/lib/mpBhumiVikasData";
import {
  MessageSquare,
  Scale,
  Plus,
  Trash2,
  Send,
  Sliders,
  Eye,
  Copy,
  Check,
  Sparkles,
  Building,
  ShieldCheck,
  FileText,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Lock,
  User,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Info,
} from "@/components/icons";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, switchDemoAccount } = useAuth();
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
    deleteSession,
    sendMessage,
    isTyping,
    activeLanguage,
    setActiveLanguage,
    inspectedClause,
    openClauseInspector,
    closeClauseInspector,
  } = useChat();

  const [inputQuery, setInputQuery] = useState("");
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [historySearch, setHistorySearch] = useState("");
  const [guestMode, setGuestMode] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isTyping]);

  // Handle message copy
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Quick prompt chips
  const samplePrompts = [
    {
      title: "Basement Commercial Use",
      query: "Can I open a commercial shop in the basement under MP Bhumi Vikas Rules?",
      icon: Building,
    },
    {
      title: "Instant Deemed Approval",
      query: "What are the conditions for instant deemed approval for residential plots up to 186 sqm?",
      icon: Sparkles,
    },
    {
      title: "FAR & Setbacks (12m Road)",
      query: "What is the permissible FAR and front setback for a 240 m² plot on a 12m road in MP?",
      icon: Scale,
    },
    {
      title: "Basement Parking Rules",
      query: "Is basement parking included or excluded in FAR calculations under Rule 84?",
      icon: ShieldCheck,
    },
  ];

  // Submit chat message
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isTyping) return;

    const queryToSend = inputQuery.trim();
    setInputQuery("");
    sendMessage(queryToSend);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (promptQuery) => {
    if (isTyping) return;
    sendMessage(promptQuery);
  };

  // Filter history
  const filteredSessions = sessions.filter((s) =>
    (s.title || "").toLowerCase().includes(historySearch.toLowerCase())
  );

  // =========================================================================
  // VIEW 1: INTRODUCTORY DASHBOARD FOR NON-LOGGED IN USERS
  // =========================================================================
  if (!isAuthenticated && !guestMode) {
    return (
      <div style={{ backgroundColor: "var(--sand-white)", minHeight: "calc(100vh - 72px)", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          
          {/* Hero Welcome Card */}
          <div
            style={{
              backgroundColor: "var(--ink-navy)",
              color: "#FFFFFF",
              borderRadius: "1.5rem",
              padding: "3.5rem 3rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 40px -15px rgba(11, 31, 42, 0.2)",
            }}
          >
            <div style={{ maxWidth: "680px", position: "relative", zIndex: 10 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(200, 161, 90, 0.15)",
                  border: "1px solid rgba(200, 161, 90, 0.3)",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "9999px",
                  marginBottom: "1.25rem",
                }}
              >
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "var(--gold-accent)" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gold-accent)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Madhya Pradesh Bhumi Vikas Rules, 2012 • 2025 Updates
                </span>
              </div>

              <h1 style={{ fontSize: "2.75rem", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", color: "#FFFFFF" }}>
                BhuVikas AI Compliance <span style={{ color: "var(--gold-accent)" }}>Dashboard & Workspace</span>
              </h1>

              <p style={{ fontSize: "1.08rem", color: "#CBD5E1", lineHeight: 1.6, marginTop: "1rem" }}>
                Welcome to your unified regulatory intelligence desk. Access grounded Claude AI consultations,
                concise tabular statutory breakdowns, and instant verification for MP real estate projects.
              </p>

              {/* Login / Sign Up Action Buttons */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "2.25rem", flexWrap: "wrap", alignItems: "center" }}>
                <Link
                  href="/auth"
                  className="bv-btn-primary"
                  style={{
                    padding: "0.85rem 1.75rem",
                    fontSize: "0.95rem",
                    backgroundColor: "var(--teal-primary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <Lock width={18} height={18} />
                  <span>Log In & Sign Up</span>
                </Link>

                <button
                  onClick={() => {
                    switchDemoAccount("architect");
                    setGuestMode(true);
                  }}
                  className="bv-btn-gold"
                  style={{
                    padding: "0.85rem 1.75rem",
                    fontSize: "0.95rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <Sparkles width={18} height={18} />
                  <span>Explore Dashboard as Guest / Demo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Capabilities Section */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            <div
              style={{
                backgroundColor: "var(--card-white)",
                border: "1px solid var(--border-sand)",
                borderRadius: "1rem",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ width: "42px", height: "42px", borderRadius: "0.6rem", backgroundColor: "rgba(15, 118, 110, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal-primary)" }}>
                <MessageSquare width={22} height={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--ink-navy)" }}>ChatGPT-Style Regulatory AI</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Full conversational interface grounded with Claude AI on 108 MP Bhumi Vikas rules, 86 definitions, and High Court case law precedents.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "var(--card-white)",
                border: "1px solid var(--border-sand)",
                borderRadius: "1rem",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ width: "42px", height: "42px", borderRadius: "0.6rem", backgroundColor: "rgba(200, 161, 90, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-accent)" }}>
                <Scale width={22} height={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--ink-navy)" }}>Concise & Tabular Answers</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Clear direct verdicts, structured markdown tables for dimensional limits, and exact Gazette citations—no lengthy boilerplate essays.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "var(--card-white)",
                border: "1px solid var(--border-sand)",
                borderRadius: "1rem",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ width: "42px", height: "42px", borderRadius: "0.6rem", backgroundColor: "rgba(11, 31, 42, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-navy)" }}>
                <Sliders width={22} height={22} />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--ink-navy)" }}>History Directly in Sidebar</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                All past chats and regulation checks saved cleanly on your sidebar with zero scattered navigation.
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: UNIFIED CHATGPT-STYLE DASHBOARD WITH SIDEBAR HISTORY & CHAT
  // =========================================================================
  return (
    <div style={{ display: "flex", height: "calc(100vh - 73px)", overflow: "hidden", backgroundColor: "var(--sand-white)" }}>
      
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR: CHATGPT-STYLE SESSIONS & HISTORY            */}
      {/* ------------------------------------------------------------- */}
      <aside
        style={{
          width: sidebarOpen ? "300px" : "0px",
          minWidth: sidebarOpen ? "300px" : "0px",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          backgroundColor: "#0B1F2A",
          color: "#E2E8F0",
          borderRight: "1px solid #162E3D",
          display: "flex",
          flexDirection: "column",
          zIndex: 30,
        }}
      >
        {/* Top Action: New Chat Button */}
        <div style={{ padding: "1.1rem 1rem 0.75rem", borderBottom: "1px solid #162E3D" }}>
          <button
            onClick={() => createNewSession()}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              backgroundColor: "var(--teal-primary)",
              color: "#FFFFFF",
              padding: "0.75rem 1rem",
              borderRadius: "0.65rem",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 4px 12px rgba(15, 118, 110, 0.3)",
              transition: "all 0.15s ease",
            }}
          >
            <Plus width={18} height={18} />
            <span>New Consultation</span>
          </button>

          {/* Quick Search across history */}
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#162E3D",
              borderRadius: "0.5rem",
              padding: "0.4rem 0.65rem",
              border: "1px solid #213C4D",
            }}
          >
            <Search width={14} height={14} style={{ color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search past chats..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: "0.8rem",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* History List Container */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 0.6rem" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", padding: "0.35rem 0.5rem" }}>
            Recent History ({filteredSessions.length})
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.35rem" }}>
            {filteredSessions.length === 0 ? (
              <div style={{ padding: "1.5rem 0.5rem", textAlign: "center", color: "#64748B", fontSize: "0.8rem" }}>
                No past consultations found.
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isActive = session.id === activeSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontSize: "0.84rem",
                      backgroundColor: isActive ? "rgba(15, 118, 110, 0.25)" : "transparent",
                      borderLeft: isActive ? "3px solid var(--gold-accent)" : "3px solid transparent",
                      color: isActive ? "#FFFFFF" : "#CBD5E1",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
                      <MessageSquare width={15} height={15} style={{ flexShrink: 0, color: isActive ? "var(--gold-accent)" : "#94A3B8" }} />
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {session.title || "Untitled Consultation"}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      title="Delete chat"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#64748B",
                        cursor: "pointer",
                        padding: "0.2rem",
                        display: "flex",
                        alignItems: "center",
                        opacity: isActive ? 1 : 0.6,
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--status-error)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
                    >
                      <Trash2 width={13} height={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Footer: Profile & Settings */}
        <div style={{ padding: "0.85rem 1rem", borderTop: "1px solid #162E3D", backgroundColor: "#08161E" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--teal-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  color: "#FFFFFF",
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0) : "G"}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {currentUser?.name || "Guest Architect"}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--gold-accent)" }}>
                  {currentUser?.badge || "MP Town Planning Desk"}
                </div>
              </div>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setActiveLanguage(activeLanguage === "en" ? "hi" : "en")}
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "0.25rem 0.5rem",
                borderRadius: "0.35rem",
                backgroundColor: "#162E3D",
                color: "var(--gold-accent)",
                border: "1px solid #213C4D",
                cursor: "pointer",
              }}
            >
              {activeLanguage === "en" ? "EN" : "हिन्दी"}
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE: CHATGPT-STYLE AI CONVERSATION AREA         */}
      {/* ------------------------------------------------------------- */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", position: "relative" }}>
        
        {/* Workspace Top Header Bar */}
        <div
          style={{
            padding: "0.75rem 1.25rem",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderBottom: "1px solid var(--border-sand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(8px)",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            {/* Sidebar toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Collapse history sidebar" : "Expand history sidebar"}
              style={{
                background: "var(--sand-white)",
                border: "1px solid var(--border-sand)",
                borderRadius: "0.45rem",
                padding: "0.4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--ink-navy)",
              }}
            >
              {sidebarOpen ? <ChevronLeft width={16} height={16} /> : <ChevronRight width={16} height={16} />}
            </button>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                  {activeSession?.title || "MP Regulatory Consultation"}
                </span>
                <span className="bv-badge-teal" style={{ fontSize: "0.68rem" }}>
                  Claude AI • Sonnet 3.5 Grounded
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link
              href="/claude-ui-testing"
              className="bv-btn-outline"
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.78rem" }}
            >
              <Sparkles width={14} height={14} style={{ color: "var(--teal-primary)" }} />
              <span>AI Search Lab</span>
            </Link>

            <Link
              href="/rules"
              className="bv-btn-outline"
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.78rem" }}
            >
              <Sliders width={14} height={14} />
              <span>Rule Limits</span>
            </Link>
          </div>
        </div>

        {/* Message Thread Container (Scrollable) */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.5rem 7rem" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* If no messages yet: Welcome & Prompt Chips */}
            {(!activeSession || activeSession.messages.length === 0) ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "3rem 1rem 1rem" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "1rem",
                    backgroundColor: "rgba(15, 118, 110, 0.1)",
                    border: "1px solid rgba(15, 118, 110, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--teal-primary)",
                    marginBottom: "1.25rem",
                  }}
                >
                  <Logo size={36} />
                </div>

                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--ink-navy)", letterSpacing: "-0.02em" }}>
                  How can BhuVikas assist your project today?
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "540px", marginTop: "0.5rem", lineHeight: 1.6 }}>
                  Direct statutory questions are parsed against the Madhya Pradesh Bhumi Vikas Rules, 2012. Answers are concise, verified with tables, and cite exact Rule & Gazette pages.
                </p>

                {/* Prompt Pills */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.85rem", width: "100%", marginTop: "2.5rem" }}>
                  {samplePrompts.map((p, idx) => {
                    const IconComp = p.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePromptClick(p.query)}
                        style={{
                          backgroundColor: "var(--card-white)",
                          border: "1px solid var(--border-sand)",
                          borderRadius: "0.85rem",
                          padding: "1rem 1.15rem",
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.4rem",
                          transition: "all 0.15s ease",
                          boxShadow: "0 2px 6px rgba(11, 31, 42, 0.02)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--teal-primary)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 16px rgba(15, 118, 110, 0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border-sand)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 6px rgba(11, 31, 42, 0.02)";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--teal-primary)", fontWeight: 700, fontSize: "0.8rem" }}>
                          <IconComp width={14} height={14} />
                          <span>{p.title}</span>
                        </div>
                        <div style={{ color: "var(--ink-navy)", fontSize: "0.84rem", lineHeight: 1.4, fontWeight: 500 }}>
                          "{p.query}"
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Message Stream */
              activeSession.messages.map((msg) => {
                const isUser = msg.sender === "user";
                const isBot = msg.sender === "assistant";

                if (isUser) {
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "var(--card-white)",
                          border: "1px solid var(--border-sand)",
                          borderRadius: "1rem 1rem 0.25rem 1rem",
                          padding: "0.9rem 1.25rem",
                          maxWidth: "80%",
                          boxShadow: "0 2px 8px rgba(11, 31, 42, 0.03)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--teal-primary)" }}>You</span>
                          <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{msg.timestamp}</span>
                        </div>
                        <div style={{ fontSize: "0.92rem", color: "var(--ink-navy)", lineHeight: 1.5, fontWeight: 500 }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                }

                // AI Assistant Message Card
                const textContent = msg.text || (msg.data?.synthesis) || "";
                const sources = msg.sources || (msg.data?.matchedRules ? [msg.data.matchedRules] : []);

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      backgroundColor: "var(--card-white)",
                      border: "1px solid var(--border-sand)",
                      borderLeft: "4px solid var(--teal-primary)",
                      borderRadius: "1rem",
                      padding: "1.25rem 1.5rem",
                      boxShadow: "0 4px 16px rgba(11, 31, 42, 0.04)",
                    }}
                  >
                    {/* Bot Message Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", borderBottom: "1px solid rgba(230, 226, 217, 0.6)", paddingBottom: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "0.4rem",
                            backgroundColor: "rgba(15, 118, 110, 0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--teal-primary)",
                          }}
                        >
                          <Logo size={16} />
                        </div>
                        <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                          BhuVikas Statutory AI
                        </span>
                        <span className="bv-badge-gold" style={{ fontSize: "0.65rem" }}>
                          Concise Verdict
                        </span>
                        <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{msg.timestamp}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleCopy(textContent, msg.id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.35rem",
                          }}
                          title="Copy Answer"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check width={13} height={13} style={{ color: "var(--status-success)" }} />
                              <span style={{ color: "var(--status-success)" }}>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy width={13} height={13} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Formatted Markdown Content with Tables & Badges */}
                    <div style={{ color: "var(--ink-navy)" }}>
                      <MarkdownRenderer content={textContent} />
                    </div>

                    {/* Grounded Rule Badges & Sources Drawer Button */}
                    {sources && sources.length > 0 && (
                      <div
                        style={{
                          marginTop: "1rem",
                          paddingTop: "0.75rem",
                          borderTop: "1px solid var(--border-sand)",
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                          Statutory Citations:
                        </span>

                        {sources.map((s, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => openClauseInspector(s.number || s.id || s)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              backgroundColor: "rgba(200, 161, 90, 0.12)",
                              border: "1px solid rgba(200, 161, 90, 0.3)",
                              color: "var(--ink-navy)",
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              padding: "0.25rem 0.6rem",
                              borderRadius: "0.4rem",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(200, 161, 90, 0.25)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(200, 161, 90, 0.12)";
                            }}
                          >
                            <Scale width={12} height={12} style={{ color: "var(--gold-accent)" }} />
                            <span>{s.badge || s.title || `Rule ${s}`}</span>
                            {s.page && <span style={{ color: "#64748B", fontWeight: 500 }}>({s.page})</span>}
                            <Eye width={11} height={11} style={{ color: "var(--teal-primary)", marginLeft: "0.2rem" }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Typing / Loading Indicator */}
            {isTyping && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  backgroundColor: "var(--card-white)",
                  border: "1px solid var(--border-sand)",
                  borderRadius: "0.85rem",
                  padding: "0.85rem 1.25rem",
                  maxWidth: "460px",
                }}
              >
                <div className="bv-spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                <span style={{ fontSize: "0.82rem", color: "var(--teal-primary)", fontWeight: 600 }}>
                  Claude AI synthesizing concise statutory analysis...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. BOTTOM FLOATING PROMPT INPUT BAR (ChatGPT Style)          */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(247, 245, 240, 1) 75%, rgba(247, 245, 240, 0) 100%)",
            padding: "1.25rem 1.5rem 1.5rem",
            pointerEvents: "none",
          }}
        >
          <div style={{ maxWidth: "840px", margin: "0 auto", pointerEvents: "auto" }}>
            <form
              onSubmit={handleSendMessage}
              style={{
                backgroundColor: "var(--card-white)",
                borderRadius: "1rem",
                border: "1px solid var(--border-sand)",
                boxShadow: "0 8px 30px -8px rgba(11, 31, 42, 0.12)",
                padding: "0.6rem 0.85rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about MP building rules, FAR, setbacks, basements, deemed approvals... (Press Enter to send)"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontSize: "0.92rem",
                  color: "var(--ink-navy)",
                  fontFamily: "inherit",
                  padding: "0.4rem 0.25rem",
                  maxHeight: "120px",
                  lineHeight: 1.5,
                  background: "transparent",
                }}
              />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.35rem", borderTop: "1px solid rgba(230, 226, 217, 0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 600 }}>
                    {activeLanguage === "en" ? "English" : "हिन्दी"} Consultation
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  style={{
                    backgroundColor: inputQuery.trim() && !isTyping ? "var(--teal-primary)" : "#CBD5E1",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.45rem 1rem",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: inputQuery.trim() && !isTyping ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>Send</span>
                  <Send width={13} height={13} />
                </button>
              </div>
            </form>

            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                Madhya Pradesh Bhumi Vikas Rules, 2012 (updated March 2025). Grounded legal synthesis.
              </span>
            </div>
          </div>
        </div>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* 4. SIDE CLAUSE INSPECTOR SLIDE-OVER DRAWER                    */}
      {/* ------------------------------------------------------------- */}
      {inspectedClause && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "480px",
            maxWidth: "90vw",
            backgroundColor: "var(--card-white)",
            borderLeft: "1px solid var(--border-sand)",
            boxShadow: "-10px 0 30px rgba(11, 31, 42, 0.15)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: "1.25rem 1.5rem",
              backgroundColor: "var(--ink-navy)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span className="bv-badge-gold" style={{ fontSize: "0.68rem" }}>
                Rule {inspectedClause.number || inspectedClause.id}
              </span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginTop: "0.35rem", color: "#FFFFFF" }}>
                {inspectedClause.title || "Statutory Clause Detail"}
              </h3>
            </div>

            <button
              onClick={() => closeClauseInspector()}
              style={{
                background: "transparent",
                border: "none",
                color: "#CBD5E1",
                cursor: "pointer",
                padding: "0.35rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X width={20} height={20} />
            </button>
          </div>

          {/* Drawer Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {inspectedClause.page && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="bv-badge-teal">{inspectedClause.page}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Official MP Gazette Notification</span>
                </div>
              )}

              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Official Text:
                </h4>
                <div style={{ backgroundColor: "var(--sand-white)", padding: "1rem", borderRadius: "0.75rem", fontSize: "0.85rem", lineHeight: 1.6, color: "var(--ink-navy)", border: "1px solid var(--border-sand)" }}>
                  {inspectedClause.content || inspectedClause.snippet || inspectedClause.description || "Full text available in MP Bhumi Vikas Gazette volume."}
                </div>
              </div>

              {inspectedClause.provisos && inspectedClause.provisos.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                    Statutory Provisos:
                  </h4>
                  <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {inspectedClause.provisos.map((p, pIdx) => (
                      <li key={pIdx} style={{ fontSize: "0.82rem", color: "var(--ink-navy)", lineHeight: 1.5 }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {inspectedClause.attachedCaseLaws && inspectedClause.attachedCaseLaws.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gold-accent)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                    MP High Court Case Precedents:
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {inspectedClause.attachedCaseLaws.map((cl, clIdx) => (
                      <div key={clIdx} style={{ backgroundColor: "rgba(200, 161, 90, 0.08)", border: "1px solid rgba(200, 161, 90, 0.3)", padding: "0.75rem", borderRadius: "0.5rem" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--ink-navy)" }}>{cl.caseName}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--gold-accent)", fontWeight: 600 }}>{cl.citation}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{cl.summary}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

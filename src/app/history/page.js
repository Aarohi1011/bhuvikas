"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import {
  History,
  Search,
  MessageSquare,
  ArrowRight,
  Trash2,
  Copy,
  Check,
  Scale,
  Plus,
  ShieldCheck,
} from "@/components/icons";

export default function HistoryPage() {
  const router = useRouter();
  const { sessions, setActiveSessionId, deleteSession, createNewSession } = useChat();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterLang, setFilterLang] = useState("all"); // "all", "en", "hi"
  const [copiedId, setCopiedId] = useState(null);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.messages.some((m) => (m.text || "").toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLang = filterLang === "all" || s.language === filterLang;
    return matchesSearch && matchesLang;
  });

  const handleOpenSession = (sessionId) => {
    setActiveSessionId(sessionId);
    router.push("/chat");
  };

  const handleCopyTranscript = (session, id) => {
    const transcript = session.messages
      .map((m) => `${m.sender.toUpperCase()} (${m.timestamp}):\n${m.text || m.data?.summary || ""}`)
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(transcript);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ backgroundColor: "var(--sand-white)", minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Header Ribbon */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid var(--border-sand)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <span className="bv-badge-gold">AUDIT & RECORD ARCHIVE</span>
              <span style={{ color: "#94A3B8" }}>•</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                MP Bhumi Vikas Desk Records
              </span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--ink-navy)", letterSpacing: "-0.02em" }}>
              Consultation Case History
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Review, search, and resume past real estate compliance sessions, setback analyses, and cited gazettes.
            </p>
          </div>

          <Link href="/chat" className="bv-btn-primary" style={{ padding: "0.75rem 1.25rem" }}>
            <Plus width={16} height={16} />
            <span>New Consultation</span>
          </Link>
        </div>

        {/* Search & Filter Toolbar */}
        <div
          style={{
            backgroundColor: "var(--card-white)",
            borderRadius: "1rem",
            padding: "1rem 1.25rem",
            border: "1px solid var(--border-sand)",
            boxShadow: "0 2px 8px -2px rgba(11, 31, 42, 0.04)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Search Box */}
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search
              width={16}
              height={16}
              style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search by plot area, road width, clause number, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bv-input"
              style={{ paddingLeft: "2.4rem", fontSize: "0.82rem" }}
            />
          </div>

          {/* Language Tabs */}
          <div
            style={{
              display: "inline-flex",
              background: "var(--sand-white)",
              padding: "0.25rem",
              borderRadius: "0.6rem",
              border: "1px solid var(--border-sand)",
            }}
          >
            {[
              { id: "all", label: "All Sessions" },
              { id: "en", label: "English" },
              { id: "hi", label: "हिन्दी" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterLang(tab.id)}
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: "0.45rem",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  backgroundColor: filterLang === tab.id ? "#FFFFFF" : "transparent",
                  color: filterLang === tab.id ? "var(--ink-navy)" : "var(--text-muted)",
                  boxShadow: filterLang === tab.id ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
            Showing <strong>{filteredSessions.length}</strong> of {sessions.length} sessions
          </div>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div
            style={{
              backgroundColor: "var(--card-white)",
              borderRadius: "1.25rem",
              padding: "4rem 2rem",
              textAlign: "center",
              border: "1px dashed var(--border-sand)",
            }}
          >
            <div
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "1rem",
                background: "var(--sand-white)",
                color: "var(--text-muted)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <History width={24} height={24} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-navy)" }}>No Case Records Found</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem", maxWidth: "400px", margin: "0.35rem auto 1.5rem" }}>
              {searchTerm
                ? `No past consultations match "${searchTerm}". Try a different search term or clear the filter.`
                : "You don't have any saved consultation sessions yet. Launch your first inquiry!"}
            </p>
            <Link href="/chat" className="bv-btn-primary">
              <Plus width={16} height={16} />
              <span>Launch New Case Session</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bv-card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{ flex: 1, minWidth: "280px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                      <span className="bv-badge-teal">
                        <MessageSquare width={10} height={10} />
                        <span>{session.messages.length} exchanges</span>
                      </span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          background: "var(--sand-white)",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "0.35rem",
                          border: "1px solid var(--border-sand)",
                        }}
                      >
                        {session.language === "hi" ? "हिन्दी" : "English"}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        {new Date(session.updatedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h3
                      onClick={() => handleOpenSession(session.id)}
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 800,
                        color: "var(--ink-navy)",
                        cursor: "pointer",
                        letterSpacing: "-0.01em",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--teal-primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-navy)")}
                    >
                      {session.title}
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => handleCopyTranscript(session, session.id)}
                      style={{
                        padding: "0.45rem 0.75rem",
                        borderRadius: "0.5rem",
                        background: "var(--sand-white)",
                        border: "1px solid var(--border-sand)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--ink-navy)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                      title="Copy full transcript"
                    >
                      {copiedId === session.id ? (
                        <>
                          <Check width={14} height={14} style={{ color: "var(--status-success)" }} />
                          <span style={{ color: "var(--status-success)" }}>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy width={14} height={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteSession(session.id)}
                      style={{
                        padding: "0.45rem 0.65rem",
                        borderRadius: "0.5rem",
                        background: "var(--sand-white)",
                        border: "1px solid var(--border-sand)",
                        color: "var(--text-muted)",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      title="Delete session"
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--status-error)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      <Trash2 width={14} height={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenSession(session.id)}
                      className="bv-btn-primary"
                      style={{ padding: "0.45rem 0.95rem", fontSize: "0.75rem" }}
                    >
                      <span>Resume</span>
                      <ArrowRight width={12} height={12} />
                    </button>
                  </div>
                </div>

                {/* Preview Snippet of Last Message */}
                {session.messages.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "var(--sand-white)",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.6rem",
                      border: "1px solid var(--border-sand)",
                      fontSize: "0.78rem",
                      color: "var(--ink-navy)",
                      lineHeight: 1.5,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <strong>Latest Note:</strong>{" "}
                    {session.messages[session.messages.length - 1]?.text?.slice(0, 140) ||
                      session.messages[session.messages.length - 1]?.data?.summary ||
                      "Verified compliance report"}
                    ...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

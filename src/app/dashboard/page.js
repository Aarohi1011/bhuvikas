"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { evaluateMPBuildingRule, MP_BHUMI_VIKAS_RULES } from "@/lib/mpBhumiVikasData";
import {
  Building,
  ShieldCheck,
  Scale,
  FileText,
  MessageSquare,
  Sliders,
  Plus,
  ArrowRight,
  Eye,
  Trash2,
  Send,
  Palette,
  LifeBuoy,
  History,
  CheckCircle,
  Search,
  Sparkles,
} from "@/components/icons";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { sessions, createNewSession, sendMessage, deleteSession, openClauseInspector } = useChat();

  const [directQuery, setDirectQuery] = useState("");
  const [plotArea, setPlotArea] = useState("240");
  const [roadWidth, setRoadWidth] = useState("12");
  const [bldgType, setBldgType] = useState("residential");

  const quickCompliance = evaluateMPBuildingRule({
    plotArea: Number(plotArea) || 240,
    roadWidth: Number(roadWidth) || 12,
    buildingType: bldgType,
  });

  const handleDirectChatSubmit = (e) => {
    e.preventDefault();
    if (!directQuery.trim()) return;

    createNewSession(directQuery.trim().slice(0, 40) + "...");
    sendMessage(directQuery.trim());
    setDirectQuery("");
    router.push("/chat");
  };

  const handleOpenExistingSession = (sessionId) => {
    router.push("/chat");
  };

  return (
    <div style={{ backgroundColor: "var(--sand-white)", minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* 1. WELCOME HEADER (Executive Card) */}
        <div
          style={{
            backgroundColor: "var(--card-white)",
            borderRadius: "1.25rem",
            padding: "2rem 2.5rem",
            border: "1px solid var(--border-sand)",
            boxShadow: "0 10px 30px -10px rgba(11, 31, 42, 0.04)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span className="bv-badge-gold">{currentUser ? currentUser.badge : "Authorized Portal"}</span>
              <span style={{ color: "#94A3B8" }}>•</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>
                {currentUser?.organization || "Madhya Pradesh Urban Planning & Real Estate Advisory"}
              </span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--ink-navy)", letterSpacing: "-0.02em" }}>
              Good day, {currentUser ? currentUser.name : "Partner"}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Your intelligent regulation and real estate compliance desk under MP Bhumi Vikas Niyam, 2012.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/chat" className="bv-btn-primary">
              <Plus width={16} height={16} />
              <span>Start New Consultation</span>
            </Link>
            <Link href="/creative" className="bv-btn-secondary">
              <Palette width={16} height={16} style={{ color: "var(--teal-primary)" }} />
              <span>Create Listing</span>
            </Link>
          </div>
        </div>

        {/* 2. DIRECT CONSULTATION SEARCH BAR */}
        <div
          style={{
            backgroundColor: "var(--card-white)",
            borderRadius: "1rem",
            padding: "1.25rem 1.5rem",
            border: "1px solid var(--border-sand)",
            boxShadow: "0 4px 15px -3px rgba(11, 31, 42, 0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <Sparkles width={16} height={16} style={{ color: "var(--warm-gold)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--ink-navy)", textTransform: "uppercase" }}>
              Quick Regulation Inquiry
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              — Ask in English or Hindi
            </span>
          </div>

          <form onSubmit={handleDirectChatSubmit} style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                value={directQuery}
                onChange={(e) => setDirectQuery(e.target.value)}
                placeholder="Ask any rule: 'For a 240 m² plot on a 12m road, what are the front and rear setbacks?'..."
                className="bv-input"
                style={{ paddingLeft: "1rem", fontSize: "0.88rem" }}
              />
            </div>
            <button type="submit" className="bv-btn-primary" style={{ padding: "0 1.5rem", flexShrink: 0 }}>
              <Send width={16} height={16} />
              <span>Consult AI</span>
            </button>
          </form>
        </div>

        {/* 3. 4 CORE SERVICE SHORTCUT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          <Link href="/chat" className="bv-card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.75rem",
                background: "var(--teal-light)",
                color: "var(--teal-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare width={22} height={22} />
            </div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>AI Chat Workspace</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Ask Claude-style questions on setback margins, FAR, and rule limits with authentic clause citations.
            </p>
            <div style={{ marginTop: "auto", fontSize: "0.75rem", fontWeight: 700, color: "var(--teal-primary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Open Chat</span>
              <ArrowRight width={12} height={12} />
            </div>
          </Link>

          <Link href="/creative" className="bv-card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.75rem",
                background: "var(--gold-bg)",
                color: "var(--warm-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--gold-border)",
              }}
            >
              <Palette width={22} height={22} />
            </div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>Creative Studio</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Generate compliant property listings, brochures, and client WhatsApp pitches with auto-injected rules.
            </p>
            <div style={{ marginTop: "auto", fontSize: "0.75rem", fontWeight: 700, color: "var(--warm-gold)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Build Listing</span>
              <ArrowRight width={12} height={12} />
            </div>
          </Link>

          <Link href="/rules" className="bv-card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.75rem",
                background: "var(--teal-light)",
                color: "var(--teal-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sliders width={22} height={22} />
            </div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>Rule Limits Checker</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Interactive validator for setbacks, height formulas H=1.5×(W+S), and permissible FAR deficits.
            </p>
            <div style={{ marginTop: "auto", fontSize: "0.75rem", fontWeight: 700, color: "var(--teal-primary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Inspect Rules</span>
              <ArrowRight width={12} height={12} />
            </div>
          </Link>

          <Link href="/support" className="bv-card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.75rem",
                background: "var(--sand-white)",
                color: "var(--ink-navy)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--border-sand)",
              }}
            >
              <LifeBuoy width={22} height={22} />
            </div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>Support & Gazette Desk</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Direct ticket creation, WhatsApp support link, and municipal guidelines FAQ.
            </p>
            <div style={{ marginTop: "auto", fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-navy)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>Get Support</span>
              <ArrowRight width={12} height={12} />
            </div>
          </Link>
        </div>

        {/* 4. DASHBOARD SPLIT: LIVE CALCULATOR WIDGET + RECENT SESSIONS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
          
          {/* Left: Interactive Quick Rule Validator */}
          <div className="bv-card" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <span className="bv-badge-teal">INSTANT CALCULATOR</span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-navy)", marginTop: "0.3rem" }}>
                  On-Desk Setback & FAR Check
                </h3>
              </div>
              <span className="bv-badge-status-ok">Table 4 Active</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label className="bv-label">Plot Area (m²)</label>
                <input
                  type="number"
                  value={plotArea}
                  onChange={(e) => setPlotArea(e.target.value)}
                  className="bv-input"
                />
              </div>
              <div>
                <label className="bv-label">Road Width (m)</label>
                <input
                  type="number"
                  value={roadWidth}
                  onChange={(e) => setRoadWidth(e.target.value)}
                  className="bv-input"
                />
              </div>
            </div>

            {/* Quick Results Box */}
            <div
              style={{
                backgroundColor: "var(--sand-white)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                border: "1px solid var(--border-sand)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Slab Category:</span>
                <span style={{ fontWeight: 700, color: "var(--ink-navy)" }}>
                  {quickCompliance.inputs?.plotArea <= 100
                    ? "Up to 100 m² (Small Plot)"
                    : quickCompliance.inputs?.plotArea <= 250
                    ? "101 – 250 m² (Standard Plotted)"
                    : quickCompliance.inputs?.plotArea <= 500
                    ? "251 – 500 m² (Medium Plotted)"
                    : "Above 500 m² (Large Plotted)"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Front Setback (Table 4):</span>
                <span style={{ fontWeight: 800, color: "var(--teal-primary)" }}>
                  {quickCompliance.limits?.requiredFrontSetbackM} m
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Rear Setback:</span>
                <span style={{ fontWeight: 800, color: "var(--teal-primary)" }}>
                  {quickCompliance.limits?.requiredRearSetbackM} m
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Permissible Base FAR (Rule 44):</span>
                <span style={{ fontWeight: 800, color: "var(--warm-gold)" }}>
                  {quickCompliance.limits?.baseFAR?.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Max Building Height (Rule 55):</span>
                <span style={{ fontWeight: 800, color: "var(--ink-navy)" }}>
                  {quickCompliance.limits?.standardHeightLimitM} m
                </span>
              </div>
            </div>

            <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Cites Rule 52 (Setbacks) & Rule 44 (FAR)
              </span>
              <button
                type="button"
                onClick={() => openClauseInspector("rule-52")}
                style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--teal-primary)" }}
              >
                Inspect Official Gazette Clause ↗
              </button>
            </div>
          </div>

          {/* Right: Recent Consultations History */}
          <div className="bv-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <span className="bv-badge-gold">CASE SESSIONS</span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-navy)", marginTop: "0.3rem" }}>
                  Recent Consultations
                </h3>
              </div>
              <Link href="/history" style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--teal-primary)" }}>
                View All ({sessions.length})
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
              {sessions.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleOpenExistingSession(s.id)}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid var(--border-sand)",
                    backgroundColor: "var(--sand-white)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                  <div style={{ maxWidth: "80%" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ink-navy)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      {new Date(s.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {s.messages.length} messages
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--teal-primary)" }}>Resume →</span>
                </div>
              ))}
            </div>

            <Link
              href="/chat"
              className="bv-btn-primary"
              style={{ marginTop: "1.25rem", width: "100%", textAlign: "center" }}
            >
              <Plus width={16} height={16} />
              <span>Start New Consultation</span>
            </Link>
          </div>
        </div>

        {/* 5. OFFICIAL GAZETTE STATUTORY QUICK REFERENCE TILES */}
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
              STATUTORY REFERENCE TILES
            </span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ink-navy)", marginTop: "0.2rem" }}>
              Key Clauses of MP Bhumi Vikas Niyam, 2012
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {MP_BHUMI_VIKAS_RULES.map((rule) => (
              <div
                key={rule.ruleId}
                onClick={() => openClauseInspector(rule.ruleId)}
                className="bv-card"
                style={{
                  padding: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span className="bv-badge-gold">{rule.ruleNumber}</span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Pg {rule.pageInGazette}</span>
                  </div>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--ink-navy)", marginBottom: "0.35rem" }}>
                    {rule.ruleTitle}
                  </h4>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                    {rule.ruleTitleHindi}
                  </p>
                </div>

                <div style={{ marginTop: "1rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border-sand)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--teal-primary)", fontWeight: 700 }}>Inspect Gazette Clause</span>
                  <Eye width={14} height={14} style={{ color: "var(--teal-primary)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

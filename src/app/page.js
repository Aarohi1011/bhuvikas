"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { evaluateMPBuildingRule, MP_BHUMI_VIKAS_RULES } from "@/lib/mpBhumiVikasData";
import Logo from "@/components/Logo";
import {
  Building,
  ShieldCheck,
  Scale,
  FileText,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Sliders,
  Eye,
  MessageSquare,
  Palette,
  LifeBuoy,
  Lock,
} from "@/components/icons";

export default function HomePage() {
  const router = useRouter();
  const { sendMessage, createNewSession, openClauseInspector } = useChat();

  const [quickPlotArea, setQuickPlotArea] = useState("240");
  const [quickRoadWidth, setQuickRoadWidth] = useState("12");
  const [quickBuildingType, setQuickBuildingType] = useState("residential");

  const previewRule = evaluateMPBuildingRule({
    plotArea: Number(quickPlotArea) || 240,
    roadWidth: Number(quickRoadWidth) || 12,
    buildingType: quickBuildingType,
  });

  const sampleQueries = [
    {
      title: "Clerk & Broker Canonical Query",
      text: "For a 240 m² plot on a 12 m wide road, what setback rules apply?",
      lang: "EN",
      tag: "Setbacks & FAR",
      desc: "Instant breakdown of Table 4 front & rear margins with Rule 44 FAR limits.",
    },
    {
      title: "Hindi / Hinglish Consultation",
      text: "Agar plot 240 square metre ka hai aur road 12 metre ki hai, toh setback kitna chahiye?",
      lang: "HI",
      tag: "हिंदी परामर्श",
      desc: "Full vernacular support with exact gazetted terms explained simply.",
    },
    {
      title: "Basement Clearance & Restrictions",
      text: "Can I extend my basement into the front setback area under MP Bhumi Vikas Rule 60?",
      lang: "EN",
      tag: "Basement Rule 60",
      desc: "Statutory restriction alerts on front setback encroachments & ramp slopes.",
    },
    {
      title: "Permissible FAR & Ground Coverage",
      text: "What is the maximum permissible FAR and ground coverage on a 12m road in Bhopal?",
      lang: "EN",
      tag: "FAR Rule 44",
      desc: "Base FAR plus permissible purchasable compounding parameters.",
    },
  ];

  const handleLaunchQuery = (queryText) => {
    createNewSession(queryText.slice(0, 40) + "...");
    sendMessage(queryText);
    router.push("/chat");
  };

  return (
    <div style={{ backgroundColor: "var(--sand-white)", minHeight: "100vh" }}>
      {/* 1. HERO SECTION (Editorial Ink Navy) */}
      <section className="bv-hero-dark">
        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 10 }}>
          {/* Top Pill / Badge with Warm Gold Accent */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              marginBottom: "1.75rem",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--warm-gold)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FFFFFF" }}>
              Madhya Pradesh Bhumi Vikas Niyam, 2012
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>•</span>
            <span style={{ fontSize: "0.75rem", color: "var(--warm-gold)", fontWeight: 600 }}>
              Statutory Regulation Desk
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            {/* Left Content Column */}
            <div>
              <h1 className="bv-hero-title">
                Building Regulations, Made{" "}
                <span className="bv-hero-highlight">Understandable & Traceable.</span>
              </h1>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#CBD5E1",
                  lineHeight: 1.6,
                  marginTop: "1.25rem",
                  maxWidth: "580px",
                }}
              >
                The calm, evidence-grounded AI assistant for real estate brokers, municipal clerks, and architects.
                Convert bulky gazetted PDFs into exact setback limits, violation alerts, and official clause citations
                with zero hallucinations.
              </p>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
                <Link href="/chat" className="bv-btn-primary" style={{ padding: "0.85rem 1.6rem", fontSize: "0.9rem" }}>
                  <MessageSquare width={18} height={18} />
                  <span>Launch AI Assistant</span>
                </Link>
                <Link
                  href="/rules"
                  className="bv-btn-outline"
                  style={{ padding: "0.85rem 1.6rem", fontSize: "0.9rem" }}
                >
                  <Sliders width={18} height={18} />
                  <span>Instant Rule Sandbox</span>
                </Link>
              </div>

              {/* Verified Features Pill Line */}
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginTop: "2.5rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingTop: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ShieldCheck width={16} height={16} style={{ color: "#5EEAD4" }} />
                  <span style={{ fontSize: "0.78rem", color: "#E2E8F0", fontWeight: 600 }}>
                    Table 4 Math-Verified
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Scale width={16} height={16} style={{ color: "var(--warm-gold)" }} />
                  <span style={{ fontSize: "0.78rem", color: "#E2E8F0", fontWeight: 600 }}>
                    Zero Hallucinations
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle width={16} height={16} style={{ color: "#5EEAD4" }} />
                  <span style={{ fontSize: "0.78rem", color: "#E2E8F0", fontWeight: 600 }}>
                    Bilingual English / हिन्दी
                  </span>
                </div>
              </div>
            </div>

            {/* Right Interactive Glassmorphic Compliance Card */}
            <div>
              <div
                className="bv-glass-card"
                style={{
                  padding: "1.75rem",
                  position: "relative",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#5EEAD4",
                        boxShadow: "0 0 10px #5EEAD4",
                      }}
                    />
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.05em" }}>
                      LIVE RULE EVALUATOR
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                      background: "rgba(200, 161, 90, 0.2)",
                      border: "1px solid var(--warm-gold)",
                      color: "var(--warm-gold)",
                      fontWeight: 700,
                    }}
                  >
                    Gazette 2012 Grounded
                  </span>
                </div>

                {/* Live Inputs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", marginBottom: "0.3rem" }}>
                      PLOT AREA (M²)
                    </label>
                    <input
                      type="number"
                      value={quickPlotArea}
                      onChange={(e) => setQuickPlotArea(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.08)",
                        color: "#FFFFFF",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", marginBottom: "0.3rem" }}>
                      ROAD WIDTH (M)
                    </label>
                    <input
                      type="number"
                      value={quickRoadWidth}
                      onChange={(e) => setQuickRoadWidth(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.08)",
                        color: "#FFFFFF",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Building Type Selector */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", marginBottom: "0.3rem" }}>
                    USE CATEGORY
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {["residential", "commercial", "industrial"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setQuickBuildingType(type)}
                        style={{
                          flex: 1,
                          padding: "0.35rem 0.5rem",
                          borderRadius: "0.4rem",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "capitalize",
                          background: quickBuildingType === type ? "var(--teal-primary)" : "rgba(255,255,255,0.06)",
                          color: quickBuildingType === type ? "#FFFFFF" : "#CBD5E1",
                          border: quickBuildingType === type ? "1px solid #5EEAD4" : "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div
                  style={{
                    backgroundColor: "rgba(11, 31, 42, 0.7)",
                    borderRadius: "0.85rem",
                    padding: "1.1rem",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      paddingBottom: "0.65rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Table 4 Classification:</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#FFFFFF" }}>
                      {previewRule.inputs?.plotArea <= 100
                        ? "Up to 100 m² (Small Plot)"
                        : previewRule.inputs?.plotArea <= 250
                        ? "101 – 250 m² (Standard Plotted)"
                        : previewRule.inputs?.plotArea <= 500
                        ? "251 – 500 m² (Medium Plotted)"
                        : "Above 500 m² (Large Plotted)"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.6rem", borderRadius: "0.5rem" }}>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>Front Setback</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#5EEAD4" }}>
                        {previewRule.limits?.requiredFrontSetbackM} m
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#CBD5E1" }}>Min. front margin</div>
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.6rem", borderRadius: "0.5rem" }}>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>Rear Setback</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#5EEAD4" }}>
                        {previewRule.limits?.requiredRearSetbackM} m
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#CBD5E1" }}>Min. rear margin</div>
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.6rem", borderRadius: "0.5rem" }}>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>Base FAR</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--warm-gold)" }}>
                        {previewRule.limits?.baseFAR?.toFixed(2)}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#CBD5E1" }}>Rule 44 (Permissible)</div>
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.6rem", borderRadius: "0.5rem" }}>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase" }}>Max Height</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF" }}>
                        {previewRule.limits?.standardHeightLimitM}m
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#CBD5E1" }}>Rule 55: 1.5×(W+S)</div>
                    </div>
                  </div>

                  {/* Citation Footer */}
                  <div
                    style={{
                      marginTop: "0.85rem",
                      paddingTop: "0.65rem",
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                      Clause: Rule 52 (Table 4) & Rule 44
                    </span>
                    <button
                      type="button"
                      onClick={() => openClauseInspector("rule-52")}
                      style={{
                        fontSize: "0.72rem",
                        color: "#5EEAD4",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      Inspect Gazette ↗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & REPUTATION BANNER (Calm Sand White) */}
      <section style={{ padding: "2.5rem 1.5rem", borderBottom: "1px solid var(--border-sand)", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            <div style={{ padding: "1rem", borderLeft: "3px solid var(--teal-primary)" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--ink-navy)" }}>1,420+</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--teal-primary)", marginTop: "0.2rem" }}>
                GAZETTED CLAUSES
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Digitized from MP Bhumi Vikas Niyam, 2012
              </div>
            </div>

            <div style={{ padding: "1rem", borderLeft: "3px solid var(--warm-gold)" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--ink-navy)" }}>100%</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--warm-gold)", marginTop: "0.2rem" }}>
                DETERMINISTIC LOGIC
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Table 4 setbacks & Rule 44 math-verified
              </div>
            </div>

            <div style={{ padding: "1rem", borderLeft: "3px solid var(--ink-navy)" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--ink-navy)" }}>52</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-navy)", marginTop: "0.2rem" }}>
                DISTRICTS COVERED
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Bhopal, Indore, Jabalpur, Gwalior & all MP
              </div>
            </div>

            <div style={{ padding: "1rem", borderLeft: "3px solid var(--status-success)" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--ink-navy)" }}>&lt; 1.2s</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--status-success)", marginTop: "0.2rem" }}>
                RESPONSE LATENCY
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Hybrid Cerebras speed + Claude reasoning
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CANONICAL INQUIRY LAUNCHPAD (Subtle Interactive Cards) */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="bv-badge-gold">DIRECT QUESTION LAUNCHER</span>
            <h2
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "var(--ink-navy)",
                marginTop: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Real Questions from Madhya Pradesh Real Estate Desks
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Click any canonical prompt below to launch an evidence-backed consultation instantly.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {sampleQueries.map((item, index) => (
              <div
                key={index}
                onClick={() => handleLaunchQuery(item.text)}
                className="bv-card"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "1.5rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span className="bv-badge-teal">{item.tag}</span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        background: "var(--sand-white)",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "0.4rem",
                      }}
                    >
                      {item.lang}
                    </span>
                  </div>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--ink-navy)", marginBottom: "0.4rem" }}>
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--ink-navy)",
                      fontWeight: 600,
                      background: "var(--sand-white)",
                      padding: "0.75rem",
                      borderRadius: "0.6rem",
                      border: "1px solid var(--border-sand)",
                      fontStyle: "italic",
                      lineHeight: 1.45,
                    }}
                  >
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.65rem", lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--teal-primary)",
                    marginTop: "1.25rem",
                  }}
                >
                  <span>Test in AI Assistant</span>
                  <ArrowRight width={14} height={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE 3 CORE ARCHITECTURAL SYSTEMS */}
      <section style={{ padding: "4rem 1.5rem", backgroundColor: "#FFFFFF", borderTop: "1px solid var(--border-sand)", borderBottom: "1px solid var(--border-sand)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="bv-badge-teal">FOUNDATIONAL ARCHITECTURE</span>
            <h2
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "var(--ink-navy)",
                marginTop: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Engineered Like a Legal Intelligence Machine
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Three specialized systems prevent hallucinations and guarantee statutory correctness.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <div className="bv-card" style={{ padding: "2rem" }}>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "0.75rem",
                  background: "var(--teal-light)",
                  color: "var(--teal-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <FileText width={24} height={24} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-navy)", marginBottom: "0.5rem" }}>
                1. Document Intelligence Pipeline
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Converts bulky government PDF gazettes into structured, searchable tables and clauses. Page numbers,
                amendments, and exact Hindi/English legal definitions are preserved without loss.
              </p>
            </div>

            <div className="bv-card" style={{ padding: "2rem" }}>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "0.75rem",
                  background: "var(--gold-bg)",
                  color: "var(--warm-gold)",
                  border: "1px solid var(--gold-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <Sparkles width={24} height={24} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-navy)", marginBottom: "0.5rem" }}>
                2. Hybrid AI Reasoning (Claude + Cerebras)
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Claude delivers nuanced multi-step legal synthesis, while Cerebras provides ultra-fast sub-second
                retrieval. Real-time language switching handles colloquial Hinglish inquiries naturally.
              </p>
            </div>

            <div className="bv-card" style={{ padding: "2rem" }}>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "0.75rem",
                  background: "rgba(11, 31, 42, 0.05)",
                  color: "var(--ink-navy)",
                  border: "1px solid var(--border-sand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <ShieldCheck width={24} height={24} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-navy)", marginBottom: "0.5rem" }}>
                3. Deterministic Compliance Engine
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Mathematical calculations are executed by deterministic code algorithms rather than LLM guesswork.
                Table 4 setbacks and Rule 44 FAR limits are 100% verified against statutory formulas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORKFLOW COMPARISON (Before vs BhuVikas) */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="bv-badge-gold">EFFICIENCY SHIFT</span>
            <h2
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                color: "var(--ink-navy)",
                marginTop: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Why Madhya Pradesh Property Desks Rely on BhuVikas
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {/* The Old Way */}
            <div
              style={{
                backgroundColor: "#FFF1F2",
                border: "1px solid #FECDD3",
                borderRadius: "1rem",
                padding: "1.75rem",
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#BE123C", textTransform: "uppercase" }}>
                Traditional Manual Approach
              </div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--ink-navy)", margin: "0.5rem 0 1rem" }}>
                320-Page Scanned PDF Searching
              </h4>
              <ul style={{ fontSize: "0.8rem", color: "#475569", display: "flex", flexDirection: "column", gap: "0.6rem", paddingLeft: "1.2rem" }}>
                <li>Hours spent searching through outdated government gazettes.</li>
                <li>Ambiguous interpretation of Table 4 road width definitions.</li>
                <li>Risk of illegal construction notices from municipal corporations.</li>
                <li>Clients lose trust due to conflicting advice from different brokers.</li>
              </ul>
            </div>

            {/* The BhuVikas Way */}
            <div
              style={{
                backgroundColor: "#ECFDF5",
                border: "1px solid #A7F3D0",
                borderRadius: "1rem",
                padding: "1.75rem",
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#047857", textTransform: "uppercase" }}>
                With BhuVikas AI Desk
              </div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--ink-navy)", margin: "0.5rem 0 1rem" }}>
                Instant Grounded Statutory Clarity
              </h4>
              <ul style={{ fontSize: "0.8rem", color: "#1E293B", display: "flex", flexDirection: "column", gap: "0.6rem", paddingLeft: "1.2rem" }}>
                <li>Exact setback and FAR limits calculated in under 2 seconds.</li>
                <li>Authentic clause citations with verified page numbers.</li>
                <li>Compliant client pitches and WhatsApp listing generators.</li>
                <li>100% confidence before submitting plans to Bhopal or Indore civic desks.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section style={{ padding: "4rem 1.5rem", background: "var(--ink-navy)", color: "#FFFFFF" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <Logo size="lg" showSubtitle={false} />
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)",
              fontWeight: 800,
              marginTop: "1.25rem",
              letterSpacing: "-0.02em",
            }}
          >
            Start Evaluating Building Compliance Today
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#94A3B8", marginTop: "0.75rem", lineHeight: 1.6 }}>
            Join brokers, town planning consultants, and architects across Madhya Pradesh using BhuVikas AI for
            traceable building regulation intelligence.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <Link href="/auth?mode=signup" className="bv-btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "0.9rem" }}>
              <span>Create Free Account</span>
              <ArrowRight width={16} height={16} />
            </Link>
            <Link href="/dashboard" className="bv-btn-outline" style={{ padding: "0.85rem 1.75rem", fontSize: "0.9rem" }}>
              <span>View Executive Dashboard</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

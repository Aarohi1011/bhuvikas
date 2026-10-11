"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { evaluateMPBuildingRule, MP_BHUMI_VIKAS_RULES } from "@/lib/mpBhumiVikasData";
import {
  Building,
  ShieldCheck,
  Scale,
  FileText,
  Sliders,
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare,
  ArrowRight,
  Palette,
} from "@/components/icons";

export default function RulesPage() {
  const router = useRouter();
  const { sendMessage, createNewSession, openClauseInspector } = useChat();

  // Form Parameters
  const [plotArea, setPlotArea] = useState(240);
  const [roadWidth, setRoadWidth] = useState(12);
  const [buildingType, setBuildingType] = useState("residential");
  const [proposedFront, setProposedFront] = useState(3.0);
  const [proposedRear, setProposedRear] = useState(3.0);
  const [proposedHeight, setProposedHeight] = useState(12.0);
  const [proposedFAR, setProposedFAR] = useState(1.25);

  const [activeTab, setActiveTab] = useState("calculator"); // "calculator" or "library"

  // Evaluate live
  const evaluation = evaluateMPBuildingRule({
    plotArea: Number(plotArea) || 240,
    roadWidth: Number(roadWidth) || 12,
    buildingType: buildingType,
    proposedFrontSetback: proposedFront !== "" ? Number(proposedFront) : null,
    proposedRearSetback: proposedRear !== "" ? Number(proposedRear) : null,
    proposedHeight: proposedHeight !== "" ? Number(proposedHeight) : null,
    proposedFAR: proposedFAR !== "" ? Number(proposedFAR) : null,
  });

  const handleConsultAIWithResults = () => {
    const summaryPrompt = `I tested a proposed ${plotArea} m² ${buildingType} building on a ${roadWidth} m road with proposed Front Setback of ${proposedFront}m and Height ${proposedHeight}m. What rules are violated and what limits must I follow?`;
    createNewSession(`Check for ${plotArea}m² plot on ${roadWidth}m road`);
    sendMessage(summaryPrompt);
    router.push("/chat");
  };

  return (
    <div style={{ backgroundColor: "var(--sand-white)", minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
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
              <span className="bv-badge-gold">RULE LIMITS & DEFICIT ENGINE</span>
              <span style={{ color: "#94A3B8" }}>•</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                MP Bhumi Vikas Niyam, 2012
              </span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--ink-navy)", letterSpacing: "-0.02em" }}>
              Building Compliance & Restrictions Checker
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Input proposed plot specifications to calculate setbacks, height limits, and violating legal clauses.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: "inline-flex",
              background: "#FFFFFF",
              padding: "0.25rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-sand)",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("calculator")}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "0.55rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                backgroundColor: activeTab === "calculator" ? "var(--teal-primary)" : "transparent",
                color: activeTab === "calculator" ? "#FFFFFF" : "var(--ink-navy)",
                transition: "all 0.15s ease",
              }}
            >
              Interactive Validator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "0.55rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                backgroundColor: activeTab === "library" ? "var(--teal-primary)" : "transparent",
                color: activeTab === "library" ? "#FFFFFF" : "var(--ink-navy)",
                transition: "all 0.15s ease",
              }}
            >
              Gazetted Clauses Index
            </button>
          </div>
        </div>

        {activeTab === "calculator" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", alignItems: "start" }}>
            
            {/* Left Column: Input Form */}
            <div className="bv-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-navy)" }}>Proposed Site Parameters</h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                  Adjust values to trigger deterministic compliance checks.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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

              <div>
                <label className="bv-label">Zoning / Use Classification</label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="bv-input"
                >
                  <option value="residential">Plotted Residential</option>
                  <option value="commercial">Commercial / Retail</option>
                  <option value="industrial">Industrial / Warehouse</option>
                </select>
              </div>

              <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border-sand)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink-navy)", textTransform: "uppercase" }}>
                  Proposed Architectural Specifications
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="bv-label">Proposed Front Setback (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={proposedFront}
                    onChange={(e) => setProposedFront(e.target.value)}
                    className="bv-input"
                  />
                </div>
                <div>
                  <label className="bv-label">Proposed Rear Setback (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={proposedRear}
                    onChange={(e) => setProposedRear(e.target.value)}
                    className="bv-input"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="bv-label">Proposed Total Height (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={proposedHeight}
                    onChange={(e) => setProposedHeight(e.target.value)}
                    className="bv-input"
                  />
                </div>
                <div>
                  <label className="bv-label">Proposed Total FAR</label>
                  <input
                    type="number"
                    step="0.05"
                    value={proposedFAR}
                    onChange={(e) => setProposedFAR(e.target.value)}
                    className="bv-input"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleConsultAIWithResults}
                className="bv-btn-primary"
                style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
              >
                <MessageSquare width={16} height={16} />
                <span>Consult AI with this Scenario</span>
              </button>
            </div>

            {/* Right Column: Compliance Evaluation Engine Output */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Overall Status Banner */}
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderRadius: "1rem",
                  backgroundColor: evaluation.isViolating ? "#FFF1F2" : "#ECFDF5",
                  border: evaluation.isViolating ? "1px solid #FECDD3" : "1px solid #A7F3D0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {evaluation.isViolating ? (
                    <AlertTriangle width={24} height={24} style={{ color: "var(--status-error)" }} />
                  ) : (
                    <CheckCircle width={24} height={24} style={{ color: "var(--status-success)" }} />
                  )}
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: evaluation.isViolating ? "#BE123C" : "#047857" }}>
                      {evaluation.isViolating ? "Statutory Violations Detected" : "100% Permissible & Compliant"}
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: evaluation.isViolating ? "#9F1239" : "#065F46", marginTop: "0.15rem" }}>
                      {evaluation.isViolating
                        ? `${evaluation.violations.length} parameter(s) breach MP Bhumi Vikas Niyam, 2012 regulations.`
                        : "All proposed margins satisfy Table 4 setbacks and Rule 44 FAR limits."}
                    </p>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "9999px",
                    background: evaluation.isViolating ? "#BE123C" : "#047857",
                    color: "#FFFFFF",
                  }}
                >
                  {evaluation.isViolating ? "Non-Compliant" : "Permissible"}
                </span>
              </div>

              {/* Violations Detail Cards */}
              {evaluation.isViolating && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {evaluation.violations.map((v, idx) => (
                    <div
                      key={idx}
                      className="bv-card"
                      style={{
                        padding: "1.25rem",
                        borderLeft: "4px solid var(--status-error)",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--ink-navy)" }}>{v.parameter}</span>
                        <span className="bv-badge-status-error">{v.deficit}</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{v.explanation}</p>
                      <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "var(--teal-primary)", fontWeight: 700 }}>
                        Governing Rule: {v.ruleViolated}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Statutory Limits Matrix Table */}
              <div className="bv-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)", marginBottom: "1rem" }}>
                  Statutory Limit Thresholds (MP Bhumi Vikas 2012)
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-sand)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Mandatory Front Setback (Rule 52):</span>
                    <strong style={{ color: "var(--teal-primary)" }}>{evaluation.limits.requiredFrontSetbackM} meters</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-sand)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Mandatory Rear Setback (Rule 52):</span>
                    <strong style={{ color: "var(--teal-primary)" }}>{evaluation.limits.requiredRearSetbackM} meters</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-sand)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Permissible Base FAR (Rule 44):</span>
                    <strong style={{ color: "var(--warm-gold)" }}>{evaluation.limits.baseFAR.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-sand)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Purchasable Maximum FAR:</span>
                    <strong style={{ color: "var(--warm-gold)" }}>{evaluation.limits.maxPurchasableFAR.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-sand)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Max Ground Coverage:</span>
                    <strong style={{ color: "var(--ink-navy)" }}>{evaluation.limits.maxGroundCoveragePercent}% ({evaluation.limits.maxPermissibleGroundAreaSqm} m²)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Safe Height Limit (Rule 55):</span>
                    <strong style={{ color: "var(--ink-navy)" }}>{evaluation.limits.standardHeightLimitM} meters</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Gazetted Clauses Index Tab */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {MP_BHUMI_VIKAS_RULES.map((rule) => (
              <div
                key={rule.ruleId}
                className="bv-card"
                style={{ padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span className="bv-badge-gold">{rule.ruleNumber}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Gazette Pg {rule.pageInGazette}</span>
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--ink-navy)", marginBottom: "0.4rem" }}>
                    {rule.ruleTitle}
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "0.75rem" }}>
                    {rule.ruleTitleHindi}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--ink-navy)", lineHeight: 1.55 }}>
                    {rule.ruleSummary}
                  </p>
                </div>

                <div style={{ marginTop: "1.5rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-sand)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--teal-primary)", fontWeight: 700 }}>
                    {rule.chapter}
                  </span>
                  <button
                    type="button"
                    onClick={() => openClauseInspector(rule.ruleId)}
                    className="bv-btn-primary"
                    style={{ padding: "0.4rem 0.85rem", fontSize: "0.75rem" }}
                  >
                    <Eye width={14} height={14} />
                    <span>Inspect Clause</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

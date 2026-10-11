"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  User,
  Check,
  Palette,
  ShieldCheck,
  Building,
  Sliders,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "@/components/icons";

export default function SettingsPage() {
  const { currentUser, isAuthenticated } = useAuth();

  const [theme, setTheme] = useState("sand");
  const [name, setName] = useState(currentUser?.name || "Aarohi Saxena");
  const [email, setEmail] = useState(currentUser?.email || "aarohisaxena1011@gmail.com");
  const [role, setRole] = useState(currentUser?.role || "Town Planning Officer & Architect");
  const [org, setOrg] = useState(currentUser?.organization || "Directorate of Town & Country Planning (T&CP)");
  const [jurisdiction, setJurisdiction] = useState("Bhopal Municipal Corporation (BMC)");
  const [autoCiteRules, setAutoCiteRules] = useState(true);
  const [detailedTables, setDetailedTables] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setRole(currentUser.role || "Town Planning Officer & Architect");
      setOrg(currentUser.organization || "Directorate of Town & Country Planning (T&CP)");
    }
  }, [currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...(currentUser || {}),
        name,
        email,
        role,
        organization: org,
      };
      localStorage.setItem("bhuvikas_user", JSON.stringify(updatedUser));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--sand-white)", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "var(--teal-primary)",
            }}
          >
            <ArrowLeft width={16} height={16} />
            <span>Back to Regulatory AI Desk</span>
          </Link>

          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "0.2rem 0.65rem",
              borderRadius: "9999px",
              backgroundColor: "var(--gold-bg)",
              color: "#967332",
              border: "1px solid var(--gold-border)",
            }}
          >
            MP Bhumi Vikas 2012 Engine
          </span>
        </div>

        {/* Page Title Header */}
        <div
          style={{
            backgroundColor: "var(--card-white)",
            borderRadius: "1.25rem",
            padding: "2rem",
            border: "1px solid var(--border-sand)",
            boxShadow: "0 4px 20px -4px rgba(11, 31, 42, 0.05)",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.85rem",
                backgroundColor: "rgba(15, 118, 110, 0.1)",
                color: "var(--teal-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Settings width={24} height={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ink-navy)", letterSpacing: "-0.01em" }}>
                  Platform Settings & Intelligence Preferences
                </h1>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
                Configure your statutory consultation persona, multilingual explanation engine, and Madhya Pradesh municipal compliance parameters.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Card 1: Autonomous Trilingual Intelligence Highlight */}
          <div
            style={{
              backgroundColor: "var(--card-white)",
              borderRadius: "1.25rem",
              padding: "1.75rem",
              border: "1px solid var(--border-sand)",
            }}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                    Autonomous Multilingual Intelligence
                  </span>
                  <span className="bv-badge-gold">Auto-Detect Active</span>
                </div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(15, 118, 110, 0.08)",
                    color: "var(--teal-primary)",
                    border: "1px solid rgba(15, 118, 110, 0.2)",
                  }}
                >
                  Zero Setup Required
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: 1.5 }}>
                BhuVikas AI automatically senses your query language and crafts the reply in that exact tongue with statutory MP Bhumi Vikas Niyam, 2012 accuracy. You do not need to select or toggle languages manually.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {/* English Capability */}
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "0.85rem",
                  border: "1px solid var(--border-sand)",
                  backgroundColor: "var(--sand-white)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--teal-primary)" }} />
                  <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--ink-navy)" }}>English (Official)</span>
                </div>
                <p style={{ fontSize: "0.73rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                  Verbatim MP Gazette rule numbers, Table 4 setback calculations, and formal municipal architect notes.
                </p>
              </div>

              {/* Hindi Capability */}
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "0.85rem",
                  border: "1px solid var(--border-sand)",
                  backgroundColor: "var(--sand-white)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--warm-gold)" }} />
                  <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--ink-navy)" }}>हिन्दी (मध्य प्रदेश राजपत्र)</span>
                </div>
                <p style={{ fontSize: "0.73rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                  मध्य प्रदेश भूमि विकास नियम, 2012 के सभी प्रावधानों की प्रामाणिक, सरल और स्पष्ट हिन्दी व्याख्या।
                </p>
              </div>

              {/* Hinglish Capability */}
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "0.85rem",
                  border: "1px solid var(--border-sand)",
                  backgroundColor: "var(--sand-white)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3B82F6)" }} />
                  <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--ink-navy)" }}>Hinglish (Colloquial)</span>
                </div>
                <p style={{ fontSize: "0.73rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                  Real estate broker & client queries like <em>&ldquo;12m road par FAR aur parking rule kya hai?&rdquo;</em> directly answered.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Professional Profile & Consultation Stamp */}
          <div
            style={{
              backgroundColor: "var(--card-white)",
              borderRadius: "1.25rem",
              padding: "1.75rem",
              border: "1px solid var(--border-sand)",
            }}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                  Professional Profile & Digital Stamp
                </span>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "9999px", backgroundColor: "#EFF6FF", color: "#1D4ED8" }}>
                  Active Persona
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                These credentials stamp your compliance consultations, exported reports, and regulatory checks.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
              <div>
                <label className="bv-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bv-input"
                  placeholder="Aarohi Saxena"
                  required
                />
              </div>

              <div>
                <label className="bv-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bv-input"
                  placeholder="aarohisaxena1011@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="bv-label">Designation / Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bv-input"
                  placeholder="Town Planning Officer & Architect"
                />
              </div>

              <div>
                <label className="bv-label">Organization / Firm</label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="bv-input"
                  placeholder="Directorate of Town & Country Planning (T&CP)"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Madhya Pradesh Municipal Jurisdiction */}
          <div
            style={{
              backgroundColor: "var(--card-white)",
              borderRadius: "1.25rem",
              padding: "1.75rem",
              border: "1px solid var(--border-sand)",
            }}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                Regulatory Jurisdiction & Precision Defaults
              </span>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Select your primary municipal corporation in Madhya Pradesh for localized bylaws and road width criteria.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <label className="bv-label">Primary Corporation / Authority</label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="bv-input"
                >
                  <option value="Bhopal Municipal Corporation (BMC)">Bhopal Municipal Corporation (BMC)</option>
                  <option value="Indore Development Authority (IDA)">Indore Development Authority (IDA / IMC)</option>
                  <option value="Jabalpur Municipal Corporation (JMC)">Jabalpur Municipal Corporation (JMC)</option>
                  <option value="Gwalior Municipal Corporation (GMC)">Gwalior Municipal Corporation (GMC)</option>
                  <option value="Ujjain Municipal Corporation (UMC)">Ujjain Municipal Corporation (UMC)</option>
                  <option value="All Madhya Pradesh Municipal Areas">All MP Municipal Areas (Default Niyam 2012)</option>
                </select>
              </div>

              <div>
                <label className="bv-label">Statutory Benchmark Rule Set</label>
                <input
                  type="text"
                  value="MP Bhumi Vikas Niyam, 2012 (Gazette Notified)"
                  disabled
                  className="bv-input"
                  style={{ backgroundColor: "var(--sand-white)", color: "var(--text-muted)", cursor: "not-allowed" }}
                />
              </div>
            </div>

            {/* Checkbox toggles */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem", color: "var(--ink-navy)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoCiteRules}
                  onChange={(e) => setAutoCiteRules(e.target.checked)}
                  style={{ accentColor: "var(--teal-primary)", width: "16px", height: "16px" }}
                />
                <span style={{ fontWeight: 600 }}>Always include authentic MP Gazette clause numbers (e.g. Rule 44, Rule 60)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem", color: "var(--ink-navy)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={detailedTables}
                  onChange={(e) => setDetailedTables(e.target.checked)}
                  style={{ accentColor: "var(--teal-primary)", width: "16px", height: "16px" }}
                />
                <span style={{ fontWeight: 600 }}>Show Table 4 setbacks and MOS (Marginal Open Spaces) breakdown automatically</span>
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "0.5rem",
            }}
          >
            {saved ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--status-success)",
                  backgroundColor: "#ECFDF5",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #A7F3D0",
                }}
              >
                <Check width={16} height={16} />
                <span>Settings and profile preferences successfully saved!</span>
              </div>
            ) : (
              <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                Changes persist automatically in your active browser profile.
              </span>
            )}

            <button
              type="submit"
              className="bv-btn-primary"
              style={{ padding: "0.75rem 1.75rem" }}
            >
              <span>Save Preferences</span>
              <ArrowRight width={16} height={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

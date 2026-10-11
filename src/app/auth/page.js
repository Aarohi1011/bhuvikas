"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";
import {
  Phone,
  Mail,
  ChevronRight,
  Check,
  ShieldCheck,
  Building,
  Scale,
  Sparkles,
  ArrowRight,
  Lock,
  User,
} from "@/components/icons";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const { login, signup, demoAccounts, switchDemoAccount } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [authMethod, setAuthMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Real Estate Broker / Channel Partner");
  const [organization, setOrganization] = useState("Madhya Pradesh Property Advisory");
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const identifier = authMethod === "phone" ? phone : email;
    if (!identifier || !password) {
      setError(`Please enter your ${authMethod === "phone" ? "mobile phone number" : "email address"} and password/OTP.`);
      return;
    }

    if (mode === "login") {
      login(identifier, password, role);
      router.push("/dashboard");
    } else {
      if (!name) {
        setError("Please enter your full name.");
        return;
      }
      signup({ name, email: identifier, password, role, organization });
      router.push("/dashboard");
    }
  };

  const handleDemoSelect = (index) => {
    switchDemoAccount(index);
    router.push("/dashboard");
  };

  return (
    <div className="bv-auth-grid">
      {/* Left Editorial Pillar (Ink Navy) */}
      <div
        style={{
          backgroundColor: "var(--ink-navy)",
          color: "#FFFFFF",
          padding: "3.5rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          borderRight: "1px solid #1A3342",
        }}
      >
        {/* Subtle Decorative Background Lines */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200, 161, 90, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div>
          <Link href="/" style={{ display: "inline-block", marginBottom: "3rem" }}>
            <Logo size="lg" showSubtitle={false} />
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--warm-gold)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--warm-gold)", fontWeight: 700, letterSpacing: "0.05em" }}>
              MP BHUMI VIKAS NIYAM, 2012
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Building Regulations, <br />
            <span style={{ color: "var(--warm-gold)" }}>Grounded & Clear.</span>
          </h1>

          <p style={{ fontSize: "0.92rem", color: "#94A3B8", lineHeight: 1.6, maxWidth: "420px", marginBottom: "2.5rem" }}>
            The dedicated AI intelligence portal for real estate brokers, municipal planners, and architects across Madhya Pradesh.
          </p>

          {/* Pillars List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "0.6rem",
                  background: "rgba(15, 118, 110, 0.2)",
                  border: "1px solid rgba(153, 246, 228, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5EEAD4",
                  flexShrink: 0,
                }}
              >
                <ShieldCheck width={18} height={18} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>100% Deterministic Engine</h4>
                <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                  Table 4 setbacks, Rule 44 FAR, and Rule 60 basements mathematically evaluated.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "0.6rem",
                  background: "rgba(200, 161, 90, 0.15)",
                  border: "1px solid rgba(200, 161, 90, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--warm-gold)",
                  flexShrink: 0,
                }}
              >
                <Scale width={18} height={18} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Official Gazette Citations</h4>
                <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                  Every answer cites authentic MP Gazette clause numbers with zero hallucinations.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "0.6rem",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  flexShrink: 0,
                }}
              >
                <Building width={18} height={18} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Hindi & English Bilingual</h4>
                <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                  Seamless consultation for local MP brokers, municipal clerks, and private clients.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Quote Card */}
        <div
          style={{
            marginTop: "3rem",
            padding: "1.25rem",
            borderRadius: "0.85rem",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <p style={{ fontSize: "0.78rem", color: "#CBD5E1", fontStyle: "italic", lineHeight: 1.5 }}>
            &ldquo;BhuVikas AI shaved 3 days off our client setback clearances in Indore. The rule citations give buyers complete peace of mind.&rdquo;
          </p>
          <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--warm-gold)" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#FFFFFF" }}>Er. Rajesh Solanki</span>
            <span style={{ fontSize: "0.7rem", color: "#64748B" }}>• Indore Property Advisory</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel (Sand White) */}
      <div
        style={{
          backgroundColor: "var(--sand-white)",
          padding: "2.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: "460px", width: "100%" }}>
          {/* Top Utilities */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <Link
              href="/"
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              ← Back to Portal Home
            </Link>

            {/* Language Switcher Pill */}
            <div
              style={{
                display: "inline-flex",
                background: "#FFFFFF",
                padding: "0.2rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--border-sand)",
              }}
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                style={{
                  padding: "0.2rem 0.65rem",
                  borderRadius: "0.45rem",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  backgroundColor: language === "en" ? "var(--teal-primary)" : "transparent",
                  color: language === "en" ? "#FFFFFF" : "var(--ink-navy)",
                }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                style={{
                  padding: "0.2rem 0.65rem",
                  borderRadius: "0.45rem",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  backgroundColor: language === "hi" ? "var(--teal-primary)" : "transparent",
                  color: language === "hi" ? "#FFFFFF" : "var(--ink-navy)",
                }}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {/* Clean Card White Form Box */}
          <div
            style={{
              backgroundColor: "var(--card-white)",
              padding: "2rem",
              borderRadius: "1.25rem",
              border: "1px solid var(--border-sand)",
              boxShadow: "0 10px 25px -5px rgba(11, 31, 42, 0.04)",
            }}
          >
            {/* Mode Switcher Tabs */}
            <div
              style={{
                display: "flex",
                background: "var(--sand-white)",
                padding: "0.25rem",
                borderRadius: "0.75rem",
                border: "1px solid var(--border-sand)",
                marginBottom: "1.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "0.55rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  borderRadius: "0.55rem",
                  backgroundColor: mode === "login" ? "#FFFFFF" : "transparent",
                  color: mode === "login" ? "var(--ink-navy)" : "var(--text-muted)",
                  boxShadow: mode === "login" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "0.55rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  borderRadius: "0.55rem",
                  backgroundColor: mode === "signup" ? "#FFFFFF" : "transparent",
                  color: mode === "signup" ? "var(--ink-navy)" : "var(--text-muted)",
                  boxShadow: mode === "signup" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                Register
              </button>
            </div>

            {/* Heading & Subtitle */}
            <div style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ink-navy)", letterSpacing: "-0.01em" }}>
                {mode === "login" ? "Welcome back to BhuVikas" : "Create Professional Account"}
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                {mode === "login"
                  ? "Access your saved compliance sessions & listing drafts."
                  : "Start evaluating building rules with statutory accuracy."}
              </p>
            </div>

            {/* Email vs Phone Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginBottom: "1.25rem",
                padding: "0.4rem 0.75rem",
                backgroundColor: "var(--sand-white)",
                borderRadius: "0.5rem",
              }}
            >
              <span>Method:</span>
              <button
                type="button"
                onClick={() => setAuthMethod("email")}
                style={{
                  fontWeight: 700,
                  color: authMethod === "email" ? "var(--teal-primary)" : "var(--text-muted)",
                  textDecoration: authMethod === "email" ? "underline" : "none",
                }}
              >
                Email Address
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setAuthMethod("phone")}
                style={{
                  fontWeight: 700,
                  color: authMethod === "phone" ? "var(--teal-primary)" : "var(--text-muted)",
                  textDecoration: authMethod === "phone" ? "underline" : "none",
                }}
              >
                Mobile (OTP)
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.6rem",
                  backgroundColor: "#FFF1F2",
                  border: "1px solid #FECDD3",
                  color: "var(--status-error)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                }}
              >
                {error}
              </div>
            )}

            {/* The Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {mode === "signup" && (
                <div>
                  <label className="bv-label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Er. Aarohi Sharma"
                    className="bv-input"
                  />
                </div>
              )}

              {authMethod === "email" ? (
                <div>
                  <label className="bv-label">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="broker@mp-realty.in"
                    className="bv-input"
                  />
                </div>
              ) : (
                <div>
                  <label className="bv-label">Mobile Phone Number</label>
                  <div style={{ display: "flex" }}>
                    <span
                      style={{
                        padding: "0.75rem 0.85rem",
                        background: "#ECE8E0",
                        border: "1px solid var(--border-sand)",
                        borderRight: "none",
                        borderRadius: "0.75rem 0 0 0.75rem",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "var(--ink-navy)",
                      }}
                    >
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98260 12345"
                      className="bv-input"
                      style={{ borderRadius: "0 0.75rem 0.75rem 0" }}
                    />
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <>
                  <div>
                    <label className="bv-label">Professional Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="bv-input"
                    >
                      <option value="Real Estate Broker / Channel Partner">Real Estate Broker / Channel Partner</option>
                      <option value="Town Planning Officer / Municipal Clerk">Town Planning Officer / Municipal Clerk</option>
                      <option value="Licensed Architect / Structural Engineer">Licensed Architect / Structural Engineer</option>
                      <option value="Property Developer / Investor">Property Developer / Investor</option>
                    </select>
                  </div>

                  <div>
                    <label className="bv-label">Firm / Agency</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Bhopal Realty Advisory"
                      className="bv-input"
                    />
                  </div>
                </>
              )}

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="bv-label">
                    {authMethod === "phone" ? "OTP or Security Code" : "Password"}
                  </label>
                  {mode === "login" && (
                    <span style={{ fontSize: "0.7rem", color: "var(--teal-primary)", fontWeight: 600, cursor: "pointer" }}>
                      Forgot?
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bv-input"
                />
              </div>

              <button
                type="submit"
                className="bv-btn-primary"
                style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
              >
                <span>{mode === "login" ? "Enter BhuVikas Desk" : "Create My Account"}</span>
                <ArrowRight width={16} height={16} />
              </button>
            </form>

            {/* Quick Demo Switcher */}
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-sand)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  One-Click Instant Demo Access
                </span>
                <span className="bv-badge-gold">No typing needed</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {demoAccounts.map((demo, idx) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleDemoSelect(idx)}
                    style={{
                      textAlign: "left",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "0.65rem",
                      background: "var(--sand-white)",
                      border: "1px solid var(--border-sand)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
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
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink-navy)" }}>{demo.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {demo.role} • {demo.organization}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--teal-primary)" }}>Select →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Statutory Security Disclaimer */}
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                fontSize: "0.68rem",
                color: "var(--text-muted)",
              }}
            >
              <Lock width={12} height={12} style={{ color: "var(--teal-primary)" }} />
              <span>Grounded in MP Bhumi Vikas Niyam, 2012 • 256-bit Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--ink-navy)" }}>
          Loading BhuVikas Authentication Desk...
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}

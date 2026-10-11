"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  ShieldCheck,
  Scale,
  FileText,
  LifeBuoy,
  Building,
  Sliders,
  MessageSquare,
  Palette,
  History,
  Lock,
} from "@/components/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: "auto",
        backgroundColor: "var(--ink-navy)",
        color: "#94A3B8",
        borderTop: "1px solid #162E3D",
        position: "relative",
      }}
    >
      {/* Subtle Warm Gold & Teal Accent Ribbon on top */}
      <div
        style={{
          height: "2px",
          width: "100%",
          background: "linear-gradient(90deg, #0F766E 0%, #C8A15A 50%, #0F766E 100%)",
          opacity: 0.8,
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3.5rem 1.5rem 2.5rem" }}>
        {/* Main Footer Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Column 1: Brand & Statutory Mission */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", gridColumn: "span 1" }}>
            <Link href="/" style={{ display: "inline-block" }}>
              <Logo size="md" showSubtitle={true} inverted={true} />
            </Link>

            <p style={{ fontSize: "0.8rem", color: "#94A3B8", lineHeight: 1.65, maxWidth: "340px" }}>
              The calm, evidence-grounded regulatory intelligence desk for real estate brokers, municipal planning clerks,
              and architects across Madhya Pradesh.
            </p>

            {/* Official Accreditation Badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.72rem",
                  color: "#E2E8F0",
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  width: "fit-content",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--status-success)" }} />
                <span>MP Bhumi Vikas Niyam, 2012 Grounded</span>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.72rem",
                  color: "var(--warm-gold)",
                  background: "rgba(200, 161, 90, 0.08)",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(200, 161, 90, 0.2)",
                  width: "fit-content",
                }}
              >
                <Scale width={12} height={12} style={{ color: "var(--warm-gold)" }} />
                <span>Deterministic Math Engine • Zero Hallucinations</span>
              </div>
            </div>
          </div>

          {/* Column 2: Portal Desks & Workspaces */}
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              Portal Workspaces
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
              <li>
                <Link
                  href="/dashboard"
                  style={{ color: "#CBD5E1", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--warm-gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                >
                  <Building width={14} height={14} style={{ color: "var(--teal-primary)" }} />
                  <span>Broker & Planner Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  style={{ color: "#CBD5E1", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--warm-gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                >
                  <MessageSquare width={14} height={14} style={{ color: "var(--teal-primary)" }} />
                  <span>AI Regulation Assistant & Chat</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/creative"
                  style={{ color: "#CBD5E1", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--warm-gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                >
                  <Palette width={14} height={14} style={{ color: "var(--warm-gold)" }} />
                  <span>Creative Listing Studio</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/rules"
                  style={{ color: "#CBD5E1", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--warm-gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                >
                  <Sliders width={14} height={14} style={{ color: "var(--teal-primary)" }} />
                  <span>Setback & FAR Rule Limits</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  style={{ color: "#CBD5E1", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--warm-gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                >
                  <History width={14} height={14} style={{ color: "#94A3B8" }} />
                  <span>Case History & Full Search</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Regional MP Planning Zones */}
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              MP Jurisdictions Covered
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem", color: "#CBD5E1" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--teal-primary)" }} />
                <span>Bhopal Municipal Corporation (BMC)</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--warm-gold)" }} />
                <span>Indore Development Authority (IDA)</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--teal-primary)" }} />
                <span>Jabalpur Development Authority (JDA)</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--warm-gold)" }} />
                <span>Gwalior Town Planning Zone</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--teal-primary)" }} />
                <span>Ujjain Smart City & Simhastha Zone</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Statutory Acts & Support Desk */}
          <div>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              Statutory Help & Acts
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
              <li>
                <Link
                  href="/support"
                  style={{ color: "#CBD5E1", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--warm-gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                >
                  <LifeBuoy width={14} height={14} style={{ color: "var(--teal-primary)" }} />
                  <span>Support Center & Direct WhatsApp</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  style={{ color: "#CBD5E1", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--warm-gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#CBD5E1")}
                >
                  <FileText width={14} height={14} style={{ color: "var(--warm-gold)" }} />
                  <span>Language (हिन्दी / EN) Settings</span>
                </Link>
              </li>
              <li style={{ fontSize: "0.72rem", color: "#64748B", paddingTop: "0.5rem", lineHeight: 1.5 }}>
                Statutory Parent Act: MP Nagar Tatha Gram Nivesh Adhiniyam, 1973 (No. 23 of 1973)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security Note */}
        <div
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid #162E3D",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.72rem",
            color: "#64748B",
          }}
        >
          <div>
            © {currentYear} <strong style={{ color: "#CBD5E1" }}>BhuVikas AI (भू-विकास)</strong>. Crafted in subtle English tones
            (Deep Teal, Ink Navy, Warm Gold, Sand White).
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#94A3B8" }}>
              <Lock width={12} height={12} style={{ color: "var(--teal-primary)" }} />
              <span>256-bit Encrypted Session</span>
            </span>
            <span style={{ color: "#334155" }}>•</span>
            <span style={{ color: "#94A3B8" }}>Directorate of Town & Country Planning (T&CP) MP Grounded</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

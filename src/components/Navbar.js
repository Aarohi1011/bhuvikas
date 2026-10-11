"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import Logo from "@/components/Logo";
import {
  MessageSquare,
  Scale,
  History,
  Palette,
  LifeBuoy,
  Settings,
  ChevronRight,
  Sliders,
  LogOut,
  Sparkles,
} from "@/components/icons";

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, isAuthenticated, logout, demoAccounts, switchDemoAccount } = useAuth();
  const { activeLanguage, setActiveLanguage } = useChat();
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Scale },
    { href: "/chat", label: "AI Regulation Chat", icon: MessageSquare, badge: "Claude" },
    { href: "/claude-ui-testing", label: "AI Search Lab", icon: Sparkles, badge: "New" },
    { href: "/history", label: "History", icon: History },
    { href: "/creative", label: "Creative Studio", icon: Palette },
    { href: "/rules", label: "Rule Limits", icon: Sliders },
    { href: "/support", label: "Support", icon: LifeBuoy },
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-sand)", background: "rgba(255, 255, 255, 0.98)", backdropFilter: "blur(10px)" }}>
      {/* Top Utility Ribbon */}
      <div className="bv-topbar">
        <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--status-success)" }}></span>
            <span style={{ color: "#F1F5F9", fontWeight: 600 }}>Madhya Pradesh Real Estate & Bhumi Vikas Desk</span>
            <span style={{ color: "#475569" }}>•</span>
            <span style={{ color: "#94A3B8" }}>Broker & Town Planning Compliance</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Multilingual Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "#162E3D", padding: "0.15rem 0.35rem", borderRadius: "0.5rem", border: "1px solid #213C4D" }}>
              <button
                onClick={() => setActiveLanguage("en")}
                style={{
                  padding: "0.15rem 0.5rem",
                  borderRadius: "0.35rem",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  backgroundColor: activeLanguage === "en" ? "var(--teal-primary)" : "transparent",
                  color: "#FFFFFF",
                }}
              >
                EN
              </button>
              <button
                onClick={() => setActiveLanguage("hi")}
                style={{
                  padding: "0.15rem 0.5rem",
                  borderRadius: "0.35rem",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  backgroundColor: activeLanguage === "hi" ? "var(--teal-primary)" : "transparent",
                  color: "#FFFFFF",
                }}
              >
                हिन्दी
              </button>
            </div>

            <Link href="/settings" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#94A3B8", fontSize: "0.72rem" }}>
              <Settings width={14} height={14} style={{ color: "var(--warm-gold)" }} />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", height: "4.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Logo size="md" showSubtitle={true} />
        </Link>

        {/* Center Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: isActive ? "var(--teal-primary)" : "#334155",
                  backgroundColor: isActive ? "var(--sand-white)" : "transparent",
                  border: isActive ? "1px solid var(--border-sand)" : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon width={16} height={16} style={{ color: isActive ? "var(--teal-primary)" : "#64748B" }} />
                <span>{link.label}</span>
                {link.badge && (
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "0.1rem 0.4rem", borderRadius: "9999px", background: "var(--gold-bg)", color: "#967332", border: "1px solid var(--gold-border)" }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Profile Area */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isAuthenticated && currentUser ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.35rem 0.75rem 0.35rem 0.4rem",
                  borderRadius: "9999px",
                  border: "1px solid var(--border-sand)",
                  backgroundColor: "var(--card-white)",
                  cursor: "pointer",
                }}
              >
                <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", backgroundColor: "var(--teal-primary)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem" }}>
                  {currentUser.avatar || "A"}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink-navy)", lineHeight: 1.2 }}>{currentUser.name}</div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{currentUser.role.split(" ")[0]}</div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    marginTop: "0.5rem",
                    width: "18rem",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "1rem",
                    border: "1px solid var(--border-sand)",
                    boxShadow: "0 10px 25px -5px rgba(11, 31, 42, 0.1)",
                    padding: "0.5rem",
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: "0.75rem", borderBottom: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--ink-navy)" }}>{currentUser.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{currentUser.email}</div>
                    <div style={{ marginTop: "0.35rem" }}>
                      <span className="bv-badge-gold">{currentUser.badge}</span>
                    </div>
                  </div>

                  <div style={{ padding: "0.5rem" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.35rem", padding: "0 0.5rem" }}>
                      Quick Switch Persona
                    </div>
                    {demoAccounts.map((acc, idx) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          switchDemoAccount(idx);
                          setProfileOpen(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "0.4rem 0.5rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.75rem",
                          fontWeight: currentUser.id === acc.id ? 700 : 500,
                          backgroundColor: currentUser.id === acc.id ? "var(--sand-white)" : "transparent",
                          color: currentUser.id === acc.id ? "var(--teal-primary)" : "var(--ink-navy)",
                          display: "flex",
                          justifyContent: "space-between",
                          cursor: "pointer",
                        }}
                      >
                        <span>{acc.name}</span>
                        <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{acc.role.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.35rem" }}>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--status-error)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <LogOut width={16} height={16} style={{ color: "var(--status-error)" }} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link href="/auth?mode=login" className="bv-btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
                Sign In
              </Link>
              <Link href="/auth?mode=signup" className="bv-btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
                <span>Register</span>
                <ChevronRight width={14} height={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

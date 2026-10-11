"use client";

import React from "react";

export default function Logo({ size = "md", showSubtitle = true, inverted = false }) {
  // Dimension tokens based on size
  const iconDim = size === "lg" ? 44 : size === "sm" ? 30 : 38;
  const titleFontSize = size === "lg" ? "1.35rem" : size === "sm" ? "1rem" : "1.18rem";
  const subtitleFontSize = size === "lg" ? "0.74rem" : size === "sm" ? "0.64rem" : "0.68rem";
  const badgeFontSize = size === "lg" ? "0.68rem" : size === "sm" ? "0.58rem" : "0.62rem";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "lg" ? "0.85rem" : "0.65rem",
        userSelect: "none",
        textDecoration: "none",
      }}
    >
      {/* Bespoke Architectural Emblem */}
      <div
        style={{
          width: `${iconDim}px`,
          height: `${iconDim}px`,
          borderRadius: size === "lg" ? "0.85rem" : "0.65rem",
          background: inverted
            ? "linear-gradient(135deg, #162E3D 0%, #0B1F2A 100%)"
            : "linear-gradient(135deg, #0B1F2A 0%, #162E3D 100%)",
          border: inverted ? "1px solid rgba(200, 161, 90, 0.3)" : "1px solid rgba(15, 118, 110, 0.35)",
          boxShadow: inverted
            ? "0 4px 14px rgba(0, 0, 0, 0.4)"
            : "0 4px 14px rgba(11, 31, 42, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Warm Gold Accent Corner Shimmer */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200, 161, 90, 0.4) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Handcrafted Isometric Architectural SVG */}
        <svg
          width={iconDim * 0.65}
          height={iconDim * 0.65}
          viewBox="0 0 32 32"
          fill="none"
          style={{ display: "block" }}
        >
          {/* Ground Cadastral Datum Line */}
          <line x1="3" y1="28" x2="29" y2="28" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" />

          {/* Isometric Building Pavilion Facets */}
          {/* Left Facet: Deep Teal */}
          <polygon
            points="16,5 5,11 5,23 16,17"
            fill="#0F766E"
            opacity="0.9"
            stroke="#5EEAD4"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Right Facet: Modern Elevation Grid */}
          <polygon
            points="16,5 27,11 27,23 16,17"
            fill="#115E59"
            opacity="0.75"
            stroke="#5EEAD4"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Front Entrance Portal */}
          <polygon
            points="16,17 16,27 21,24 21,14.5"
            fill="#0B1F2A"
            stroke="#99F6E4"
            strokeWidth="1"
          />

          {/* Architectural Cadastral Floor Divisions */}
          <line x1="5" y1="17" x2="16" y2="11" stroke="#99F6E4" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="16" y1="11" x2="27" y2="17" stroke="#99F6E4" strokeWidth="1" strokeOpacity="0.6" />

          {/* Warm Gold Crown / Surveyor's Zenith Compass */}
          <circle cx="16" cy="5" r="2.2" fill="#C8A15A" stroke="#FFFFFF" strokeWidth="0.8" />
          <path d="M16 2.5V3.5" stroke="#C8A15A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Name & Devanagari Identity */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <span
            style={{
              fontSize: titleFontSize,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: inverted ? "#FFFFFF" : "var(--ink-navy)",
            }}
          >
            BhuVikas
          </span>

          {/* Editorial Gold Pill Badge */}
          <span
            style={{
              fontSize: badgeFontSize,
              fontWeight: 800,
              padding: "0.15rem 0.45rem",
              borderRadius: "0.4rem",
              background: inverted ? "rgba(200, 161, 90, 0.15)" : "#FDFBF7",
              color: inverted ? "#E6C887" : "#967332",
              border: inverted ? "1px solid rgba(200, 161, 90, 0.3)" : "1px solid #EADBBE",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            AI • भू-विकास
          </span>
        </div>

        {showSubtitle && (
          <span
            style={{
              fontSize: subtitleFontSize,
              fontWeight: 600,
              color: inverted ? "#94A3B8" : "var(--text-muted)",
              marginTop: "0.2rem",
              letterSpacing: "0.01em",
            }}
          >
            Madhya Pradesh Building Rules & Planning Desk
          </span>
        )}
      </div>
    </div>
  );
}

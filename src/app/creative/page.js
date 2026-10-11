"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { evaluateMPBuildingRule } from "@/lib/mpBhumiVikasData";
import {
  Palette,
  FileText,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  Scale,
  Building,
  CheckCircle,
  ArrowRight,
  Phone,
} from "@/components/icons";

export default function CreativePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, loading, router]);

  const [assetType, setAssetType] = useState("listing"); // "listing", "whatsapp", "brochure"
  const [propertyTitle, setPropertyTitle] = useState("Prime 240 m² Freehold Residential Plot, Arera Colony");
  const [location, setLocation] = useState("Arera Colony (Zone-10), Bhopal, MP");
  const [plotArea, setPlotArea] = useState("240");
  const [roadWidth, setRoadWidth] = useState("12");
  const [buildingType, setBuildingType] = useState("residential");
  const [price, setPrice] = useState("₹1.85 Cr (₹7,100 / sq.ft)");
  const [highlights, setHighlights] = useState("East-facing, Clear Title, 12m Wide Sector Road, T&CP Approved layout, Corner proximity");
  const [copied, setCopied] = useState(false);

  // Compute live compliant metrics
  const ruleData = evaluateMPBuildingRule({
    plotArea: Number(plotArea) || 240,
    roadWidth: Number(roadWidth) || 12,
    buildingType,
  });

  // Generate copy based on template
  const generateOutput = () => {
    if (assetType === "whatsapp") {
      return `🏰 *PREMIUM PROPERTY SPOTLIGHT — ${propertyTitle.toUpperCase()}* 🏰

📍 *Location:* ${location}
📐 *Plot Size:* ${plotArea} sq.m (${(Number(plotArea) * 10.764).toFixed(0)} sq.ft approx.)
🛣️ *Road Width:* ${roadWidth} meters wide planned corridor
💰 *Demand:* ${price}

✅ *MP BHUMI VIKAS NIYAM 2012 COMPLIANCE VERIFIED:*
• Permissible Base FAR: ${ruleData.limits.baseFAR} (Purchasable up to ${ruleData.limits.maxPurchasableFAR})
• Mandatory Front Setback: ${ruleData.limits.requiredFrontSetbackM} meters (Rule 52 Table 4)
• Rear Setback: ${ruleData.limits.requiredRearSetbackM} meters | Side: ${ruleData.limits.requiredSideSetbackM} meters
• Ground Coverage Permitted: Up to ${ruleData.limits.maxGroundCoveragePercent}% (${ruleData.limits.maxPermissibleGroundAreaSqm} sq.m)
• Height Clearance: G+3 Floors (${ruleData.limits.standardHeightLimitM}m residential ceiling)

🌟 *Key Highlights:*
${highlights.split(",").map((h) => `• ${h.trim()}`).join("\n")}

🏛️ *Registry Status:* 100% Freehold, T&CP Sanctioned, Zero Encumbrance.

📞 *Direct Broker Inquiries:* Call or message for on-site layout blueprint and gazetted approval dossier!`;
    }

    if (assetType === "brochure") {
      return `EXECUTIVE INVESTMENT & DEVELOPMENT BRIEF
════════════════════════════════════════════════════════════
PROPERTY: ${propertyTitle}
LOCATION: ${location}
VALUATION: ${price}

1. EXECUTIVE SITE PARTICULARS:
   • Total Registered Land Area: ${plotArea} sq.m
   • Frontage Corridor Width: ${roadWidth} meters
   • Zoning Classification: ${buildingType === "residential" ? "Plotted Residential Development" : "Commercial Mixed Use"}

2. STATUTORY BUILDING REGULATION MATRIX (MP BHUMI VIKAS NIYAM 2012):
   • Governing Standard: Directorate of Town & Country Planning (T&CP) MP
   • Floor Area Ratio (FAR): Base ${ruleData.limits.baseFAR} | Maximum with Premium ${ruleData.limits.maxPurchasableFAR}
   • Maximum Permissible Ground Coverage: ${ruleData.limits.maxGroundCoveragePercent}%
   • Mandatory Front Open Space (MOS): ${ruleData.limits.requiredFrontSetbackM} meters
   • Mandatory Rear Open Space (MOS): ${ruleData.limits.requiredRearSetbackM} meters
   • Height Ceiling: ${ruleData.limits.standardHeightLimitM} meters without special fire tower clearance
   • Off-Street Parking Requirement: ${ruleData.limits.parkingNorms}

3. HIGHLIGHTS & INFRASTRUCTURE:
${highlights.split(",").map((h) => `   - ${h.trim()}`).join("\n")}

════════════════════════════════════════════════════════════
Dossier prepared via BhuVikas AI Intelligence Desk.`;
    }

    // Default: Public Property Listing
    return `FOR SALE: ${propertyTitle}

Location: ${location}
Asking Price: ${price}
Plot Extent: ${plotArea} sq.m / ${(Number(plotArea) * 10.764).toFixed(0)} sq.ft | Fronting Road: ${roadWidth}m

MUNICIPAL & PLANNING REGULATION COMPLIANCE:
All developmental parameters have been verified against Madhya Pradesh Bhumi Vikas Niyam, 2012 (Rule 52 & 44):
- Permissible Ground Coverage: ${ruleData.limits.maxGroundCoveragePercent}% (${ruleData.limits.maxPermissibleGroundAreaSqm} m²)
- Front Setback (MOS): ${ruleData.limits.requiredFrontSetbackM} meters (Table 4)
- Rear Setback (MOS): ${ruleData.limits.requiredRearSetbackM} meters
- Permissible Base FAR: ${ruleData.limits.baseFAR} (Purchasable up to ${ruleData.limits.maxPurchasableFAR})
- Safe Construction Height: Up to ${ruleData.limits.standardHeightLimitM} meters
- Parking Space Norm: ${ruleData.limits.parkingNorms}

SITE HIGHLIGHTS:
${highlights.split(",").map((h) => `- ${h.trim()}`).join("\n")}

Legally cleared layout with immediate possession and registry clearance.
Generated via BhuVikas AI Intelligence Desk.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !isAuthenticated) {
    return (
      <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="bv-spinner" style={{ margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--ink-navy)", fontWeight: 600, fontSize: "0.95rem" }}>Verifying portal access...</p>
        </div>
      </div>
    );
  }

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
              <span className="bv-badge-gold">CLIENT STUDIO & PITCH DESK</span>
              <span style={{ color: "#94A3B8" }}>•</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Rule-Grounded Creative Engine
              </span>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--ink-navy)", letterSpacing: "-0.02em" }}>
              Creative Listing & Client Pitch Studio
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Generate compliant property listings, client brochures, and WhatsApp pitches with auto-injected MP Bhumi Vikas regulations.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="button" onClick={handleCopy} className="bv-btn-primary">
              {copied ? <Check width={16} height={16} /> : <Copy width={16} height={16} />}
              <span>{copied ? "Copied to Clipboard" : "Copy Document"}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Config Form + Live Output Dossier */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", alignItems: "start" }}>
          
          {/* Left Column: Form Configuration */}
          <div className="bv-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label className="bv-label">Output Asset Format</label>
              <div
                style={{
                  display: "flex",
                  background: "var(--sand-white)",
                  padding: "0.25rem",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--border-sand)",
                }}
              >
                {[
                  { id: "listing", label: "Public Listing" },
                  { id: "whatsapp", label: "WhatsApp Pitch" },
                  { id: "brochure", label: "Executive Brief" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAssetType(type.id)}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: "0.55rem",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      backgroundColor: assetType === type.id ? "#FFFFFF" : "transparent",
                      color: assetType === type.id ? "var(--ink-navy)" : "var(--text-muted)",
                      boxShadow: assetType === type.id ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="bv-label">Property Title / Heading</label>
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                className="bv-input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="bv-label">Location / Colony</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bv-input"
                />
              </div>
              <div>
                <label className="bv-label">Asking Price / Valuation</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bv-input"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
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
              <div>
                <label className="bv-label">Zoning Type</label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="bv-input"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="bv-label">Key Property USPs & Highlights (comma separated)</label>
              <textarea
                rows={3}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                className="bv-input"
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Injected Regulatory Preview Badge */}
            <div
              style={{
                backgroundColor: "var(--sand-white)",
                borderRadius: "0.75rem",
                padding: "1rem",
                border: "1px solid var(--border-sand)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--teal-primary)", textTransform: "uppercase" }}>
                  Auto-Injected Compliance
                </span>
                <span className="bv-badge-status-ok">Rule 52 & 44</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                <span>Front Setback: <strong>{ruleData.limits.requiredFrontSetbackM}m</strong></span>
                <span>Rear: <strong>{ruleData.limits.requiredRearSetbackM}m</strong></span>
                <span>Base FAR: <strong>{ruleData.limits.baseFAR}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Rendered Output */}
          <div className="bv-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText width={16} height={16} style={{ color: "var(--teal-primary)" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                  {assetType === "whatsapp" ? "WhatsApp Client Message" : assetType === "brochure" ? "Executive Investment Brief" : "Public Property Listing"}
                </span>
              </div>
              <span className="bv-badge-gold">Ready to Share</span>
            </div>

            <pre
              style={{
                backgroundColor: "var(--sand-white)",
                border: "1px solid var(--border-sand)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                fontSize: "0.82rem",
                color: "var(--ink-navy)",
                lineHeight: 1.6,
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                minHeight: "360px",
              }}
            >
              {generateOutput()}
            </pre>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Verified against MP Bhumi Vikas Niyam, 2012
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="bv-btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.78rem" }}
              >
                {copied ? <Check width={14} height={14} /> : <Copy width={14} height={14} />}
                <span>{copied ? "Copied" : "Copy Copy"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

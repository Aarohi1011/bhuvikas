"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LifeBuoy,
  Phone,
  Mail,
  MessageSquare,
  Check,
  Send,
  ShieldCheck,
  FileText,
  Building,
  Lock,
} from "@/components/icons";

export default function SupportPage() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Rule Interpretation");
  const [ticketMessage, setTicketMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject("");
      setTicketMessage("");
    }, 4000);
  };

  const faqs = [
    {
      q: "How are setback distances calculated for my plot?",
      a: "Setback values (Marginal Open Spaces - MOS) are determined deterministically according to Rule 52, Table No. 4 of MP Bhumi Vikas Niyam 2012 based on the plot area (e.g. 240 m²) and the width of the abutting front road (e.g. 12 m).",
    },
    {
      q: "Can I increase my Floor Area Ratio (FAR)?",
      a: "Yes. While Base FAR for residential development on a 12m road is 1.25 under Rule 44, additional purchasable FAR up to 1.75 can be sanctioned on payment of the municipal premium to the competent planning authority.",
    },
    {
      q: "Does BhuVikas AI replace formal municipal sanction?",
      a: "No. BhuVikas AI provides preliminary automated regulatory intelligence and evidence-grounded rule verification. Formal developmental permissions must be sanctioned by the designated Municipal Corporation or T&CP authority.",
    },
    {
      q: "How do I report a discrepancy in a gazetted rule?",
      a: "Use the ticket submission form below or message our advisory desk on WhatsApp with the specific Rule and Page number for immediate review.",
    },
  ];

  return (
    <div style={{ backgroundColor: "var(--sand-white)", minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Header Ribbon */}
        <div
          style={{
            paddingBottom: "1.5rem",
            borderBottom: "1px solid var(--border-sand)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span className="bv-badge-gold">HELP & ADVISORY DESK</span>
            <span style={{ color: "#94A3B8" }}>•</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Madhya Pradesh Real Estate Support
            </span>
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--ink-navy)", letterSpacing: "-0.02em" }}>
            Support & Statutory Advisory Center
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Need clarification on a building regulation, technical assistance, or direct municipal guidance? We're here to help.
          </p>
        </div>

        {/* 3 Quick Contact Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          
          {/* WhatsApp Direct Link */}
          <a
            href="https://wa.me/919826012345?text=Hello%20BhuVikas%20AI%20Desk%2C%20I%20have%20a%20question%20regarding%20MP%20Bhumi%20Vikas%20Niyam%20regulations."
            target="_blank"
            rel="noopener noreferrer"
            className="bv-card"
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.75rem",
                background: "#ECFDF5",
                color: "var(--status-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #A7F3D0",
              }}
            >
              <Phone width={20} height={20} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--ink-navy)" }}>WhatsApp Advisory Link</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Connect directly with our regulatory support desk on WhatsApp (+91 98260 12345).
            </p>
            <span style={{ marginTop: "auto", fontSize: "0.75rem", fontWeight: 700, color: "var(--status-success)" }}>
              Open Chat Desk →
            </span>
          </a>

          {/* Email Support */}
          <div className="bv-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
                border: "1px solid var(--teal-border)",
              }}
            >
              <Mail width={20} height={20} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--ink-navy)" }}>Email Advisory</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Direct email for formal rule interpretations and municipal case file reviews.
            </p>
            <span style={{ marginTop: "auto", fontSize: "0.75rem", fontWeight: 700, color: "var(--teal-primary)" }}>
              advisory@bhuvikas.mp.gov.in
            </span>
          </div>

          {/* Physical Office Consultation */}
          <div className="bv-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
              <Building width={20} height={20} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--ink-navy)" }}>Directorate Hub</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Bhopal Urban Center, T&CP Zone-10, MP Nagar, Bhopal, MP - 462011.
            </p>
            <span style={{ marginTop: "auto", fontSize: "0.75rem", fontWeight: 700, color: "var(--warm-gold)" }}>
              Mon–Sat: 10:00 AM – 6:00 PM IST
            </span>
          </div>

        </div>

        {/* 2-Column Split: Ticket Form + FAQs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", alignItems: "start" }}>
          
          {/* Left Column: Direct Support Ticket Form */}
          <div className="bv-card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--ink-navy)", marginBottom: "0.35rem" }}>
              Submit Advisory Ticket
            </h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Our senior town planning specialists respond within 24 hours with exact clause citations.
            </p>

            {submitted && (
              <div
                style={{
                  backgroundColor: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  color: "#047857",
                  padding: "0.85rem 1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Check width={16} height={16} />
                <span>Ticket registered successfully! Reference ID: #BV-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="bv-label">Inquiry Classification</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="bv-input"
                >
                  <option value="Rule Interpretation">Rule 52 & 44 Setback / FAR Interpretation</option>
                  <option value="Basement Approval">Rule 60 Basement Margin Clearances</option>
                  <option value="High-Rise Fire">Rule 78 High-Rise Fire Tender Clearances</option>
                  <option value="Municipal Corporation">Bhopal / Indore Municipal Corporation Norms</option>
                  <option value="General Technical">Platform Technical Support</option>
                </select>
              </div>

              <div>
                <label className="bv-label">Plot & Case Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Setback deficit issue for 240 m² plot in Indore Zone-3"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="bv-input"
                />
              </div>

              <div>
                <label className="bv-label">Detailed Case Query</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your plot area, road width, proposed construction, or specific gazetted clause query..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="bv-input"
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                className="bv-btn-primary"
                style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
              >
                <Send width={16} height={16} />
                <span>Submit Case Ticket</span>
              </button>
            </form>
          </div>

          {/* Right Column: FAQs Accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <span className="bv-badge-gold">COMMONLY ASKED QUESTIONS</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ink-navy)", marginTop: "0.3rem" }}>
                Regulatory FAQs & Guidance
              </h3>
            </div>

            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bv-card"
                style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}
              >
                <h4 style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--ink-navy)" }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

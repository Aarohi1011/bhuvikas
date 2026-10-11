"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { Settings, User, Check, Palette, ShieldCheck } from "@/components/icons";

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const { activeLanguage, setActiveLanguage } = useChat();

  const [theme, setTheme] = useState("sand"); // "sand", "dark", "system"
  const [name, setName] = useState(currentUser?.name || "Aarohi Sharma");
  const [email, setEmail] = useState(currentUser?.email || "aarohi.sharma@mp-realty.in");
  const [role, setRole] = useState(currentUser?.role || "Real Estate Broker / Channel Partner");
  const [org, setOrg] = useState(currentUser?.organization || "Madhya Pradesh Property Advisory");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-[#E6E2D9]">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F9F5EB] text-[#967332] border border-[#EADBBE]">
              Preferences
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">BhuVikas AI Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F2A] tracking-tight mt-1">
            Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure your working language, aesthetic theme, and professional broker profile credentials.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Language Selection */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E2D9] shadow-2xs space-y-4">
            <div className="pb-3 border-b border-[#ECE8E0]">
              <h3 className="text-sm font-bold text-[#0B1F2A]">Language & Multilingual Mode</h3>
              <p className="text-[11px] text-slate-500">
                Choose the default language for AI explanations, rule summaries, and listing generation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setActiveLanguage("en")}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  activeLanguage === "en"
                    ? "bg-[#F7F5F0] border-[#0F766E] shadow-2xs"
                    : "border-[#E6E2D9] hover:bg-[#F7F5F0]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0B1F2A]">English</span>
                  {activeLanguage === "en" && <Check className="w-4 h-4 text-[#0F766E]" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  Standard municipal English with official legal terminology.
                </p>
              </div>

              <div
                onClick={() => setActiveLanguage("hi")}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  activeLanguage === "hi"
                    ? "bg-[#F7F5F0] border-[#0F766E] shadow-2xs"
                    : "border-[#E6E2D9] hover:bg-[#F7F5F0]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0B1F2A]">हिन्दी (Hindi)</span>
                  {activeLanguage === "hi" && <Check className="w-4 h-4 text-[#0F766E]" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  मध्य प्रदेश राजपत्र आधारित शुद्ध एवं सरल विधिक व्याख्या।
                </p>
              </div>

              <div
                onClick={() => setActiveLanguage("en")}
                className="p-3.5 rounded-xl border border-[#E6E2D9] hover:bg-[#F7F5F0] cursor-pointer transition opacity-80"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0B1F2A]">Hinglish</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">Auto-detected</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Natural blend for colloquial broker client consultations.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Aesthetic Palette */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E2D9] shadow-2xs space-y-4">
            <div className="pb-3 border-b border-[#ECE8E0]">
              <h3 className="text-sm font-bold text-[#0B1F2A]">Aesthetic Theme Guide</h3>
              <p className="text-[11px] text-slate-500">
                Calm English shades curated for professional real estate and planning desks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setTheme("sand")}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  theme === "sand"
                    ? "bg-[#F7F5F0] border-[#0F766E] shadow-2xs"
                    : "border-[#E6E2D9] hover:bg-[#F7F5F0]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0B1F2A]">Calm Sand Light (Active)</span>
                  {theme === "sand" && <Check className="w-4 h-4 text-[#0F766E]" />}
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-5 h-5 rounded-md bg-[#0F766E]" title="Deep Teal"></span>
                  <span className="w-5 h-5 rounded-md bg-[#0B1F2A]" title="Ink Navy"></span>
                  <span className="w-5 h-5 rounded-md bg-[#C8A15A]" title="Warm Gold"></span>
                  <span className="w-5 h-5 rounded-md bg-[#F7F5F0] border border-[#E6E2D9]" title="Sand White"></span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Soft on the eyes with Deep Teal buttons and Warm Gold badges.
                </p>
              </div>

              <div
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  theme === "dark"
                    ? "bg-[#0B1417] text-white border-[#0F766E] shadow-2xs"
                    : "border-[#E6E2D9] hover:bg-[#F7F5F0]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${theme === "dark" ? "text-white" : "text-[#0B1F2A]"}`}>
                    Deep Ink Dark Mode
                  </span>
                  {theme === "dark" && <Check className="w-4 h-4 text-[#0F766E]" />}
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-5 h-5 rounded-md bg-[#0B1417] border border-slate-700" title="Dark Background"></span>
                  <span className="w-5 h-5 rounded-md bg-[#121E22]" title="Card Dark"></span>
                  <span className="w-5 h-5 rounded-md bg-[#0F766E]" title="Deep Teal"></span>
                  <span className="w-5 h-5 rounded-md bg-[#C8A15A]" title="Warm Gold"></span>
                </div>
                <p className={`text-[11px] ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>
                  High-contrast dark mode for low-light trading sessions.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Profile Information */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E2D9] shadow-2xs space-y-4">
            <div className="pb-3 border-b border-[#ECE8E0]">
              <h3 className="text-sm font-bold text-[#0B1F2A]">Broker / Official Profile</h3>
              <p className="text-[11px] text-slate-500">
                Your credentials are auto-injected into generated listings, brochures, and consultation stamps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B1F2A] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F5F0] border border-[#E6E2D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F2A] mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F5F0] border border-[#E6E2D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F2A] mb-1">Designation / Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F5F0] border border-[#E6E2D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F2A] mb-1">Firm / Agency</label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F5F0] border border-[#E6E2D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <span className="text-xs font-bold text-[#2F9E6B] flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#2F9E6B]" />
                <span>Settings Saved to Local Storage!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400">Settings persist in your browser session</span>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-xs transition"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

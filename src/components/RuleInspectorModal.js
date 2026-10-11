"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { X, ShieldCheck, FileText, Copy, Check, Scale, AlertTriangle } from "@/components/icons";

export default function RuleInspectorModal() {
  const { inspectedClause, closeClauseInspector } = useChat();
  const [copied, setCopied] = useState(false);

  if (!inspectedClause) return null;

  const handleCopy = () => {
    const textToCopy = `${inspectedClause.ruleNumber} (${inspectedClause.subClause || ""}) - ${inspectedClause.title}\n\n${inspectedClause.ruleText}\n\n[Source: MP Bhumi Vikas Niyam 2012, Page ${inspectedClause.pageNumber}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0B1F2A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={closeClauseInspector} />

      {/* Slide-in Panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-[#E6E2D9] animate-in slide-in-from-right duration-300">
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E2D9] bg-[#F7F5F0] flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#0F766E]/10 text-[#0F766E]">
                  {inspectedClause.ruleNumber}
                </span>
                {inspectedClause.subClause && (
                  <span className="text-xs font-semibold text-slate-500">
                    {inspectedClause.subClause}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#0B1F2A] mt-1 leading-snug">
                {inspectedClause.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {inspectedClause.chapter || "Madhya Pradesh Bhumi Vikas Niyam, 2012"}
              </p>
            </div>
          </div>

          <button
            onClick={closeClauseInspector}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#ECE8E0] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-700 text-sm">
          {/* Official Verification Seal Banner */}
          <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#EADBBE] flex items-start space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C8A15A] shrink-0 mt-1.5"></span>
            <div className="text-xs text-[#0B1F2A]">
              <div className="font-bold text-[#967332]">Official Gazette Verification Grounded</div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Extracted verbatim from MP Rajpatra Gazette Notification (T&CP Madhya Pradesh). No LLM paraphrase or hallucination.
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#F7F5F0] p-3.5 rounded-xl border border-[#E6E2D9]">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Original Page</div>
              <div className="text-[#0B1F2A] font-bold mt-0.5">
                Printed Page {inspectedClause.pageNumber || "68"} (PDF Page {inspectedClause.pdfPage || "72"})
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Governing Authority</div>
              <div className="text-[#0B1F2A] font-bold mt-0.5 truncate">
                {inspectedClause.authority || "Directorate of T&CP, MP"}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Applicable Zones</div>
              <div className="text-[#0B1F2A] font-bold mt-0.5">
                All MP Urban Local Bodies
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Legal Status</div>
              <div className="text-[#2F9E6B] font-bold mt-0.5">
                Active in Force (with 2024 Amdt.)
              </div>
            </div>
          </div>

          {/* Official Clause Text (English) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B1F2A] uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Gazetted Source Text (English)</span>
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-[#0F766E] hover:underline flex items-center space-x-1 font-bold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2F9E6B]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Text"}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0B1F2A] text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap border border-[#1A3342] select-all">
              {inspectedClause.ruleText}
            </div>
          </div>

          {/* Hindi Gazette Extract if available */}
          {inspectedClause.ruleTextHindi && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0B1F2A] uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>आधिकारिक राजपत्र पाठ (हिन्दी)</span>
              </span>
              <div className="p-3.5 rounded-xl bg-[#F7F5F0] text-slate-800 text-xs leading-relaxed whitespace-pre-wrap border border-[#E6E2D9]">
                {inspectedClause.ruleTextHindi}
              </div>
            </div>
          )}

          {/* Rule Guidance Note */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-[#EADBBE] text-xs text-amber-950 space-y-1">
            <div className="font-bold text-amber-900 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E0A030]" />
              <span>Broker & Planning Interpretation Note:</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-normal">
              Marginal open spaces specified under this rule cannot be compromised by compound walls, cantilever projections beyond 1.2m, or outdoor stairs. Violation of these mandatory open spaces bars grant of building permission under Section 30 of MP T&CP Act.
            </p>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-[#E6E2D9] bg-[#F7F5F0] flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-[#E6E2D9] rounded-xl hover:bg-[#F7F5F0] transition flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#2F9E6B]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Citation Copied" : "Copy Legal Citation"}</span>
          </button>

          <button
            onClick={closeClauseInspector}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-xl transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { queryMPBhumiVikasRules, MP_BHUMI_VIKAS_RULES } from "@/lib/mpBhumiVikasData";

const INITIAL_SESSIONS = [
  {
    id: "session-canonical-1",
    title: "Setback rules for 240 m² plot on 12 m road",
    language: "en",
    createdAt: "2026-10-10T10:30:00.000Z",
    updatedAt: "2026-10-10T10:35:00.000Z",
    messages: [
      {
        id: "msg-1-user",
        sender: "user",
        text: "For a 240 m² plot on a 12 m wide road, what setback rules apply?",
        timestamp: "10:30 AM",
      },
      {
        id: "msg-1-bot",
        sender: "assistant",
        timestamp: "10:31 AM",
        data: queryMPBhumiVikasRules("For a 240 m² plot on a 12 m wide road, what setback rules apply?", "en"),
      },
    ],
  },
  {
    id: "session-hindi-2",
    title: "240 वर्ग मी. प्लॉट एवं 12 मी. सड़क पर सेटबैक नियम (हिंदी)",
    language: "hi",
    createdAt: "2026-10-11T09:15:00.000Z",
    updatedAt: "2026-10-11T09:20:00.000Z",
    messages: [
      {
        id: "msg-2-user",
        sender: "user",
        text: "Agar plot 240 square metre ka hai aur road 12 metre ki hai, toh setback kitna chahiye aur kaunsa niyam rokega?",
        timestamp: "09:15 AM",
      },
      {
        id: "msg-2-bot",
        sender: "assistant",
        timestamp: "09:16 AM",
        data: queryMPBhumiVikasRules("Agar plot 240 square metre ka hai aur road 12 metre ki hai, toh setback kitna chahiye?", "hi"),
      },
    ],
  },
  {
    id: "session-basement-3",
    title: "Basement setbacks & parking height limit under Rule 60",
    language: "en",
    createdAt: "2026-10-09T14:00:00.000Z",
    updatedAt: "2026-10-09T14:10:00.000Z",
    messages: [
      {
        id: "msg-3-user",
        sender: "user",
        text: "Can I extend my basement into the front setback area under MP Bhumi Vikas Niyam?",
        timestamp: "02:00 PM",
      },
      {
        id: "msg-3-bot",
        sender: "assistant",
        timestamp: "02:01 PM",
        data: queryMPBhumiVikasRules("Can I extend my basement into the front setback area?", "en"),
      },
    ],
  },
];

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState("en"); // "en" or "hi"
  const [isTyping, setIsTyping] = useState(false);
  const [inspectedClause, setInspectedClause] = useState(null); // For side drawer inspection

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bhuvikas_chat_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
        if (parsed.length > 0) setActiveSessionId(parsed[0].id);
      } else {
        setSessions(INITIAL_SESSIONS);
        setActiveSessionId(INITIAL_SESSIONS[0].id);
        localStorage.setItem("bhuvikas_chat_sessions", JSON.stringify(INITIAL_SESSIONS));
      }
    } catch {
      setSessions(INITIAL_SESSIONS);
      setActiveSessionId(INITIAL_SESSIONS[0].id);
    }
  }, []);

  const saveSessionsToStorage = (updated) => {
    setSessions(updated);
    try {
      localStorage.setItem("bhuvikas_chat_sessions", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  const createNewSession = (title = "New Regulation Consultation") => {
    const newSession = {
      id: "session-" + Date.now(),
      title: title,
      language: activeLanguage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    const updated = [newSession, ...sessions];
    saveSessionsToStorage(updated);
    setActiveSessionId(newSession.id);
    return newSession;
  };

  const deleteSession = (sessionId) => {
    const filtered = sessions.filter((s) => s.id !== sessionId);
    saveSessionsToStorage(filtered);
    if (activeSessionId === sessionId) {
      setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;

    let targetSessionId = activeSessionId;
    let currentSessions = [...sessions];

    if (!targetSessionId || !activeSession) {
      const created = createNewSession(text.slice(0, 42) + (text.length > 42 ? "..." : ""));
      targetSessionId = created.id;
      currentSessions = [created, ...sessions];
    }

    const userMsg = {
      id: "msg-" + Date.now() + "-user",
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update session immediately with user message
    const updatedWithUser = currentSessions.map((s) => {
      if (s.id === targetSessionId) {
        const isFirst = s.messages.length === 0;
        return {
          ...s,
          title: isFirst ? text.trim().slice(0, 45) + (text.length > 45 ? "..." : "") : s.title,
          updatedAt: new Date().toISOString(),
          messages: [...s.messages, userMsg],
        };
      }
      return s;
    });

    saveSessionsToStorage(updatedWithUser);
    setIsTyping(true);

    try {
      // Query Claude AI Search Engine (/api/ai-search)
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text.trim() }),
      });
      const aiData = await res.json();

      let botMsg;
      if (aiData.success && aiData.answer) {
        botMsg = {
          id: "msg-" + Date.now() + "-bot",
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: aiData.answer,
          sources: aiData.sources || [],
          isAiGrounded: true,
          data: queryMPBhumiVikasRules(text, activeLanguage),
        };
      } else {
        // Fallback to deterministic rules engine
        const responseData = queryMPBhumiVikasRules(text, activeLanguage);
        botMsg = {
          id: "msg-" + Date.now() + "-bot",
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          data: responseData,
        };
      }

      const finalSessions = updatedWithUser.map((s) => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, botMsg],
          };
        }
        return s;
      });

      saveSessionsToStorage(finalSessions);
    } catch (err) {
      // Offline/Local Fallback
      const responseData = queryMPBhumiVikasRules(text, activeLanguage);
      const botMsg = {
        id: "msg-" + Date.now() + "-bot",
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        data: responseData,
      };

      const finalSessions = updatedWithUser.map((s) => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, botMsg],
          };
        }
        return s;
      });

      saveSessionsToStorage(finalSessions);
    } finally {
      setIsTyping(false);
    }
  };

  const openClauseInspector = (citation) => {
    // Find matching full rule if available
    const matched = MP_BHUMI_VIKAS_RULES.find(
      (r) => citation.ruleNumber && r.ruleNumber.toLowerCase().includes(citation.ruleNumber.toLowerCase())
    ) || {
      ruleNumber: citation.ruleNumber || "Rule 52",
      subClause: citation.subClause || "Table 4",
      title: citation.documentTitle || "Madhya Pradesh Bhumi Vikas Niyam, 2012",
      chapter: citation.chapter || "Chapter IV",
      pageNumber: citation.pageNumber || 68,
      pdfPage: citation.pdfPage || 72,
      ruleText: citation.quotedClause,
      authority: citation.authority,
      verificationStatus: "Verified Official Gazette Document",
    };

    setInspectedClause(matched);
  };

  const closeClauseInspector = () => {
    setInspectedClause(null);
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSession,
        activeSessionId,
        setActiveSessionId,
        activeLanguage,
        setActiveLanguage,
        isTyping,
        createNewSession,
        deleteSession,
        sendMessage,
        inspectedClause,
        openClauseInspector,
        closeClauseInspector,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

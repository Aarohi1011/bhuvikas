"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        backgroundColor: "var(--sand-white)",
        color: "var(--ink-navy)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div className="bv-spinner" style={{ margin: "0 auto 1rem" }} />
        <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Redirecting to Unified BhuVikas Dashboard...</p>
      </div>
    </div>
  );
}

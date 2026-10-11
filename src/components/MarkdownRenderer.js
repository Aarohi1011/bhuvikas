"use client";

import React from "react";

/**
 * Format inline markdown text:
 * **bold**, *italic*, `code`, and statutory rule badges
 */
function renderInlineText(text) {
  if (!text) return null;

  const tokens = [];
  let keyIndex = 0;

  // Regex to match **bold**, `code`, *italic*, and Rule citations
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*|Rule\s+\d+[A-Za-z]?(?:\(\d+\)(?:\([a-z]\))?)?|Gazette\s+p\.?\s*\d+(?:-\d+)?|Table\s+(?:No\.\s*)?\d+)/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }

    const matchedStr = match[0];

    if (matchedStr.startsWith("**") && matchedStr.endsWith("**")) {
      tokens.push(
        <strong key={`b-${keyIndex++}`} style={{ fontWeight: 800, color: "var(--ink-navy)" }}>
          {matchedStr.slice(2, -2)}
        </strong>
      );
    } else if (matchedStr.startsWith("`") && matchedStr.endsWith("`")) {
      tokens.push(
        <code
          key={`c-${keyIndex++}`}
          style={{
            backgroundColor: "rgba(15, 118, 110, 0.08)",
            color: "var(--teal-primary)",
            padding: "0.15rem 0.4rem",
            borderRadius: "0.35rem",
            fontSize: "0.85em",
            fontFamily: "monospace",
            fontWeight: 700,
            border: "1px solid rgba(15, 118, 110, 0.2)",
          }}
        >
          {matchedStr.slice(1, -1)}
        </code>
      );
    } else if (matchedStr.startsWith("*") && matchedStr.endsWith("*")) {
      tokens.push(
        <em key={`i-${keyIndex++}`} style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
          {matchedStr.slice(1, -1)}
        </em>
      );
    } else if (/Rule\s+\d+/i.test(matchedStr) || /Table\s+/i.test(matchedStr)) {
      tokens.push(
        <span
          key={`r-${keyIndex++}`}
          className="bv-badge-gold"
          style={{ margin: "0 0.15rem", verticalAlign: "middle" }}
        >
          {matchedStr}
        </span>
      );
    } else if (/Gazette\s+p/i.test(matchedStr)) {
      tokens.push(
        <span
          key={`g-${keyIndex++}`}
          className="bv-badge-teal"
          style={{ margin: "0 0.15rem", verticalAlign: "middle" }}
        >
          {matchedStr}
        </span>
      );
    } else {
      tokens.push(matchedStr);
    }

    lastIndex = match.index + matchedStr.length;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
  let currentList = [];
  let listType = null; // 'ul' or 'ol'
  let currentTable = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      if (listType === "ol") {
        elements.push(
          <ol
            key={`ol-${key}`}
            style={{
              paddingLeft: "1.5rem",
              margin: "0.5rem 0 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            {currentList.map((item, idx) => (
              <li key={idx} style={{ lineHeight: 1.6, color: "var(--ink-navy)" }}>
                {renderInlineText(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={`ul-${key}`}
            style={{
              paddingLeft: "1.5rem",
              margin: "0.5rem 0 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              listStyleType: "disc",
            }}
          >
            {currentList.map((item, idx) => (
              <li key={idx} style={{ lineHeight: 1.6, color: "var(--ink-navy)" }}>
                {renderInlineText(item)}
              </li>
            ))}
          </ul>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  const flushTable = (key) => {
    if (currentTable.length > 0) {
      // Parse table rows
      const parsedRows = currentTable.map((rowStr) => {
        const trimmed = rowStr.replace(/^\|/, "").replace(/\|$/, "");
        return trimmed.split("|").map((cell) => cell.trim());
      });

      let headerRow = null;
      let bodyRows = [];

      // Check if second row is divider (e.g. --- | ---)
      if (
        parsedRows.length >= 2 &&
        parsedRows[1].every((cell) => /^:?-+:?$/.test(cell.trim()) || cell.trim() === "")
      ) {
        headerRow = parsedRows[0];
        bodyRows = parsedRows.slice(2);
      } else {
        bodyRows = parsedRows;
      }

      elements.push(
        <div
          key={`tbl-wrap-${key}`}
          style={{
            overflowX: "auto",
            margin: "1rem 0",
            borderRadius: "0.75rem",
            border: "1px solid var(--border-sand)",
            boxShadow: "0 2px 8px rgba(11, 31, 42, 0.03)",
            backgroundColor: "#FFFFFF",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.82rem",
              textAlign: "left",
            }}
          >
            {headerRow && (
              <thead style={{ backgroundColor: "rgba(15, 118, 110, 0.06)", borderBottom: "2px solid var(--border-sand)" }}>
                <tr>
                  {headerRow.map((h, i) => (
                    <th
                      key={`th-${i}`}
                      style={{
                        padding: "0.65rem 0.9rem",
                        fontWeight: 700,
                        color: "var(--ink-navy)",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {renderInlineText(h)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, rIdx) => (
                <tr
                  key={`tr-${rIdx}`}
                  style={{
                    backgroundColor: rIdx % 2 === 0 ? "#FFFFFF" : "rgba(247, 245, 240, 0.4)",
                    borderBottom: rIdx === bodyRows.length - 1 ? "none" : "1px solid var(--border-sand)",
                  }}
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={`td-${cIdx}`}
                      style={{
                        padding: "0.6rem 0.9rem",
                        color: "var(--ink-navy)",
                        lineHeight: 1.5,
                      }}
                    >
                      {renderInlineText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      currentTable = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    // Check code blocks
    if (line.startsWith("```")) {
      flushList(index);
      flushTable(index);
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${index}`}
            style={{
              backgroundColor: "var(--ink-navy)",
              color: "#E2E8F0",
              padding: "1rem",
              borderRadius: "0.75rem",
              overflowX: "auto",
              fontSize: "0.82rem",
              fontFamily: "monospace",
              margin: "0.75rem 0",
              border: "1px solid #162E3D",
            }}
          >
            <code>{codeBlockLines.join("\n")}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      return;
    }

    // Markdown Table line (starts with | and has at least two |)
    if (line.startsWith("|") && (line.match(/\|/g) || []).length >= 2) {
      flushList(index);
      currentTable.push(line);
      return;
    } else {
      flushTable(index);
    }

    // Unordered List Items (- or * or •)
    if (/^[-*•]\s+/.test(line)) {
      if (listType && listType !== "ul") flushList(index);
      listType = "ul";
      currentList.push(line.replace(/^[-*•]\s+/, ""));
      return;
    }

    // Ordered List Items (1. , 2. )
    if (/^\d+\.\s+/.test(line)) {
      if (listType && listType !== "ol") flushList(index);
      listType = "ol";
      currentList.push(line.replace(/^\d+\.\s+/, ""));
      return;
    }

    // If it's not a list item, flush any ongoing list
    flushList(index);

    // Empty lines
    if (!line) {
      elements.push(<div key={`sp-${index}`} style={{ height: "0.4rem" }} />);
      return;
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(
        <h4
          key={`h4-${index}`}
          style={{
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "var(--ink-navy)",
            margin: "0.85rem 0 0.35rem",
            letterSpacing: "-0.01em",
          }}
        >
          {renderInlineText(line.replace(/^###\s+/, ""))}
        </h4>
      );
      return;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h3
          key={`h3-${index}`}
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            color: "var(--ink-navy)",
            margin: "1rem 0 0.45rem",
            letterSpacing: "-0.02em",
            borderBottom: "1px solid var(--border-sand)",
            paddingBottom: "0.3rem",
          }}
        >
          {renderInlineText(line.replace(/^##\s+/, ""))}
        </h3>
      );
      return;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h2
          key={`h2-${index}`}
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--ink-navy)",
            margin: "1.25rem 0 0.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          {renderInlineText(line.replace(/^#\s+/, ""))}
        </h2>
      );
      return;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`bq-${index}`}
          style={{
            borderLeft: "3px solid var(--teal-primary)",
            paddingLeft: "0.9rem",
            margin: "0.6rem 0",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            backgroundColor: "var(--sand-white)",
            padding: "0.5rem 0.85rem",
            borderRadius: "0 0.5rem 0.5rem 0",
          }}
        >
          {renderInlineText(line.replace(/^>\s+/, ""))}
        </blockquote>
      );
      return;
    }

    // Horizontal rule
    if (line === "---" || line === "===" || line === "════════════════════════════════════════════════════════════") {
      elements.push(
        <hr
          key={`hr-${index}`}
          style={{
            border: "none",
            borderTop: "1px solid var(--border-sand)",
            margin: "0.85rem 0",
          }}
        />
      );
      return;
    }

    // Regular Paragraph
    elements.push(
      <p
        key={`p-${index}`}
        style={{
          margin: "0.3rem 0",
          lineHeight: 1.6,
          color: "var(--ink-navy)",
          fontSize: "0.86rem",
        }}
      >
        {renderInlineText(line)}
      </p>
    );
  });

  // Flush any final list or table
  flushList(lines.length);
  flushTable(lines.length);

  return <div className={`bv-markdown-content ${className}`}>{elements}</div>;
}

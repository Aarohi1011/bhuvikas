# Madhya Pradesh Bhumi Vikas Rules Search Engine
## Frontend Developer Integration Guide

Welcome! This guide explains everything you need to connect your frontend UI to the **Bhuvikas Rules & Regulations Search Engine Backend**.

---

## 1. Quick Overview

The search engine indexes the complete **Madhya Pradesh Bhumi Vikas Rules, 2012** (updated up to March 2025). The database contains:
- **108 Rules:** Sequentially organized across all 5 Parts (including Rules `12A`, `26A`, and `42A`).
- **86 Building & Architectural Definitions:** (FAR, Basement, Podium, Chhajja, Balcony, etc.) extracted from Rule 2 for instant dictionary-style lookup.
- **17 Judicial Precedents / Case Laws:** High Court and Supreme Court case holdings (*Satish Nayak*, *CREDAI*, *Kurban Hussain*, etc.).
- **9 Statutory Schedule Tables:** (Tables 1 through 8, including setbacks, road widths, and FAR matrices).
- **Official Gazette Page Numbers:** (e.g., `p. 22-25`) for legal citations.

---

## 2. Integration Options: API vs. Direct Import

Because this is a Next.js project, you have **two ways** to query the search engine:

| Method | When to Use | How to Call |
| :--- | :--- | :--- |
| **Option A: HTTP API Routes** *(Recommended)* | Clean separation of concerns, works with `fetch()`, SWR, or React Query. | `fetch('/api/search?q=FAR')` |
| **Option B: Direct In-Memory Import** | For **0ms latency** client-side or server components without network hops. | `import { searchRules } from '@/lib/searchEngine'` |

---

## 3. API Reference

All endpoints run on `http://localhost:3000` (or your deployed origin).

### 3.0. Claude AI Natural Language / Raw Search
`POST /api/ai-search`

Takes raw, unformatted questions (e.g. *"Can I open a commercial shop in the basement?"*) in English or Hindi, retrieves the relevant Bhumi Vikas rules, and uses Claude AI to generate a grounded legal answer with exact Rule numbers and Gazette page citations.

#### Request Body:
```json
{
  "query": "Can I open a commercial shop in the basement?"
}
```

#### Example Response:
```json
{
  "success": true,
  "query": "Can I open a commercial shop in the basement?",
  "answer": "Yes, but only under strict conditions. Under Rule 76(3)(e) (Gazette p. 90-91), commercial activity is permitted only on the first basement level and requires: (1) commercial land use, (2) minimum plot area of 1.0 hectare, and (3) detached building...",
  "sources": [
    {
      "id": "rule-76",
      "number": "76",
      "badge": "Rule 76",
      "title": "Basement",
      "page": "p. 90-91",
      "snippet": "Basement shall not be used for habitable purpose except..."
    }
  ]
}
```

---

### 3.1. Full-Text Search
`GET /api/search`

Performs ranked search across rules, definitions, tables, and case laws.

#### Query Parameters:
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `q` | `string` | `""` | The search term (e.g. `"FAR"`, `"14"`, `"parking"`, `"basement"`). If empty, returns top rules. |
| `type` | `string` | `"all"` | Filter by entity type: `"all"`, `"rule"`, `"definition"`, `"table"`, `"case_law"`. |
| `part` | `string` | `"all"` | Filter by statutory part: `"all"`, `"PART-I"`, `"PART-II"`, `"PART-III"`, `"PART-IV"`, `"PART-V"`. |
| `limit` | `number` | `20` | Max results to return. |
| `offset` | `number` | `0` | Offset for pagination. |

#### Example Request:
```bash
GET /api/search?q=commercial+parking&type=all&limit=5
```

#### Example Response:
```json
{
  "success": true,
  "timestamp": "2026-10-11T09:20:00.000Z",
  "query": "commercial parking",
  "total": 42,
  "limit": 5,
  "offset": 0,
  "facets": {
    "types": {
      "definition": 12,
      "rule": 26,
      "case_law": 4
    },
    "parts": {
      "PART-I": 12,
      "PART-IV": 6,
      "PART-V": 20
    }
  },
  "suggestions": [
    "FAR",
    "High Rise Building",
    "Rule 12A Deemed Approval"
  ],
  "results": [
    {
      "id": "def-49",
      "type": "definition",
      "number": "49",
      "badge": "Def 2(49)",
      "title": "parking floor",
      "part": "PART-I",
      "partTitle": "GENERAL",
      "page": "p. 2-14",
      "snippet": "(49) \"parking floor\" means a floor designed for the use as a parking space:...",
      "score": 218,
      "keywords": ["parking", "floor", "space"]
    },
    {
      "id": "rule-84",
      "type": "rule",
      "number": "84",
      "badge": "Rule 84",
      "title": "Parking Space",
      "part": "PART-V",
      "partTitle": "GENERAL BUILDING REQUIREMENTS",
      "page": "p. 97",
      "snippet": "**84. Parking Space.-** (1) The norms for providing parking on the plot and in areas other than...",
      "score": 188,
      "keywords": ["parking", "space", "commercial", "multi-level"],
      "hasTables": true,
      "hasComments": false
    }
  ]
}
```

---

### 3.2. Single Rule Details
`GET /api/rules/[id]`

Fetches the complete statutory text for a given rule, along with attached provisos, sub-rules, related definitions, and court precedents.

* Supports rule number (`14`, `12A`, `76`) or ID (`rule-14`, `rule-76`).

#### Example Request:
```bash
GET /api/rules/14
```

#### Example Response:
```json
{
  "success": true,
  "rule": {
    "id": "rule-14",
    "ruleNumber": "14",
    "title": "Application for development or building permission",
    "partNumber": "PART-III",
    "partTitle": "PERMISSION AND INSPECTION",
    "page_start": 22,
    "page_end": 25,
    "content": "**14. Application for development or building permission...**",
    "summary": "Every person who intends to develop, erect, re-erect or make alterations...",
    "subrules": [
      { "number": "(1)", "snippet": "Every person who intends to develop, erect..." },
      { "number": "(2)", "snippet": "In case of building permission, the application..." }
    ],
    "provisos": [
      "Provided that if the online system has been adopted...",
      "Provided further that authorised Architect/Structural Engineer..."
    ],
    "amendments": [
      "Subs. by Notification No. 3-26-2015-XVIII-5, dated 27th November 2015."
    ],
    "attachedCaseLaws": [],
    "attachedTables": []
  }
}
```

---

### 3.3. Definitions Dictionary
`GET /api/definitions?q=term`

Searches or lists the 86 defined building terms (Rule 2).

#### Example Request:
```bash
GET /api/definitions?q=basement
```

#### Example Response:
```json
{
  "success": true,
  "total": 2,
  "definitions": [
    {
      "id": "def-7",
      "subNumber": "7",
      "term": "basement",
      "definition": "(7) \"basement\" means that part of the building which has been constructed below the plinth level...",
      "exclusions": [],
      "ruleNumber": "2"
    }
  ]
}
```

---

### 3.4. Regulatory Schedule Tables
`GET /api/tables`

Returns all 9 master tables (Table 1 through 8).

---

### 3.5. System Statistics & Gazette Info
`GET /api/stats`

Returns metadata for your header or footer:
```json
{
  "success": true,
  "metadata": {
    "title": "Madhya Pradesh Bhumi Vikas Rules, 2012",
    "updatedUntil": "6th March 2025",
    "parentAct": "M.P. Nagar Tatha Gram Nivesh Adhiniyam, 1973 (No. 23 of 1973)",
    "totalRules": 108,
    "totalDefinitions": 86,
    "totalCaseLaws": 17,
    "totalReferenceTables": 9
  }
}
```

---

## 4. Ready-to-Use React Hook (`useRuleSearch.js`)

Copy this custom hook into `src/hooks/useRuleSearch.js` to easily manage debounced search, active filters, and loading states:

```javascript
'use client';
import { useState, useEffect } from 'react';

export function useRuleSearch() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [part, setPart] = useState('all');
  const [results, setResults] = useState([]);
  const [facets, setFacets] = useState({ types: {}, parts: {} });
  const [suggestions, setSuggestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          q: query,
          type,
          part,
          limit: '25'
        });
        const res = await fetch(`/api/search?${params}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results || []);
          setFacets(data.facets || { types: {}, parts: {} });
          setSuggestions(data.suggestions || []);
          setTotal(data.total || 0);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 200); // 200ms debounce

    return () => clearTimeout(timer);
  }, [query, type, part]);

  return {
    query,
    setQuery,
    type,
    setType,
    part,
    setPart,
    results,
    facets,
    suggestions,
    total,
    isLoading,
    error
  };
}
```

---

## 5. Recommended UI Components

### 1. Hero Search Bar
- **Input:** Autofocus search input with a clear button (`✕`) and keyboard shortcut (`/` to focus, `Esc` to clear).
- **Suggestion Pills:** Clickable chips below the input (`"FAR"`, `"Basement"`, `"Rule 14"`, `"Rule 12A"`, `"Parking"`). Clicking a pill sets `query`.

### 2. Entity Type Filter Tabs
Render tabs based on the `facets.types` count:
- **All** (`total`)
- **Rules** (`facets.types.rule || 0`)
- **Definitions** (`facets.types.definition || 0`)
- **Tables** (`facets.types.table || 0`)
- **Case Precedents** (`facets.types.case_law || 0`)

### 3. Result Card Layout
Each item in `results` should display:
- **Badge:** `item.badge` (e.g. `Rule 14` or `Def 2(30)` or `Case Precedent`).
- **Gazette Page:** If `item.page` exists, display a subtle badge (e.g., `Official Gazette p. 22-25`).
- **Part Title:** `item.part` / `item.partTitle`.
- **Title:** `item.title`.
- **Snippet:** `item.snippet` (renders clean excerpt with matches).
- **Actions:**
  - *"Read Full Rule"* button (opens a modal or slides in a right-hand drawer).
  - *"Copy Citation"* button (copies e.g., `"M.P. Bhumi Vikas Rules, 2012 - Rule 14"` to clipboard).

### 4. Rule Detail Drawer / Modal
When a user clicks a result card, call `GET /api/rules/[id]`:
- Display the full statutory text.
- Render collapsible accordions for **Subrules** and **Provisos**.
- If attached case laws exist (`rule.attachedCaseLaws`), display them in an alert box.
- If attached tables exist (`rule.attachedTables`), render the HTML table with horizontal scroll.

---

## 6. Testing Your Integration

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Test searching for:
   - Acronyms: `FAR` (Should display *Floor Area Ratio* #1)
   - Numbers: `14` or `12A` (Should jump straight to Rule 14 or Rule 12A)
   - Topics: `commercial parking`, `basement`, `staircase width`
   - Case laws: `Satish Nayak`, `CREDAI`

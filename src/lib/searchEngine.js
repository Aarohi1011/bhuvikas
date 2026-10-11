import database from '../data/bhuvikas-rules.json' with { type: 'json' };
import searchIndex from '../data/search-index.json' with { type: 'json' };

// Normalize text for search comparison
function normalize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s\.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Tokenize query into clean search terms
function tokenize(str) {
  const norm = normalize(str);
  if (!norm) return [];
  return norm.split(' ').filter(t => t.length > 0);
}

// Fuzzy distance (Levenshtein) for short tokens
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Extract highlight snippet around matched tokens
function createSnippetWithHighlights(text, queryTokens, maxLength = 220) {
  if (!text) return '';
  const clean = text.replace(/<[^>]+>/g, '').replace(/[\r\n]+/g, ' ');
  const lowerText = clean.toLowerCase();

  // Find earliest token match position
  let bestIndex = -1;
  for (const token of queryTokens) {
    const idx = lowerText.indexOf(token);
    if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
      bestIndex = idx;
    }
  }

  let start = 0;
  let end = maxLength;
  if (bestIndex > 50) {
    start = Math.max(0, bestIndex - 40);
    end = Math.min(clean.length, start + maxLength);
  } else {
    end = Math.min(clean.length, maxLength);
  }

  let snippet = clean.substring(start, end).trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < clean.length) snippet = snippet + '...';

  return snippet;
}

/**
 * Main Search Function
 * @param {string} query - user input query
 * @param {object} options - { type, part, limit, offset }
 */
export function searchRules(query = '', options = {}) {
  const {
    type = 'all',
    part = 'all',
    limit = 20,
    offset = 0
  } = options;

  const trimmedQuery = query.trim();
  const queryTokens = tokenize(trimmedQuery);

  // If query is empty, return paginated list of top rules
  if (queryTokens.length === 0) {
    let results = database.rules.map(r => ({
      id: r.id,
      type: 'rule',
      number: r.ruleNumber,
      badge: `Rule ${r.ruleNumber}`,
      title: r.title,
      part: r.partNumber,
      partTitle: r.partTitle,
      page: r.page_start ? `p. ${r.page_start}${r.page_end !== r.page_start ? `-${r.page_end}` : ''}` : null,
      snippet: r.summary,
      score: 1,
      keywords: r.keywords
    }));

    if (type !== 'all') {
      results = results.filter(r => r.type === type);
    }
    if (part !== 'all') {
      results = results.filter(r => r.part === part || r.partId === part);
    }

    return {
      query: '',
      total: results.length,
      limit,
      offset,
      results: results.slice(offset, offset + limit),
      facets: calculateFacets(results),
      suggestions: ['FAR', 'High Rise', 'Rule 14', 'Rule 12A', 'Parking', 'Set Back']
    };
  }

  // Check if query is looking for an exact Rule number (e.g. "14", "rule 14", "12a")
  const ruleNumMatch = trimmedQuery.match(/^(?:rule\s*)?(\d{1,3}\s*[a-z]?)$/i);
  const targetRuleNum = ruleNumMatch ? ruleNumMatch[1].replace(/\s+/g, '').toUpperCase() : null;

  const scoredResults = [];

  // 1. Search in master rules
  for (const rule of database.rules) {
    if (type !== 'all' && type !== 'rule') continue;
    if (part !== 'all' && rule.partNumber !== part && rule.partId !== part) continue;

    let score = 0;
    const normTitle = normalize(rule.title);
    const normNum = rule.ruleNumber.toUpperCase();
    const normContent = normalize(rule.content);

    // Exact rule number match gets massive boost
    if (targetRuleNum && normNum === targetRuleNum) {
      score += 500;
    } else if (targetRuleNum && normNum.startsWith(targetRuleNum)) {
      score += 150;
    }

    // Token scoring
    for (const token of queryTokens) {
      // Title match
      if (normTitle.includes(token)) {
        score += 80;
        if (normTitle.startsWith(token)) score += 40;
      }

      // Keyword match
      if (rule.keywords && rule.keywords.some(k => k.toLowerCase().includes(token))) {
        score += 40;
      }

      // Content match
      const contentMatches = (normContent.match(new RegExp(token, 'g')) || []).length;
      if (contentMatches > 0) {
        score += Math.min(30, contentMatches * 4);
      }

      // Provisos / amendments match
      if (rule.provisos && rule.provisos.some(p => p.toLowerCase().includes(token))) {
        score += 25;
      }

      // Fuzzy check if token is > 4 chars and no match yet
      if (score === 0 && token.length > 4) {
        for (const kw of rule.keywords || []) {
          if (levenshtein(token, kw.toLowerCase()) <= 1) {
            score += 20;
            break;
          }
        }
      }
    }

    if (score > 0) {
      scoredResults.push({
        id: rule.id,
        type: 'rule',
        number: rule.ruleNumber,
        badge: `Rule ${rule.ruleNumber}`,
        title: rule.title,
        part: rule.partNumber,
        partTitle: rule.partTitle,
        page: rule.page_start ? `p. ${rule.page_start}${rule.page_end !== rule.page_start ? `-${rule.page_end}` : ''}` : null,
        snippet: createSnippetWithHighlights(rule.content, queryTokens),
        score,
        keywords: rule.keywords,
        hasTables: rule.hasTables,
        hasComments: rule.hasComments
      });
    }
  }

  // 2. Search in definitions (from Rule 2)
  if (type === 'all' || type === 'definition') {
    for (const def of database.definitions) {
      if (part !== 'all' && part !== 'PART-I' && part !== 'part-1') continue;

      let score = 0;
      const normTerm = normalize(def.term);
      const normDef = normalize(def.definition);

      // Exact term or acronym match (e.g. "FAR", "balcony", "basement")
      const acronymMatch = def.term.match(/\(([A-Z0-9]+)\)/i);
      const isAcronym = acronymMatch && acronymMatch[1].toLowerCase() === trimmedQuery.toLowerCase();
      const hasExactWord = new RegExp(`\\b${trimmedQuery.toLowerCase()}\\b`, 'i').test(normTerm);

      if (isAcronym) {
        score += 600;
      } else if (normTerm === trimmedQuery.toLowerCase()) {
        score += 500;
      } else if (hasExactWord) {
        score += 350;
      } else if (normTerm.startsWith(trimmedQuery.toLowerCase())) {
        score += 120;
      }

      for (const token of queryTokens) {
        if (new RegExp(`\\b${token}\\b`, 'i').test(normTerm)) {
          score += 150;
        } else if (normTerm.includes(token)) {
          score += 60;
        }
        if (def.keywords && def.keywords.some(k => k.toLowerCase() === token)) score += 60;
        const matches = (normDef.match(new RegExp(token, 'g')) || []).length;
        if (matches > 0) score += Math.min(30, matches * 4);
      }

      if (score > 0) {
        scoredResults.push({
          id: def.id,
          type: 'definition',
          number: def.subNumber,
          badge: `Def 2(${def.subNumber})`,
          title: def.term,
          part: 'PART-I',
          partTitle: 'GENERAL',
          page: 'p. 2-14',
          snippet: createSnippetWithHighlights(def.definition, queryTokens),
          score,
          keywords: def.keywords,
          exclusions: def.exclusions
        });
      }
    }
  }

  // 3. Search in Reference Tables
  if (type === 'all' || type === 'table') {
    for (const tbl of database.tables) {
      let score = 0;
      const normTitle = normalize(tbl.title);
      const normNum = tbl.tableNumber.toLowerCase();

      if (trimmedQuery.toLowerCase().includes(normNum)) score += 250;
      for (const token of queryTokens) {
        if (normTitle.includes(token)) score += 80;
        if (normNum.includes(token)) score += 70;
        if (tbl.keywords && tbl.keywords.some(k => k.toLowerCase().includes(token))) score += 30;
      }

      if (score > 0) {
        scoredResults.push({
          id: tbl.id,
          type: 'table',
          number: tbl.tableNumber,
          badge: tbl.tableNumber,
          title: tbl.title,
          part: 'Schedule Table',
          partTitle: `Under Rule ${tbl.associatedRule}`,
          page: null,
          snippet: `Statutory table under Rule ${tbl.associatedRule} regulating ${tbl.title}.`,
          score,
          keywords: tbl.keywords
        });
      }
    }
  }

  // 4. Search in Case Laws
  if (type === 'all' || type === 'case_law') {
    for (const c of database.caseLaws) {
      let score = 0;
      const normName = normalize(c.caseName);
      const normBody = normalize(c.fullText);

      for (const token of queryTokens) {
        if (normName.includes(token)) score += 90;
        if (c.citation && c.citation.toLowerCase().includes(token)) score += 70;
        if (normBody.includes(token)) score += 35;
      }

      if (score > 0) {
        scoredResults.push({
          id: c.id,
          type: 'case_law',
          number: c.associatedRule,
          badge: `Case Precedent (Rule ${c.associatedRule})`,
          title: c.caseName,
          part: 'Judicial Precedent',
          partTitle: `Case Law on Rule ${c.associatedRule}`,
          citation: c.citation,
          snippet: createSnippetWithHighlights(c.fullText, queryTokens),
          score,
          keywords: c.keywords
        });
      }
    }
  }

  // Sort by relevance score descending
  scoredResults.sort((a, b) => b.score - a.score);

  const paginated = scoredResults.slice(offset, offset + limit);

  return {
    query: trimmedQuery,
    total: scoredResults.length,
    limit,
    offset,
    results: paginated,
    facets: calculateFacets(scoredResults),
    suggestions: generateSuggestions(trimmedQuery)
  };
}

// Calculate facet counts for filtering
function calculateFacets(items) {
  const parts = {};
  const types = {};

  for (const item of items) {
    if (item.part) parts[item.part] = (parts[item.part] || 0) + 1;
    if (item.type) types[item.type] = (types[item.type] || 0) + 1;
  }

  return { parts, types };
}

// Generate query suggestions
function generateSuggestions(query) {
  const popularTerms = [
    'FAR', 'Floor Area Ratio', 'High Rise Building', 'Basement',
    'Rule 12A Deemed Approval', 'Rule 14 Building Permission',
    'Rule 42 Height & Setbacks', 'Rule 60 Group Housing',
    'Rule 84 Parking Space', 'Podium', 'Balcony', 'Chhajja',
    'Table 3 Road Width', 'Table 8 FAR', 'Service Floor'
  ];

  const qLower = query.toLowerCase();
  return popularTerms.filter(t => !t.toLowerCase().includes(qLower)).slice(0, 5);
}

// Get full details of a specific rule
export function getRuleById(idOrNumber) {
  const normalized = String(idOrNumber).toLowerCase().replace(/^rule-/, '');
  const rule = database.rules.find(r => 
    r.ruleNumber.toLowerCase() === normalized || 
    r.id.toLowerCase() === `rule-${normalized}`
  );

  if (!rule) return null;

  // Find associated case laws
  const caseLaws = database.caseLaws.filter(c => 
    c.associatedRule.toLowerCase() === rule.ruleNumber.toLowerCase()
  );

  // Find associated tables
  const tables = database.tables.filter(t => 
    t.associatedRule.toLowerCase() === rule.ruleNumber.toLowerCase()
  );

  // If Rule 2, attach all definitions
  const definitions = rule.ruleNumber === '2' ? database.definitions : [];

  return {
    ...rule,
    attachedCaseLaws: caseLaws,
    attachedTables: tables,
    definitions
  };
}

// Get all rules list
export function getAllRules() {
  return database.rules.map(r => ({
    id: r.id,
    ruleNumber: r.ruleNumber,
    title: r.title,
    partNumber: r.partNumber,
    partTitle: r.partTitle,
    page_start: r.page_start,
    page_end: r.page_end,
    summary: r.summary,
    keywords: r.keywords
  }));
}

// Get all definitions list
export function getAllDefinitions() {
  return database.definitions;
}

// Get all tables list
export function getAllTables() {
  return database.tables;
}

// Get all case laws list
export function getAllCaseLaws() {
  return database.caseLaws;
}

// Get database metadata
export function getDatabaseMetadata() {
  return database.metadata;
}

import fs from 'fs';
import path from 'path';

const inputMdPath = path.resolve('claude event pdf1.md');
const inputJsonlPath = path.resolve('bhumi_vikas_rules.jsonl');

const rawText = fs.readFileSync(inputMdPath, 'utf8');
const lines = rawText.split(/\r?\n/);

// Read page mappings from bhumi_vikas_rules.jsonl if available
const pageMap = {};
if (fs.existsSync(inputJsonlPath)) {
  const jsonlLines = fs.readFileSync(inputJsonlPath, 'utf8').split(/\r?\n/);
  for (const l of jsonlLines) {
    if (!l.trim()) continue;
    try {
      const obj = JSON.parse(l);
      if (obj.rule) {
        pageMap[obj.rule] = {
          page_start: obj.page_start,
          page_end: obj.page_end
        };
      }
    } catch (e) {}
  }
  console.log(`Loaded page numbers for ${Object.keys(pageMap).length} rules from bhumi_vikas_rules.jsonl`);
}

// Clean page header/footer artifacts
const isPageArtifact = (str) => {
  const t = str.trim();
  return /^Rule\s+[\d\-A-Za-z]+\s+M\.?P\.?\s+Bhumi\s*vikas\s+Rules\s+\d+$/i.test(t) ||
         /^Rule\s+[\d\-A-Za-z]+\s+M\.?P\.\s+Bhum\s*i\s*Vikas\s+Rules\s+\d+$/i.test(t);
};

// Parts definition
const PARTS = [
  { id: 'part-1', number: 'PART-I', title: 'GENERAL', range: 'Rules 1 - 5' },
  { id: 'part-2', number: 'PART-II', title: 'ORGANISATION AND ENFORCEMENT', range: 'Rules 6 - 11' },
  { id: 'part-3', number: 'PART-III', title: 'PERMISSION AND INSPECTION', range: 'Rules 12 - 35' },
  { id: 'part-4', number: 'PART-IV', title: 'DEVELOPMENT CONTROL', range: 'Rules 36 - 53' },
  { id: 'part-5', number: 'PART-V', title: 'GENERAL BUILDING REQUIREMENTS', range: 'Rules 54 - 105' }
];

// Stopwords for keyword extraction
const STOPWORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'shall', 'any', 'such',
  'which', 'been', 'have', 'has', 'under', 'these', 'rules', 'rule', 'other',
  'than', 'more', 'less', 'area', 'not', 'are', 'per', 'also', 'part', 'will',
  'into', 'upon', 'where', 'when', 'made', 'each', 'case', 'there', 'their'
]);

function extractKeywords(...texts) {
  const combined = texts.join(' ').toLowerCase();
  const words = combined.match(/[a-z0-9\-\_]{3,}/g) || [];
  const freq = {};
  for (const w of words) {
    if (!STOPWORDS.has(w) && !/^\d+$/.test(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(e => e[0]);
}

// Expected sequential rule keys
const RULE_KEYS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '12A', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '26A', '27', '28', '29', '30',
  '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
  '41', '42', '42A', '43', '44', '45', '46', '47', '48', '49', '50',
  '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
  '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
  '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
  '81', '82', '83', '84', '85', '86', '87', '88', '89', '90',
  '91', '92', '93', '94', '95', '96', '97', '98', '99', '100',
  '101', '102', '103', '104', '105'
];

// Step 1: Find start line for each rule
const ruleStarts = [];
let nextRuleIdx = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (isPageArtifact(line)) continue;
  if (/See Rule/i.test(line)) continue;

  if (nextRuleIdx < RULE_KEYS.length) {
    const targetKey = RULE_KEYS[nextRuleIdx];
    let isMatch = false;

    if (targetKey === '12A') {
      isMatch = /^\*\*12\s*A\.\*\*/i.test(line);
    } else if (targetKey === '26A') {
      isMatch = /(?:<sup>.*?<\/sup>\[?)?\*\*26\.?\s*A\.?\*\*/i.test(line);
    } else if (targetKey === '42A') {
      isMatch = /(?:<sup>.*?<\/sup>\[?)?\*\*42\s*A\.\s*Norms/i.test(line);
    } else if (targetKey === '37') {
      isMatch = /^\*\*37\.\s*\(1\)\s*Use premises/i.test(line);
    } else {
      const regex = new RegExp(`^(?:#{1,4}\\s*)?(?:<sup>.*?<\\/sup>\\[?)?(?:\\*\\*)?${targetKey}\\s*\\.\\s*(?:\\(?\\d+\\)?)?\\s*(?:\\*\\*)?([A-Za-z])`);
      isMatch = regex.test(line);
    }

    if (isMatch) {
      ruleStarts.push({
        ruleKey: targetKey,
        lineIdx: i,
        rawHeader: line
      });
      nextRuleIdx++;
    }
  }
}

console.log(`Found starts for ${ruleStarts.length} / ${RULE_KEYS.length} rules.`);

const getPartForRule = (ruleKey) => {
  const num = parseInt(ruleKey, 10);
  if (num <= 5) return PARTS[0];
  if (num <= 11) return PARTS[1];
  if (num <= 35) return PARTS[2];
  if (num <= 53) return PARTS[3];
  return PARTS[4];
};

const extractTitle = (headerLine, ruleKey) => {
  let title = headerLine;
  title = title.replace(/^#{1,4}\s*/, '');
  title = title.replace(/<sup>.*?<\/sup>/g, '');
  title = title.replace(/^\[|\]$/g, '');
  const prefixRegex = new RegExp(`^\\*\\*?${ruleKey.replace('A', '\\s*A\\.?')}\\s*\\.?\\s*(?:\\(\\d+\\))?\\s*\\*\\*?\\s*`, 'i');
  title = title.replace(prefixRegex, '');
  title = title.replace(/\*\*/g, '');
  title = title.replace(/^[-–—:\.\s]+/, '').replace(/[-–—:\.\s]+$/, '');
  
  const dashSplit = title.split(/\s*[-–—]\s*/);
  if (dashSplit.length > 1 && dashSplit[0].length < 80) {
    return dashSplit[0].trim();
  }
  const periodSplit = title.split(/\.\s+/);
  if (periodSplit.length > 1 && periodSplit[0].length < 80) {
    return periodSplit[0].trim();
  }
  return title.trim().substring(0, 100);
};

// Build rules array
const rules = [];

for (let i = 0; i < ruleStarts.length; i++) {
  const current = ruleStarts[i];
  const next = ruleStarts[i + 1];
  const startIdx = current.lineIdx;
  const endIdx = next ? next.lineIdx : lines.length;

  const ruleLines = lines.slice(startIdx, endIdx);
  const filteredLines = ruleLines.filter(l => !isPageArtifact(l));
  const fullText = filteredLines.join('\n').trim();

  const part = getPartForRule(current.ruleKey);
  const title = extractTitle(current.rawHeader, current.ruleKey);

  // Provisos
  const provisos = [];
  const provisoMatches = fullText.match(/Provided\s+(?:further\s+|also\s+)?that[^\.]*\./gi) || [];
  provisoMatches.forEach(p => provisos.push(p.trim()));

  // Amendments
  const amendments = [];
  const amendMatches = fullText.match(/<sup>\d+<\/sup>\s*(?:Ins\.|Subs\.|Inserted|Substituted|Published)[^\n]+/gi) || [];
  amendMatches.forEach(a => amendments.push(a.replace(/<\/?[^>]+(>|$)/g, '').trim()));

  // Subrules
  const subrules = [];
  const subruleRegex = /(?:^|\n)\((\d{1,2}|[a-z])\)\s*([^\n\r]+)/g;
  let sm;
  while ((sm = subruleRegex.exec(fullText)) !== null) {
    if (subrules.length < 25) {
      subrules.push({
        number: `(${sm[1]})`,
        snippet: sm[2].trim().substring(0, 160)
      });
    }
  }

  // Keywords
  const keywords = extractKeywords(title, fullText.substring(0, 1000));
  keywords.unshift(`Rule ${current.ruleKey}`);

  // Page info
  const pages = pageMap[current.ruleKey] || {
    page_start: null,
    page_end: null
  };

  rules.push({
    id: `rule-${current.ruleKey.toLowerCase()}`,
    ruleNumber: current.ruleKey,
    title,
    partId: part.id,
    partNumber: part.number,
    partTitle: part.title,
    page_start: pages.page_start,
    page_end: pages.page_end,
    rawHeader: current.rawHeader,
    content: fullText,
    summary: fullText.replace(/^#{1,4}[^\n]+\n?/, '').replace(/\*\*/g, '').substring(0, 260).trim() + '...',
    subruleCount: subrules.length,
    subrules,
    provisos,
    amendments,
    hasTables: fullText.includes('<table') || /TABLE\s*[-–—]?\s*\d+/i.test(fullText),
    hasComments: fullText.includes('## **COMMENTS**') || fullText.includes('## COMMENTS'),
    keywords
  });
}

console.log(`Parsed ${rules.length} rules.`);

// Step 2: Extract Definitions from Rule 2
console.log('Extracting Rule 2 definitions...');
const rule2 = rules.find(r => r.ruleNumber === '2');
const rule2Lines = rule2.content.split('\n');

const definitions = [];
let currentDef = null;

function finalizeDefinition(d) {
  const text = d.lines.join('\n');
  const clean = text.replace(/<hr\s*\/?>/g, '').replace(/<sup>.*?<\/sup>/g, '').trim();
  
  const exclusions = [];
  const exclMatch = clean.match(/excluding[^\.]*\./i) || clean.match(/shall not include[^\.]*\./i);
  if (exclMatch) {
    exclusions.push(exclMatch[0]);
  }

  return {
    id: `def-${d.subNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    subNumber: d.subNumber,
    term: d.term,
    definition: clean,
    summary: clean.substring(0, 200) + '...',
    exclusions,
    keywords: extractKeywords(d.term, clean),
    ruleId: 'rule-2',
    ruleNumber: '2'
  };
}

for (let idx = 0; idx < rule2Lines.length; idx++) {
  const line = rule2Lines[idx].trim();
  if (!line || line === '<hr/>' || line.startsWith('Rule 2') || line.startsWith('## **COMMENTS**')) continue;

  const startMatch = line.match(/^(?:<sup>.*?<\/sup>\[?)?(?:\(?(\d{1,2}(?:-[A-Za-z]|\([a-z]\)|[a-z])?)\)?)\.?\s*([^\n\r]+)/i);

  if (startMatch && (line.includes('means') || line.includes('include') || line.includes('**"') || line.includes('"**'))) {
    if (currentDef) {
      definitions.push(finalizeDefinition(currentDef));
    }

    let term = '';
    const tm = line.match(/\*\*["']?([^"'\*]+)["']?\*\*/);
    if (tm) {
      term = tm[1].trim();
    } else {
      const alt = line.match(/\d+.*?\.\s*([A-Za-z\s]+?)\s+means/i);
      term = alt ? alt[1].trim() : startMatch[2].substring(0, 40).trim();
    }

    currentDef = {
      subNumber: startMatch[1] || `${definitions.length + 1}`,
      term,
      lines: [line]
    };
  } else if (currentDef) {
    currentDef.lines.push(line);
  }
}

if (currentDef) {
  definitions.push(finalizeDefinition(currentDef));
}

console.log(`Extracted ${definitions.length} definitions.`);

// Step 3: Extract Case Laws / Comments
console.log('Extracting Case Laws...');
const caseLaws = [];
const commentRegex = /##\s*\*{0,2}COMMENTS\*{0,2}\s*\n+([\s\S]*?)(?=(?:<hr\s*\/?>|\n\*\*|\n##|\nRule\s+\d+|$))/gi;

let cm;
let caseIdx = 1;
while ((cm = commentRegex.exec(rawText)) !== null) {
  const commentBody = cm[1].trim();
  if (commentBody.length < 15) continue;

  const linesInComment = commentBody.split('\n').filter(l => l.trim().length > 0);
  const citationLine = linesInComment.find(l => /Vs\.|\bv\.\b|\bSupreme\b|\bMPLJ\b|\bJLJ\b|\bRN\b/i.test(l)) || linesInComment[linesInComment.length - 1];

  let citation = '';
  let caseName = '';
  if (citationLine) {
    const boldMatch = citationLine.match(/\*\*([^*]+)\*\*/);
    citation = boldMatch ? boldMatch[1] : citationLine.replace(/<[^>]+>/g, '').trim();
    const vsMatch = citation.match(/([A-Za-z\s\.,\(\)]+Vs\.?[A-Za-z\s\.,\(\)]+)/i);
    caseName = vsMatch ? vsMatch[1].trim() : citation;
  }

  const textBefore = rawText.substring(0, cm.index);
  const ruleMatchBefore = textBefore.match(/(?:^|\n)(?:#{1,4}\s*)?(?:<sup>.*?<\/sup>\[?)?(?:\*\*)?(\d{1,3}\s*[A-Z]?)\.\s*(?:\(?\d+\)?)?\s*(?:\*\*)?/g);
  let associatedRule = 'General';
  if (ruleMatchBefore && ruleMatchBefore.length > 0) {
    const lastM = ruleMatchBefore[ruleMatchBefore.length - 1];
    const numM = lastM.match(/(\d{1,3}\s*[A-Z]?)\./);
    if (numM) associatedRule = numM[1].trim();
  }

  caseLaws.push({
    id: `caselaw-${caseIdx++}`,
    associatedRule,
    ruleId: `rule-${associatedRule.toLowerCase()}`,
    caseName,
    citation,
    fullText: commentBody,
    summary: commentBody.split('--')[0].trim().replace(/\*\*/g, ''),
    keywords: extractKeywords(caseName, commentBody)
  });
}

console.log(`Extracted ${caseLaws.length} case laws.`);

// Step 4: Extract Key Reference Tables
console.log('Extracting Reference Tables...');
const KNOWN_TABLES = [
  { number: '1', title: 'Size of Drawing Sheets', rule: '16', ruleId: 'rule-16' },
  { number: '2', title: 'Colouring of Plans', rule: '16', ruleId: 'rule-16' },
  { number: '3', title: 'Width and Length of Means of Access', rule: '38', ruleId: 'rule-38' },
  { number: '4', title: 'Exterior Open Spaces Around Building (Height above 12.5m)', rule: '42', ruleId: 'rule-42' },
  { number: '5', title: 'Distance Between Two Blocks', rule: '42', ruleId: 'rule-42' },
  { number: '5-A', title: 'Norms for Mixed Land Use & FAR', rule: '42A', ruleId: 'rule-42a' },
  { number: '6', title: 'Minimum Community Facilities & Layout Amenities', rule: '49', ruleId: 'rule-49' },
  { number: '7', title: 'Density, Coverage and Floor Area Ratio (Group Housing)', rule: '60', ruleId: 'rule-60' },
  { number: '8', title: 'Floor Area Ratio (FAR) for Different Use Groups', rule: '61', ruleId: 'rule-61' }
];

const tablesList = KNOWN_TABLES.map(kt => {
  const matchedRule = rules.find(r => r.ruleNumber === kt.rule);
  let tableHtml = '';
  if (matchedRule) {
    const tableIndex = matchedRule.content.indexOf('<table');
    if (tableIndex !== -1) {
      const tableEndIndex = matchedRule.content.lastIndexOf('</table>');
      if (tableEndIndex !== -1) {
        tableHtml = matchedRule.content.substring(tableIndex, tableEndIndex + 8);
      }
    }
  }

  return {
    id: `table-${kt.number.toLowerCase()}`,
    tableNumber: `Table ${kt.number}`,
    title: kt.title,
    associatedRule: kt.rule,
    ruleId: kt.ruleId,
    html: tableHtml,
    keywords: extractKeywords(kt.title, `Table ${kt.number}`, `Rule ${kt.rule}`)
  };
});

// Step 5: Build master JSON database
const database = {
  metadata: {
    title: 'Madhya Pradesh Bhumi Vikas Rules, 2012',
    subtitle: 'मध्यप्रदेश भूमि विकास नियम, 2012',
    updatedUntil: '6th March 2025',
    authority: 'Directorate of Town and Country Planning, Government of Madhya Pradesh',
    parentAct: 'M.P. Nagar Tatha Gram Nivesh Adhiniyam, 1973 (No. 23 of 1973)',
    publishedDate: '30th May, 2012',
    totalRules: rules.length,
    totalDefinitions: definitions.length,
    totalCaseLaws: caseLaws.length,
    totalReferenceTables: tablesList.length,
    parts: PARTS
  },
  parts: PARTS,
  rules,
  definitions,
  tables: tablesList,
  caseLaws
};

fs.mkdirSync('src/data', { recursive: true });
const dbPath = path.resolve('src/data/bhuvikas-rules.json');
fs.writeFileSync(dbPath, JSON.stringify(database, null, 2), 'utf8');
const dbStat = fs.statSync(dbPath);
console.log(`Saved primary database to ${dbPath} (${(dbStat.size / 1024).toFixed(1)} KB)`);

// Step 6: Flat search index
const searchIndex = [
  ...rules.map(r => ({
    id: r.id,
    type: 'rule',
    number: r.ruleNumber,
    badge: `Rule ${r.ruleNumber}`,
    title: r.title,
    part: r.partNumber,
    page: r.page_start ? `p. ${r.page_start}${r.page_end !== r.page_start ? `-${r.page_end}` : ''}` : null,
    snippet: r.summary,
    keywords: r.keywords
  })),
  ...definitions.map(d => ({
    id: d.id,
    type: 'definition',
    number: d.subNumber,
    badge: `Def 2(${d.subNumber})`,
    title: d.term,
    part: 'PART-I (General)',
    page: 'p. 2-14',
    snippet: d.summary,
    keywords: d.keywords
  })),
  ...tablesList.map(t => ({
    id: t.id,
    type: 'table',
    number: t.tableNumber,
    badge: t.tableNumber,
    title: t.title,
    part: 'Schedule Table',
    page: null,
    snippet: `Regulatory table under Rule ${t.associatedRule} for ${t.title}.`,
    keywords: t.keywords
  })),
  ...caseLaws.map(c => ({
    id: c.id,
    type: 'case_law',
    number: c.associatedRule,
    badge: `Case Precedent (Rule ${c.associatedRule})`,
    title: c.caseName,
    part: 'Judicial Precedent',
    page: null,
    snippet: c.summary,
    keywords: c.keywords
  }))
];

const indexPath = path.resolve('src/data/search-index.json');
fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2), 'utf8');
const indexStat = fs.statSync(indexPath);
console.log(`Saved search index to ${indexPath} (${(indexStat.size / 1024).toFixed(1)} KB, ${searchIndex.length} items)`);
console.log('Finished successfully!');

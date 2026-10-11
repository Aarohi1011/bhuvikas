import { searchRules, getRuleById, getDatabaseMetadata } from '../src/lib/searchEngine.js';

console.log('Testing Bhuvikas Search Engine Backend...\n');

const metadata = getDatabaseMetadata();
console.log(`Database: ${metadata.title}`);
console.log(`Updated until: ${metadata.updatedUntil}`);
console.log(`Rules: ${metadata.totalRules}, Definitions: ${metadata.totalDefinitions}, Case Laws: ${metadata.totalCaseLaws}, Tables: ${metadata.totalReferenceTables}\n`);

const testQueries = ['FAR', '14', '12A', 'basement', 'commercial parking', 'Satish Nayak'];

for (const q of testQueries) {
  console.log(`===============================================`);
  console.log(`QUERY: "${q}"`);
  console.log(`===============================================`);
  const res = searchRules(q, { limit: 3 });
  console.log(`Total hits: ${res.total}`);
  console.log(`Facets types:`, res.facets.types);
  console.log(`Top results:`);
  res.results.forEach((r, idx) => {
    console.log(`  ${idx + 1}. [${r.badge}] ${r.title} (Score: ${r.score})`);
    console.log(`     Snippet: ${r.snippet.substring(0, 100)}...`);
  });
  console.log('');
}

console.log('Testing getRuleById for Rule 14...');
const r14 = getRuleById('14');
console.log(`Found Rule 14: ${r14.title}`);
console.log(`Page: ${r14.page_start} - ${r14.page_end}`);
console.log(`Provisos count: ${r14.provisos.length}`);
console.log(`Subrules count: ${r14.subrules.length}`);
console.log(`Attached case laws: ${r14.attachedCaseLaws.length}`);

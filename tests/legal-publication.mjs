import { publicationBlockers } from '../src/data/company.ts';

const gaps = publicationBlockers();
console.log('Validation juridique de publication');
if (gaps.length === 0) {
  console.log('GO — aucune lacune listée dans company.ts');
} else {
  console.log('NO-GO — champs encore à confirmer avant une publication juridique :');
  for (const gap of gaps) console.log(`- ${gap.id}: ${gap.detail}`);
}
console.log('Ce contrôle n’échoue pas la validation technique.');
process.exit(0);

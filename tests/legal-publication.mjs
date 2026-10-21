import { publicationReview } from '../src/data/company.ts';

const review = publicationReview();
console.log('Validation juridique de publication');
console.log('Confirmé :');
for (const item of review.confirmed) console.log(`- ${item}`);
console.log('À vérifier sur pièces :');
if (review.documents.length === 0) console.log('- aucun');
for (const gap of review.documents) console.log(`- ${gap.id}: ${gap.detail}`);
console.log('RGPD encore à clarifier :');
if (review.gdpr.length === 0) console.log('- aucun');
for (const gap of review.gdpr) console.log(`- ${gap.id}: ${gap.detail}`);
if (review.documents.length === 0 && review.gdpr.length === 0) {
  console.log('GO — aucune question essentielle restante dans company.ts');
} else {
  console.log('NO-GO juridique — des questions essentielles restent ouvertes.');
}
console.log('Ce contrôle n’échoue pas la validation technique.');
process.exit(0);

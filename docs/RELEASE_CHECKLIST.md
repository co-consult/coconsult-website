# Checklist de validation V1

## Bloquant avant une validation juridique de mise en production

Ces champs sont vides dans `src/data/company.ts`. Ne pas les inventer.

- [ ] Forme juridique
- [ ] Capital social
- [ ] SIREN
- [ ] SIRET
- [ ] RCS
- [ ] Numéro de TVA
- [ ] Directeur de la publication
- [ ] Adresse du siège
- [ ] Téléphone
- [ ] Identité juridique de l’hébergeur (raison sociale et adresse)
- [ ] DPO, s’il est désigné
- [ ] URL LinkedIn officielle, seulement après vérification

La page mentions légales dit explicitement que ces éléments ne sont pas encore publiés.

## Contenu à confirmer par la direction

- [ ] Nom commercial définitif de la plateforme SaaS métier (aujourd’hui : « Plateforme SaaS métier (nom à venir) »)
- [ ] Périmètre réel des modules Cogeex
- [ ] Autorisation de citer un client, un logo ou un chiffre
- [ ] Niveau d’anglais garanti pour une mission QA internationale
- [ ] Chevauchement horaire type avec un client aux États-Unis
- [ ] Réception effective de `contact@coconsult.fr`

## Technique

- [ ] `npm ci`, `npm run check`, `npm run build`, `npm test`
- [ ] Redirection `/en` vers `/en/` sans `:8080`
- [ ] `https://coconsult.fr/en/` répond 200
- [ ] Logo officiel visible sur fond clair dans l’en-tête
- [ ] Parcours mobile : menu, FR/EN, page QA
- [ ] `compose.proxy.yaml` du VPS inchangé
- [ ] Aucun autre conteneur redémarré
- [ ] Rollback testé sur le commit précédent si la mise à jour est refusée

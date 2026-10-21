# Checklist de validation V1

Les pages mentions légales et confidentialité ne sont pas complètes. Elles publient seulement les faits déjà établis et indiquent ce qui manque. Ne pas inventer d’identifiants pour les faire paraître complètes.

## Prérequis juridiques indispensables

Ces éléments manquent dans `src/data/company.ts`. Tant qu’ils ne sont pas confirmés et publiés, il n’y a pas de validation juridique pour la mise en production.

- [ ] Forme juridique
- [ ] Capital social
- [ ] SIREN
- [ ] SIRET
- [ ] RCS
- [ ] Numéro de TVA
- [ ] Directeur de la publication
- [ ] Adresse du siège
- [ ] Identité juridique de l’hébergeur (raison sociale et adresse)

## Informations facultatives

Ces données ne sont pas requises pour décrire le site tel qu’il fonctionne aujourd’hui. Les ajouter seulement si elles existent et sont confirmées.

- [ ] Téléphone, en plus de `contact@coconsult.fr`
- [ ] DPO, seulement si une personne est réellement désignée
- [ ] URL LinkedIn officielle, après vérification du lien. Ce n’est pas une mention légale.

## Données commerciales à confirmer

- [ ] Nom commercial définitif de la plateforme SaaS métier (aujourd’hui : « Plateforme SaaS métier (nom à venir) »)
- [ ] Périmètre réel des modules Cogeex
- [ ] Autorisation de citer un client, un logo ou un chiffre
- [ ] Niveau d’anglais garanti pour une mission QA internationale
- [ ] Chevauchement horaire type avec un client aux États-Unis
- [ ] Réception effective de `contact@coconsult.fr`

## Technique

- [ ] `npm ci`, `npm run check`, `npm run build`, `npm test`
- [ ] `HEAD /en` répond 301 avec `Location: /en/`, sans `:8080` ni hôte absolu
- [ ] `https://coconsult.fr/en/` répond 200
- [ ] Logo officiel visible sur fond clair dans l’en-tête, FR et EN
- [ ] Parcours mobile : menu, FR/EN, page QA
- [ ] `compose.proxy.yaml` du VPS inchangé
- [ ] Aucun autre conteneur redémarré
- [ ] Rollback testé sur le commit précédent si la mise à jour est refusée

# Notes d’architecture – Analyse du starter Angular (P2)

## 1. Absence de service pour les requêtes HTTP

- **Constat :** Les appels HTTP sont faits directement dans les composants.
- **Commentaire :** Ça mélange UI et accès aux données, ce qui complique les tests et la maintenance.
- **Piste :** Créer un service dédié (ex. `OlympicApiService`) dans `app/services` et y centraliser toutes les requêtes.

---

## 2. Traitement des données dans les composants

- **Constat :** Les composants font eux-mêmes le traitement / transformation des données.
- **Commentaire :** Les composants deviennent trop lourds, difficilement lisibles et peu réutilisables.
- **Piste :** Déplacer la logique métier dans une classe ou un service dédié au traitement des données.

---

## 3. Architecture concentrée dans `pages`

- **Constat :** La majorité de la structure et de la logique est regroupée dans le dossier `pages`.
- **Commentaire :** Le projet n’est pas organisé de façon modulaire, ce qui ne scale pas bien.
- **Piste :** Réorganiser en séparant `pages`, `components`, `services`, `models`, voire `core`/`shared`.

---

## 4. Absence de modèles typés et usage de `any`

- **Constat :** Les objets ne sont pas modélisés avec des interfaces, et `any` est utilisé à plusieurs endroits.
- **Commentaire :** On perd les avantages de TypeScript (typage, autocomplétion, sécurité).
- **Piste :** Créer un dossier `app/models` avec des interfaces (ex. `Country`, `OlympicResult`, etc.) et remplacer les `any` par ces types.

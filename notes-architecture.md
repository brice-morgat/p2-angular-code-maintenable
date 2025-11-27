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




## Proposition d’architecture front-end

### 1. Objectif

Séparer clairement :
- l’accès aux données,
- la logique métier (calculs, agrégations),
- la présentation (composants / pages).

Tout doit passer par un **service singleton** et des **modèles typés**.


### Pourquoi utiliser le pattern Singleton pour les services ?

On utilise le pattern **Singleton** pour les services afin de :

- Avoir **une seule instance partagée** dans toute l’application.
- Centraliser l’**accès aux données** (JSON aujourd’hui, API REST demain).
- **Partager un état commun** (cache, données déjà chargées) entre plusieurs composants.
- Éviter les **incohérences** et les duplications de logique.
- Améliorer les **performances** en ne recréant pas le service à chaque fois.

En Angular, cela se fait via `providedIn: 'root'`.

---

### 2. Nouvelle structure de dossiers

```text
src/app/
  ├── models/
  │   ├── participation.model.ts
  │   └── country.model.ts
  ├── services/
  │   └── olympic-data.service.ts
  ├── pages/
  │   ├── home/
  │   │   ├── home.component.ts / .html / .scss
  │   ├── country/
  │   │   ├── country.component.ts / .html / .scss
  │   └── not-found/
  │       ├── not-found.component.ts / .html / .scss
  ├── components/
  │   ├── medals-chart.component.ts / .html / .scss
  │   └── country-card.component.ts / .html / .scss 
  ├── app-routing.module.ts
  └── app.module.ts
  ```
  

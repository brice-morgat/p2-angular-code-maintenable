
# ARCHITECTURE FRONT-END – Olympic Games App

## 1. Vue d’ensemble

Cette application Angular affiche des statistiques sur les Jeux Olympiques :

- une page **dashboard** (home) avec un graphique en camembert des médailles par pays ;
- une page **détail pays** avec un graphique en courbe des médailles dans le temps ;
- une page **404 / not-found**.

L’architecture sépare clairement :

- **l’accès aux données** (JSON / futur back-end) ;
- **la logique métier / mise en forme des données** ;
- **l’affichage et la navigation** (composants / pages).

---

## 2. Arborescence des dossiers

```text
src/app/
  ├── models/                     # Modèles TypeScript (données métier)
  │   ├── participation.model.ts
  │   ├── country.model.ts
  │   └── index.ts                # Barrel file pour simplifier les imports
  ├── services/                   # Accès données + logique métier
  │   ├── olympic-data.service.ts # Accès brut au JSON (HttpClient)
  │   └── data.service.ts         # Mise en forme des données pour l’UI
  ├── pages/                      # Composants "containers" / pages
  │   ├── home/
  │   │   ├── home.component.ts
  │   │   ├── home.component.html
  │   │   └── home.component.scss
  │   ├── country/
  │   │   ├── country.component.ts
  │   │   ├── country.component.html
  │   │   └── country.component.scss
  │   └── not-found/
  │       ├── not-found.component.ts
  │       ├── not-found.component.html
  │       └── not-found.component.scss
  ├── components/                 # Composants de présentation réutilisables
  │   ├── country-card/
  │   ├── medal-country-chart/
  │   └── country-chart/
  ├── app-routing.module.ts
  └── app.module.ts
```

**Principes :**

- `pages/` : composants containers (logique de page, routing, appels services).
- `components/` : composants d’affichage réutilisables, sans logique métier.
- `services/` : data + métier, injectés en `providedIn: 'root'`.
- `models/` : interfaces TypeScript pour typer les données.

---

## 3. Modèles (dossier `models/`)

Les données sont typées via des interfaces, par exemple :

- `Participation` : une participation d’un pays à une édition (année, ville, médailles, athlètes, etc.).
- `Country` : un pays avec sa liste de `participations: Participation[]`.

Un fichier `index.ts` ré-exporte les modèles pour permettre des imports du type :

```ts
import { Country, Participation } from '../models';
```

Cela évite l’utilisation de `any` dans les services et composants.

---

## 4. Services

### 4.1. `OlympicDataService` – accès brut aux données

Rôle :

- Lire le fichier JSON mocké (`./assets/mock/olympic.json`) via `HttpClient`.
- Exposer un `Observable<Country[]>` typé.
- Mémoriser la réponse (cache) avec `shareReplay(1)` pour éviter les multiples requêtes.

Ce service ne fait **aucun traitement métier** (pas de calculs, pas d’agrégations).  
Il est conçu pour être facilement remplaçable par un appel à une **API REST** dans un projet réel.

### 4.2. `DataService` – logique métier & données prêtes pour l’UI

Rôle :

- Consommer `OlympicDataService` pour récupérer la liste des `Country`.
- Transformer ces données en structures prêtes à l’emploi pour les composants.

Principales structures retournées :

- `GlobalStats` pour la home (dashboard) :
  - `totalCountries`
  - `totalJOs`
  - `medalsByCountry[]` : `{ country, totalMedals }`

- `CountryDetails` pour la page pays :
  - `country` (détails du pays)
  - `totalEntries`
  - `totalMedals`
  - `totalAthletes`
  - `years[]` (pour l’axe X du graphe)
  - `medals[]` (pour l’axe Y du graphe)

Les **composants ne calculent plus rien** (pas de `reduce`, pas de `map` complexes) :  
ils consomment directement ces objets typés.

---

## 5. Pages (dossier `pages/`)

### 5.1. `HomeComponent` (page dashboard)

Rôle :

- Injecter `DataService`.
- Appeler `getGlobalStats()` et afficher :
  - le nombre total de pays,
  - le nombre total de JO,
  - le graphique en camembert via `CountryChartComponent`.
- Gérer la navigation vers la page pays :
  - écoute l’événement `(countrySelected)` émis par `CountryChartComponent`,
  - redirige vers `/country/:countryName` via le `Router`.

**HomeComponent ne contient pas :**

- de `HttpClient`,
- de lecture de JSON,
- de logique métier lourde (calculs de médailles, etc.).

### 5.2. `CountryComponent` (page détail pays)

Rôle :

- Récupérer le paramètre de route `countryName` via `ActivatedRoute`.
- Appeler `DataService.getCountryDetails(countryName)` :
  - si le pays n’est pas trouvé ou en cas d’erreur → rediriger vers `NotFound`,
  - sinon, alimenter :
    - `CountryCardComponent` (titre + stats globales),
    - `MedalChartComponent` (données de courbe par année).

**CountryComponent ne contient pas :**

- d’URL de JSON,
- de parsing brut,
- de logique de calcul de totaux.

### 5.3. `NotFoundComponent`

Rôle :

- Afficher une page simple d’erreur 404 (route inconnue / pays introuvable).

---

## 6. Composants de présentation (dossier `components/`)

### 6.1. `CountryCardComponent`

Rôle :

- Afficher les informations synthétiques d’un pays :
  - nom du pays,
  - nombre de participations,
  - total de médailles,
  - total d’athlètes.
- Reçoit toutes ses données via `@Input()` (aucun service injecté).

### 6.2. `MedalChartComponent` (graphique en ligne)

Rôle :

- Afficher un graphique **Chart.js** en ligne (line chart) pour un pays :
  - `labels` = années,
  - `data` = médailles par année.
- Encapsule entièrement la configuration Chart.js.
- Ne gère que l’affichage : pas de logique métier, pas de navigation.

### 6.3. `CountryChartComponent` (camembert de médailles)

Rôle :

- Afficher un **pie chart** Chart.js pour la répartition des médailles par pays.
- Inputs :
  - `labels` = liste de pays,
  - `data` = total de médailles par pays.
- Output :
  - `countrySelected: EventEmitter<string>` émis quand l’utilisateur clique sur un pays dans le graphe.
- La navigation est déléguée à `HomeComponent`, qui écoute l’événement.

---

## 7. Préparation à une future connexion back-end / API

Cette architecture est pensée pour être facilement connectée à un **vrai back-end** :

- `OlympicDataService` est le **seul** service qui connaît la source des données (fichier JSON aujourd’hui).
  - Demain, il pourra appeler une API REST :
    - `GET /olympics` → `Observable<Country[]>`
- `DataService` n’a pas besoin de changer d’API : il continue de consommer des `Country[]` et d’appliquer les mêmes règles métier.
- Les pages (`HomeComponent`, `CountryComponent`) et les composants de présentation (`CountryCardComponent`, `MedalChartComponent`, `CountryChartComponent`) restent inchangés :
  - ils dépendent d’interfaces (`GlobalStats`, `CountryDetails`) et non du format brut du backend.

**En résumé :**

- Changer la source de données (JSON → API REST) impacte uniquement :
  - `OlympicDataService`.
- Le reste de l’application est protégé derrière le contrat exposé par `DataService`.

---

## 8. Lecture pour un nouveau développeur

Un nouveau développeur doit pouvoir comprendre le projet en suivant ces étapes :

1. Lire ce fichier `ARCHITECTURE.md` pour comprendre les rôles de :
   - `models/`,
   - `services/` (séparation `OlympicDataService` / `DataService`),
   - `pages/` vs `components/`.
2. Consulter `DataService` pour voir comment les données sont préparées pour l’UI.
3. Regarder `HomeComponent` et `CountryComponent` pour comprendre le flux de données entre :
   - route → service → composants de présentation.
4. Observer les composants de présentation (`CountryCardComponent`, `MedalChartComponent`, `CountryChartComponent`) pour voir comment l’affichage est structuré (Chart.js, cartes de stats, etc.).

La logique globale est :

- **Data** : `OlympicDataService` → `DataService`
- **UI** : `DataService` → Pages (`Home`, `Country`) → Composants (`CountryCard`, `MedalChart`, `CountryChart`)

Cette séparation rend le projet plus lisible, testable, et prêt à évoluer vers un backend réel.

# ⚽ FlashScoreApp - Gestionnaire de Projet Sportif

FlashScoreApp est une application mobile moderne construite avec **React Native** et **Expo**. Elle utilise une architecture basée sur le système de fichiers avec **Expo Router** pour offrir une expérience utilisateur fluide et une gestion de projet optimisée via des onglets inspirés de la méthode **Trello**.

## 🚀 Aperçu du Projet

L'application transforme les données sportives en flux de travail organisés. Chaque onglet représente une étape cruciale du cycle de vie du sport et de son développement.

## 📂 Structure du Projet (Navigation)

L'application est organisée autour de quatre piliers principaux au sein du répertoire `app/(tabs)/` :

| Onglet | Fonctionnalité Trello | Description |
| :--- | :--- | :--- |
| **Matches** | `À Faire (To-Do)` | Gestion des matchs à venir, analyse des statistiques et préparation des données. |
| **News** | `En Cours (In Progress)` | Développement des flux d'actualités, intégration API et optimisation média. |
| **Leagues** | `Terminé (Done)` | Visualisation des ligues finalisées, classements et archives de données. |
| **Account** | `Paramètres` | Gestion du profil utilisateur, authentification et préférences. |

## 🛠 Stack Technique

- **Framework:** React Native via Expo
- **Navigation:** Expo Router (File-based routing)
- **Langage:** TypeScript (TSX)
- **Icons:** Ionicons via `@expo/vector-icons`
- **Design:** Dark Theme (Slate/Dark blue palette)

## ⚙️ Installation et Démarrage

Suivez ces étapes pour configurer le projet dans votre environnement de développement local :

### 1. Cloner le projet

```bash
git clone https://github.com/YarkinOner/FlashScoreApp.git
cd FlashScoreApp
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur de développement

```bash
npx expo start
```

## 🏗️ Architecture des Fichiers

```plaintext
FlashScoreApp/
├── app/
│   ├── (tabs)/           # Système de navigation par onglets
│   │   ├── account.tsx   # Gestion du profil (Paramètres)
│   │   ├── index.tsx     # Écran principal (Matches / To-Do)
│   │   ├── leagues.tsx   # Statistiques des ligues (Done)
│   │   └── news.tsx      # Flux d'actualités (In Progress)
│   ├── _layout.tsx       # Configuration racine du Router
│   └── match-detail.tsx  # Détails des rencontres
├── components/           # Composants réutilisables
└── assets/               # Ressources statiques
```

## 📝 Roadmap & Prochaines Étapes

- [ ] Auth: Intégration de Firebase Auth pour la synchronisation du compte.
- [ ] Data: Connexion en temps réel aux API de scores sportifs mondiaux (RapidAPI).
- [ ] UI: Implémentation du mode "Drag & Drop" pour déplacer les cartes.


---

## 👨‍💻 Auteur

**Yarkin Oner**

Développeur passionné par l'innovation mobile et le sport.

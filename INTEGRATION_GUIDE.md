# Guide d'intégration - Gestion des employés avec API

Ce guide vous explique comment intégrer la fonctionnalité de recherche et pagination des employés avec votre base de données PostgreSQL.

## 🚀 Fonctionnalités ajoutées

- ✅ **API Backend** : Endpoints pour CRUD des employés avec recherche et pagination
- ✅ **Recherche en temps réel** : Filtrage par nom, prénom, email, département, rôle
- ✅ **Pagination** : Affichage de 10 employés par page avec navigation
- ✅ **Gestion d'état** : Intégration avec Zustand pour la gestion des données
- ✅ **Interface utilisateur** : Conservation du design existant
- ✅ **Génération de données** : Script pour créer 1000 employés de test

## 📋 Prérequis

- Node.js installé
- PostgreSQL configuré
- Base de données avec les tables `User` et `CompanyEmployee`

## 🛠️ Installation et configuration

### 1. Installer les dépendances backend

```bash
cd backend
npm install
```

### 2. Générer les employés de test (1000 employés)

```bash
npm run generate-employees
```

### 3. Démarrer le serveur backend

```bash
npm run dev
```

Le serveur sera disponible sur `http://localhost:5000`

### 4. Démarrer le frontend

```bash
cd client
npm run dev
```

Le frontend sera disponible sur `http://localhost:3000`

## 🔧 Nouveaux fichiers créés

### Backend
- `backend/src/models/employeeModel.js` - Modèle pour les opérations sur les employés
- `backend/src/controllers/employeeController.js` - Contrôleur avec logique métier
- `backend/src/routes/employeeRoutes.js` - Routes API pour les employés
- `backend/scripts/generateEmployees.js` - Script de génération de données

### Frontend
- `client/lib/api.ts` - Service API pour communiquer avec le backend

### Modifications
- `backend/index.js` - Ajout des routes employés
- `client/lib/store.ts` - Intégration avec l'API
- `client/app/employees/page.tsx` - Utilisation des données API
- `client/components/employee-modal.tsx` - Gestion des erreurs et loading

## 📡 Endpoints API

### GET /api/employees
Récupère les employés avec pagination et recherche

**Paramètres :**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 10)
- `search` (optionnel) : Terme de recherche

**Exemple :**
```
GET /api/employees?page=1&limit=10&search=john
```

### GET /api/employees/:id
Récupère un employé par son ID

### POST /api/employees
Crée un nouvel employé

### PUT /api/employees/:id
Met à jour un employé

### DELETE /api/employees/:id
Supprime un employé

## 🔍 Fonctionnalités de recherche

La recherche fonctionne sur les champs suivants :
- `first_name` (prénom)
- `last_name` (nom)
- `email`
- `department` (département)
- `role` (rôle)

La recherche est **insensible à la casse** et utilise une correspondance partielle.

## 📄 Pagination

- **Par défaut** : 10 employés par page
- **Navigation** : Boutons précédent/suivant
- **Informations** : Affichage du nombre total d'employés et de la page actuelle
- **URL** : Les paramètres de pagination sont gérés côté client

## 🎨 Interface utilisateur

### États de chargement
- **Loading** : Spinner pendant le chargement des données
- **Erreur** : Message d'erreur en cas de problème
- **Vide** : Message informatif quand aucun employé n'est trouvé

### Recherche
- **Debounced** : Recherche avec délai de 300ms pour éviter trop de requêtes
- **Temps réel** : Mise à jour automatique des résultats
- **Reset pagination** : Retour à la page 1 lors d'une nouvelle recherche

## 🔐 Authentification

Tous les endpoints employés nécessitent une authentification via JWT token. Le token est automatiquement inclus dans les requêtes depuis le frontend.

## 🧪 Test de l'intégration

1. **Démarrer les serveurs** (backend et frontend)
2. **Se connecter** avec un compte admin
3. **Aller sur la page employés** (`/employees`)
4. **Vérifier** que les 10 premiers employés s'affichent
5. **Tester la recherche** en tapant un nom dans la barre de recherche
6. **Tester la pagination** avec les boutons précédent/suivant
7. **Tester l'ajout** d'un nouvel employé
8. **Tester la modification** d'un employé existant
9. **Tester la suppression** d'un employé

## 🐛 Dépannage

### Problème de connexion à la base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez la variable `DATABASE_URL` dans `.env`

### Erreur CORS
- Vérifiez que le frontend est sur `http://localhost:3000`
- Vérifiez la configuration CORS dans `backend/index.js`

### Erreur d'authentification
- Vérifiez que le token JWT est présent dans localStorage
- Vérifiez que le middleware d'authentification fonctionne

### Données non affichées
- Vérifiez que les employés ont été générés avec le script
- Vérifiez les logs du serveur backend
- Vérifiez la console du navigateur pour les erreurs

## 📊 Performance

- **Pagination côté serveur** : Seuls les employés nécessaires sont récupérés
- **Recherche optimisée** : Utilisation d'index de base de données
- **Debouncing** : Réduction du nombre de requêtes API
- **Cache** : Gestion d'état avec Zustand pour éviter les re-fetch inutiles

## 🔄 Prochaines étapes

Pour étendre cette fonctionnalité, vous pourriez ajouter :
- Filtres avancés (par département, statut, etc.)
- Tri par colonnes
- Export des données
- Import en masse
- Cache Redis pour améliorer les performances
- Tests unitaires et d'intégration


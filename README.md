# ProjetProduits - Architecture Microservices

## Description

Ce projet est une application de gestion de produits basée sur une architecture microservices avec Spring Boot pour le backend et React.js pour le frontend. L'application permet de gérer deux catalogues de produits distincts (Homme et Femme) avec authentification JWT et traçage des interactions utilisateurs pour de futures recommandations IA/ML.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                           Port: 3000                             │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Index Service (API Gateway)                    │
│                     Port: 8080                                   │
│  - Spring Cloud Gateway                                          │
│  - JWT Authentication                                            │
│  - Route Management                                              │
└─────────────────────────────────────────────────────────────────┘
                       │                         │
                       ▼                         ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│      Homme Service          │   │      Femme Service          │
│        Port: 8081           │   │        Port: 8082           │
│  - UserHomme CRUD           │   │  - UserFemme CRUD           │
│  - ProduitHomme CRUD        │   │  - ProduitFemme CRUD        │
│  - InteractionHomme CRUD    │   │  - InteractionFemme CRUD    │
└─────────────────────────────┘   └─────────────────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│    PostgreSQL (homme_db)    │   │    PostgreSQL (femme_db)    │
│        Port: 5433           │   │        Port: 5434           │
└─────────────────────────────┘   └─────────────────────────────┘
```

## Technologies Utilisées

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Cloud Gateway 2023.0.0**
- **Spring Security + JWT (jjwt 0.12.3)**
- **Spring Data R2DBC** (Index Service)
- **Spring Data JPA** (Homme/Femme Services)
- **PostgreSQL 15**
- **Lombok**

### Frontend
- **React 18.2.0**
- **React Router DOM 6**
- **Axios**
- **Bootstrap 5.3.2**
- **React Toastify**

### DevOps
- **Docker**
- **Docker Compose**

## Prérequis

- Java 17+
- Maven 3.8+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (si exécution sans Docker)

## Structure du Projet

```
ProjetProduits/
├── docker-compose.yml
├── README.md
├── index-service/          # API Gateway + Authentication
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── homme-service/          # Service Homme
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── femme-service/          # Service Femme
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
└── frontend/               # React Frontend
    ├── src/
    ├── package.json
    ├── Dockerfile
    └── nginx.conf
```

## Lancement avec Docker

### Démarrage complet
```bash
docker-compose up --build
```

### Arrêt
```bash
docker-compose down
```

### Arrêt avec suppression des volumes
```bash
docker-compose down -v
```

## Lancement Manuel (Développement)

### 1. Démarrer les bases de données PostgreSQL

```bash
# Base Index
docker run -d --name postgres-index -p 5432:5432 \
  -e POSTGRES_DB=index_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:15-alpine

# Base Homme
docker run -d --name postgres-homme -p 5433:5432 \
  -e POSTGRES_DB=homme_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:15-alpine

# Base Femme
docker run -d --name postgres-femme -p 5434:5432 \
  -e POSTGRES_DB=femme_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:15-alpine
```

### 2. Démarrer les services backend

```bash
# Index Service
cd index-service
mvn spring-boot:run

# Homme Service (nouveau terminal)
cd homme-service
mvn spring-boot:run

# Femme Service (nouveau terminal)
cd femme-service
mvn spring-boot:run
```

### 3. Démarrer le frontend

```bash
cd frontend
npm install
npm start
```

## Endpoints API

### Authentication (Index Service - Port 8080)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Inscription |
| POST | `/auth/login` | Connexion |
| POST | `/auth/refresh` | Rafraîchir le token |
| POST | `/auth/logout` | Déconnexion |
| GET | `/auth/validate` | Valider le token |

### Homme Service (via Gateway - /api/homme)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/homme/users` | Liste des utilisateurs |
| POST | `/api/homme/users` | Créer un utilisateur |
| PUT | `/api/homme/users/{id}` | Modifier un utilisateur |
| DELETE | `/api/homme/users/{id}` | Supprimer un utilisateur |
| GET | `/api/homme/produits` | Liste des produits |
| POST | `/api/homme/produits` | Créer un produit |
| PUT | `/api/homme/produits/{id}` | Modifier un produit |
| DELETE | `/api/homme/produits/{id}` | Supprimer un produit |
| GET | `/api/homme/interactions` | Liste des interactions |
| POST | `/api/homme/interactions` | Créer une interaction |
| GET | `/api/homme/interactions/training` | Données pour IA/ML |

### Femme Service (via Gateway - /api/femme)
Mêmes endpoints que Homme avec préfixe `/api/femme`

## Modèles de Données

### User (Index Service)
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "USER|ADMIN",
  "enabled": true
}
```

### UserHomme / UserFemme
```json
{
  "id": 1,
  "nom": "Jean Dupont",
  "email": "jean@example.com",
  "age": 30
}
```

### ProduitHomme / ProduitFemme
```json
{
  "id": 1,
  "nom": "T-Shirt Classic",
  "categorie": "Vêtements",
  "prix": 29.99,
  "description": "T-shirt en coton bio",
  "imageUrl": "https://example.com/image.jpg"
}
```

### InteractionHomme / InteractionFemme
```json
{
  "id": 1,
  "userId": 1,
  "produitId": 1,
  "typeInteraction": "VIEW|LIKE|PURCHASE",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Rôles et Permissions

| Rôle | Permissions |
|------|-------------|
| USER | Lecture des produits, création d'interactions |
| ADMIN | Toutes les opérations CRUD |

## Configuration JWT

Le token JWT expire après 24 heures. Le refresh token expire après 7 jours.

Clé secrète (à changer en production):
```
app.jwt.secret=VotreCleSecreteTresLongueEtComplexePourJWT2024
```

## Ports

| Service | Port |
|---------|------|
| Frontend | 3000 |
| Index Service (Gateway) | 8080 |
| Homme Service | 8081 |
| Femme Service | 8082 |
| PostgreSQL Index | 5432 |
| PostgreSQL Homme | 5433 |
| PostgreSQL Femme | 5434 |

## Auteur

Projet créé pour démonstration d'architecture microservices avec Spring Boot.

## Licence

MIT

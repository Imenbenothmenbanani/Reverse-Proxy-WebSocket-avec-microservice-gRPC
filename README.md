# Chat gRPC avec WebSocket Proxy

Ce projet implémente un service de chat basé sur gRPC avec un serveur proxy WebSocket pour faciliter la communication avec les clients Web.

## 🛠️ Technologies utilisées

- **gRPC** : Communication rapide et efficace entre services.
- **Node.js** : Environnement d'exécution pour le serveur et le proxy.
- **WebSocket** : Facilite la communication en temps réel avec les clients Web.

## 📂 Structure du projet

```
├── server.js        # Serveur gRPC principal
├── proxy.js         # Proxy WebSocket pour relayer les messages gRPC
├── chat.proto       # Fichier ProtoBuf définissant les messages et services gRPC
├── package.json     # Dépendances et scripts du projet
└── README.md        # Documentation
```

## 🚀 Installation et exécution

### 1️⃣ Prérequis

Assurez-vous d'avoir **Node.js** installé sur votre machine.

### 2️⃣ Installation des dépendances

Exécutez la commande suivante pour installer les dépendances nécessaires :

```sh
npm install
```

### 3️⃣ Démarrage du serveur gRPC

```sh
node server.js
```

Le serveur écoute sur `0.0.0.0:50051`.

### 4️⃣ Démarrage du proxy WebSocket

```sh
node proxy.js
```

Le proxy WebSocket écoute sur `ws://localhost:8081`.

## 📡 Fonctionnalités

- **GetUser** : Récupère un utilisateur par son ID.
- **Chat (stream bidirectionnel)** : Communication en temps réel entre les utilisateurs.
- **GetChatHistory** : Récupération de l'historique des messages d'une salle de chat.

## 📜 API gRPC

### 🎭 Service `ChatService`

| Méthode                                                                  | Type                     | Description                               |
| ------------------------------------------------------------------------ | ------------------------ | ----------------------------------------- |
| `GetUser(GetUserRequest) returns (GetUserResponse)`                      | Unary                    | Récupérer un utilisateur                  |
| `Chat(stream ChatStream) returns (stream ChatStream)`                    | Streaming bidirectionnel | Communication en temps réel               |
| `GetChatHistory(GetChatHistoryRequest) returns (GetChatHistoryResponse)` | Unary                    | Récupération de l'historique des messages |

## 🎯 Contribution

1. Forkez ce dépôt 📌
2. Créez une branche avec votre fonctionnalité : `git checkout -b feature/ma-fonctionnalite`
3. Faites vos modifications et commitez : `git commit -m "Ajout d'une nouvelle fonctionnalité"`
4. Poussez votre branche : `git push origin feature/ma-fonctionnalite`
5. Créez une Pull Request 🔥


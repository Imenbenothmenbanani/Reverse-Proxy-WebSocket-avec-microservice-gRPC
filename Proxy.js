const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const WebSocket = require('ws');
const path = require('path');

// Chemin vers le fichier proto
const PROTO_PATH = path.join(__dirname, 'chat.proto');

// Chargement du fichier proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;

// Fonction pour créer un client gRPC
function createGrpcClient() {
  return new chatProto.ChatService('localhost:50051', grpc.credentials.createInsecure());
}

// Création d'un serveur WebSocket servant de reverse proxy
const wss = new WebSocket.Server({ port: 8081 });
console.log('Reverse proxy WebSocket en écoute sur ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('Nouveau client WebSocket connecté.');

  // Pour chaque client, créer un stream gRPC bidirectionnel
  const grpcClient = createGrpcClient();
  const grpcStream = grpcClient.Chat();

  // Relayer les messages reçus du serveur gRPC vers le client WebSocket
  grpcStream.on('data', (chatStreamMessage) => {
    console.log('Message reçu du serveur gRPC:', chatStreamMessage);
    ws.send(JSON.stringify(chatStreamMessage));
  });

  grpcStream.on('error', (err) => {
    console.error('Erreur dans le stream gRPC:', err);
    ws.send(JSON.stringify({ error: err.message }));
  });

  grpcStream.on('end', () => {
    console.log('Stream gRPC terminé.');
    ws.close();
  });

  // Relayer les messages reçus du client WebSocket vers le serveur gRPC
  ws.on('message', (message) => {
    console.log('Message brut reçu:', message);  // Log du message brut
    try {
        const parsed = JSON.parse(message);
        console.log('Message parsé:', parsed);  // Log du message parsé
        
        // Le reste du code reste identique
        if (parsed.get_history) {
            console.log('Requête historique reçue');  // Log de la requête d'historique
            const { room_id, limit } = parsed.get_history;
            const grpcClientForHistory = createGrpcClient();
            
            grpcClientForHistory.GetChatHistory({ room_id, limit }, (error, response) => {
                if (error) {
                    console.error('Erreur récupération historique:', error);
                    ws.send(JSON.stringify({ error: error.message }));
                } else {
                    console.log('Historique récupéré:', response);  // Log de l'historique
                    ws.send(JSON.stringify({ history: response.messages }));
                }
            });
        } else {
            grpcStream.write(parsed);
        }
    } catch (err) {
        console.error('Erreur conversion message:', err);
        ws.send(JSON.stringify({ error: 'Format JSON invalide' }));
    }
});

  ws.on('close', () => {
    console.log('Client WebSocket déconnecté, fermeture du stream gRPC.');
    grpcStream.end();
  });

  // Ajout de la méthode pour récupérer l'historique des messages
  ws.on('get_history', (data) => {
    const { room_id, limit } = data;
    const grpcClientForHistory = createGrpcClient();
    grpcClientForHistory.GetChatHistory({ room_id, limit }, (error, response) => {
      if (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        ws.send(JSON.stringify({ error: error.message }));
      } else {
        ws.send(JSON.stringify({ history: response.messages }));
      }
    });
  });
});
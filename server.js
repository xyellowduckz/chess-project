const WebSocket = require('ws'); // WebSocket kütüphanesini yükle
     const wss = new WebSocket.Server({ port: 8080 }); // 8080 portunda sunucu başlat

     wss.on('connection', function connection(ws) {
         console.log('Yeni bir istemci bağlandı!');

         // İstemciden gelen mesajları dinle
         ws.on('message', function incoming(message) {
             console.log('Alınan mesaj:', message);

             // Tüm bağlı istemcilere mesajı gönder
             wss.clients.forEach(function each(client) {
                 if (client !== ws && client.readyState === WebSocket.OPEN) {
                     client.send(message);
                 }
             });
         });
     });

     console.log('WebSocket sunucusu ws://localhost:8080 adresinde çalışıyor.');
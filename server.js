const WebSocket = require('ws');

// WebSocketサーバーをポート8080で起動
const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocketサーバーがポート8080で起動しました");

// 全ての接続中のWebSocketクライアントを保持する配列
const clients = [];

wss.on("connection", function connection(ws) {
  console.log("クライアントが接続しました");
  
  // 新しく接続されたクライアントを配列に追加
  clients.push(ws);

  ws.on("message", function incoming(message) {
    console.log("受信メッセージ: %s", message);

    // このサーバーに接続している全てのクライアントにメッセージを送信（ブロードキャスト）
    clients.forEach(function(client) {
      // 接続がまだ開いているクライアントのみに送信
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${message}`);
      }
    });
  });

  // クライアントの接続が閉じたときの処理
  ws.on("close", function() {
    console.log("クライアントが切断しました");
    // 切断されたクライアントを配列から削除
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });

  ws.send("WebSocketサーバーに接続されました");
});

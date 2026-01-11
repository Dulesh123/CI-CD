import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { prisma } from "db/client";

dotenv.config();

const PORT = Number(process.env.WS_PORT) || 4000;

// Create WebSocket server (standalone)
const wss = new WebSocketServer({ port: PORT });

console.log(`🧩 WebSocket server running on ws://localhost:${PORT}`);

function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

wss.on("connection", (ws) => {
  console.log("🟢 WS client connected");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());

      // Client → { action: "GET_USERS" }
      if (data.action === "GET_USERS") {
        const users = await prisma.user.findMany();

        ws.send(
          JSON.stringify({
            type: "USERS_LIST",
            payload: users,
          })
        );
      }

      // Optional: create user via WS
      if (data.action === "CREATE_USER") {
        const user = await prisma.user.create({
          data: {
            name: `user_${randomString(5)}`,
            email: `${randomString(6)}@example.com`,
          },
        });

        const users = await prisma.user.findMany();

        ws.send(
          JSON.stringify({
            type: "USER_CREATED",
            payload: users,
          })
        );
      }
    } catch (err) {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          message: "Invalid message format",
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("🔴 WS client disconnected");
  });
});

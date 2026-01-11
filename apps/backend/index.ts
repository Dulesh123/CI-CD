import express  from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "db/client";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Utility function
function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Log once to verify env is loaded
console.log("DATABASE_URL =", process.env.DATABASE_URL);

console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);

// 1️⃣ GET /
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World");
});

// 2️⃣ POST /user → Create random user
app.post("/user", async (_req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: `user_${randomString(5)}`,
        email: `${randomString(6)}@example.com`,
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    console.error("User Create Error:", error);

    res.status(500).json({
      message: error.message,
      code: error.code,
    });
  }
});
// GET /user → get all users
app.get("/user", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany(); // fetch all users
    res.status(200).json(users);
  } catch (error: any) {
    console.error("User Fetch Error:", error);
    res.status(500).json({
      message: error.message,
      code: error.code,
    });
  }
});


// 3️⃣ POST /todo → Create random todo for userId = 1
app.post("/todo", async (_req: Request, res: Response) => {
  try {
    const todo = await prisma.todo.create({
      data: {
        title: `Todo_${randomString(6)}`,
        completed: Math.random() > 0.5,
        userId:1,
      },
    });

    res.status(201).json(todo);
  } catch (error: any) {
    if (error.code === "P2003") {
      res.status(404).json({
        message: "User with ID 1 does not exist. Create a user first.",
      });
    } else {
      res.status(500).json({
        message: error.message,
        code: error.code,
      });
    }
  }
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


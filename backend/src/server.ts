import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { pool } from "./db/pool";

const app = express();
const PORT = process.env.PORT ?? 4000;


app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", database: "not connected", detail: (err as Error).message });
  }
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Sakuku backend jalan di http://localhost:${PORT}`);
});

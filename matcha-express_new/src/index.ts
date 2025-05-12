import cors from "cors";
import http from "http";
import db from "./database/db";
import { initSocket } from "./socket";
import { PORT } from "./config/config";
import express, { Response } from "express";
import authRoutes from "./routes/authRoute";
import userRoutes from "./routes/userRoute";
import likeRoutes from "./routes/likeRoute";
import chatRoutes from "./routes/chatRoute";
import matchRoutes from "./routes/matchRoute";
import blockRoutes from "./routes/blockRoute";
import { errorHandler } from "./middleware/errorHandler";
import { authenticateUser } from "./middleware/authMiddleware";

const app = express();
app.use(cors());

const server = http.createServer(app);
initSocket(server);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateUser, userRoutes);
app.use("/api/block", authenticateUser, blockRoutes);
app.use("/api/like", authenticateUser, likeRoutes);
app.use("/api/match", authenticateUser, matchRoutes);
app.use("/api/chat", authenticateUser, chatRoutes);

(async () => {
	try {
		const result = await db.query("SELECT NOW()");
		console.log("✅ Connected! Server time is:", result.rows[0].now);
	} catch (err: any) {
		console.error("❌ Connection failed:", err.message);
		process.exit(1);
	}
})();

server.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(errorHandler);

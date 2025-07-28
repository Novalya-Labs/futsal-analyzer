import "dotenv/config";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";
import { env } from "./configs/env";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	console.log("Client connected");

	// Lance FFmpeg pour capturer la webcam
	const ffmpeg = spawn("ffmpeg", [
		"-f",
		"avfoundation", // macOS (adapter selon OS)
		"-framerate",
		"10",
		"-i",
		"0", // webcam index
		"-vf",
		"scale=640:360",
		"-f",
		"mjpeg",
		"pipe:1",
	]);

	ffmpeg.stdout.on("data", (chunk) => {
		// Envoie chaque frame en base64 au front
		const base64Frame = `data:image/jpeg;base64,${chunk.toString("base64")}`;
		socket.emit("frame", base64Frame);
	});

	ffmpeg.stderr.on("data", (err) => {
		console.error("FFmpeg error:", err.toString());
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
		ffmpeg.kill("SIGKILL");
	});
});

server.listen(env.server.port, () => {
	console.log(`Server running on http://localhost:${env.server.port}`);
});

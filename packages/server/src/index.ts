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

	let buffer = Buffer.alloc(0);

	const ffmpeg = spawn("ffmpeg", [
		"-f",
		"avfoundation",
		"-framerate",
		"30",
		"-video_size",
		"640x480",
		"-i",
		"0",
		"-vf",
		"scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:(ow-iw)/2:(oh-ih)/2",
		"-f",
		"mjpeg",
		"-q:v",
		"5",
		"pipe:1",
	]);

	ffmpeg.stdout.on("data", (chunk) => {
		buffer = Buffer.concat([buffer, chunk]);

		const start = buffer.indexOf(Buffer.from([0xff, 0xd8]));
		while (start !== -1) {
			const end = buffer.indexOf(Buffer.from([0xff, 0xd9]), start);
			if (end === -1) break;

			const jpg = buffer.subarray(start, end + 2);
			buffer = buffer.subarray(end + 2); // on enlève la frame du buffer
			const base64Frame = `data:image/jpeg;base64,${jpg.toString("base64")}`;
			socket.emit("frame", base64Frame);
		}
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

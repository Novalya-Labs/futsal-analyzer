import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { env } from "@/configs/env";

const socket = io(env.server.websocket.url);

export default function LiveStream() {
	const [frame, setFrame] = useState<string>();

	useEffect(() => {
		socket.on("frame", (data: string) => setFrame(data));
		return () => {
			socket.off("frame");
		};
	}, []);

	return (
		<div className="flex justify-center items-center bg-black w-full h-full">
			{frame ? <img src={frame} alt="live stream" className="rounded-md" /> : <p>Loading...</p>}
		</div>
	);
}

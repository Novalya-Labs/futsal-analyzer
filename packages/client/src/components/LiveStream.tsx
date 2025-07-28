import * as handpose from "@tensorflow-models/handpose";
import { useEffect, useRef } from "react";
import "@tensorflow/tfjs";
import { drawHandSkeleton } from "@/configs/hands";

export default function LiveStream() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const init = async () => {
			const video = videoRef.current!;
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			video.srcObject = stream;
			await video.play();

			const model = await handpose.load();
			const canvas = canvasRef.current!;
			const ctx = canvas.getContext("2d")!;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			const detect = async () => {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const predictions = await model.estimateHands(video);
				if (predictions.length > 0) {
					predictions.forEach((pred) => drawHandSkeleton(ctx, pred.landmarks as number[][]));
				}
				requestAnimationFrame(detect);
			};
			detect();
		};
		init();
	}, []);

	return (
		<div className="flex justify-center items-center bg-black w-full h-full">
			<video ref={videoRef} className="hidden" aria-label="Video feed from webcam" autoPlay muted playsInline />
			<canvas ref={canvasRef} className="w-full h-full object-contain" aria-label="Hand pose detection visualization" />
		</div>
	);
}

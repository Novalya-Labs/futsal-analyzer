import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef } from "react";
import "@tensorflow/tfjs-backend-webgl";
import * as posedetection from "@tensorflow-models/pose-detection";

export default function BodyDetection() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rafRef = useRef<number>(0);

	useEffect(() => {
		let detector: posedetection.PoseDetector | null = null;
		let stream: MediaStream | null = null;

		const init = async () => {
			// 1) Backend TFJS
			await tf.setBackend("webgl");
			await tf.ready();

			// 2) Webcam
			const video = videoRef.current!;
			stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
					facingMode: "user",
				},
				audio: false,
			});
			video.srcObject = stream;
			video.muted = true;
			video.playsInline = true;

			// Attendre les métadonnées pour récupérer videoWidth/Height
			await new Promise<void>((resolve) => {
				const handler = () => {
					video.removeEventListener("loadedmetadata", handler);
					resolve();
				};
				video.addEventListener("loadedmetadata", handler);
			});

			await video.play();

			// 3) Canvas sizing (attention au DPR)
			const canvas = canvasRef.current!;
			const ctx = canvas.getContext("2d")!;
			const dpr = window.devicePixelRatio || 1;

			canvas.style.width = `${video.videoWidth}px`;
			canvas.style.height = `${video.videoHeight}px`;
			canvas.width = Math.floor(video.videoWidth * dpr);
			canvas.height = Math.floor(video.videoHeight * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			// 4) Create detector
			detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
				modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
				enableSmoothing: true,
			});

			// 5) Loop
			const render = async () => {
				ctx.drawImage(video, 0, 0, canvas.width / dpr, canvas.height / dpr);

				const poses = await detector!.estimatePoses(video, {
					maxPoses: 1,
					flipHorizontal: true, // miroir si tu veux
				});

				if (poses.length > 0) {
					const keypoints = poses[0].keypoints;
					ctx.strokeStyle = "lime";
					ctx.fillStyle = "red";
					ctx.lineWidth = 2;

					keypoints.forEach((kp) => {
						if ((kp.score ?? 0) > 0.4) {
							ctx.beginPath();
							ctx.arc(kp.x, kp.y, 4, 0, Math.PI * 2);
							ctx.fill();
						}
					});
				}

				rafRef.current = requestAnimationFrame(render);
			};

			render();
		};

		init();

		// Cleanup
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			if (stream) {
				stream.getTracks().forEach((t) => t.stop());
			}
			detector?.dispose?.();
		};
	}, []);

	return (
		<div className="flex justify-center items-center bg-black w-full h-full">
			<video ref={videoRef} className="hidden" aria-label="Video feed from webcam" autoPlay muted playsInline />
			<canvas ref={canvasRef} className="w-full h-full object-contain" aria-label="Body pose detection visualization" />
		</div>
	);
}

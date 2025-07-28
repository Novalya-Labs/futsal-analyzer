export const fingerConnections = [
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 4], // Pouce
	[0, 5],
	[5, 6],
	[6, 7],
	[7, 8], // Index
	[0, 9],
	[9, 10],
	[10, 11],
	[11, 12], // Majeur
	[0, 13],
	[13, 14],
	[14, 15],
	[15, 16], // Annulaire
	[0, 17],
	[17, 18],
	[18, 19],
	[19, 20], // Auriculaire
];

export function drawHandSkeleton(ctx: CanvasRenderingContext2D, landmarks: number[][]) {
	// Points
	for (const [x, y] of landmarks) {
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, 2 * Math.PI);
		ctx.fillStyle = "red";
		ctx.fill();
	}

	// Traits
	ctx.strokeStyle = "lime";
	ctx.lineWidth = 2;
	for (const [startIdx, endIdx] of fingerConnections) {
		const [x1, y1] = landmarks[startIdx];
		const [x2, y2] = landmarks[endIdx];
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
}

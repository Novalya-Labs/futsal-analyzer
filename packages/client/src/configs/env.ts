export const env = {
	app: {
		name: import.meta.env.VITE_APP_NAME || "My App",
	},
	server: {
		websocket: {
			url: import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:8080",
		},
	},
} as const;

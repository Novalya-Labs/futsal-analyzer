/// <reference types="vite/client" />

interface ViteTypeOptions {
	strictImportMetaEnv: boolean;
}

interface ImportMetaEnv {
	readonly VITE_APP_NAME: string;
	readonly VITE_APP_URL: string;
	readonly VITE_WEBSOCKET_URL: string;
	readonly VITE_AUTHOR_WEBSITE: string;
	readonly VITE_APP_KEY: string;
	readonly VITE_PWA_NAME: string;
	readonly VITE_PWA_SHORT_NAME: string;
	readonly VITE_PWA_DESCRIPTION: string;
	readonly VITE_PWA_THEME_COLOR: string;
	readonly VITE_PWA_BACKGROUND_COLOR: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

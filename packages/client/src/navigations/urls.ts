export const publicRoutes = {
	home: "/",
	notFound: "*",
} as const;

export const routes = {
	...publicRoutes,
} as const;

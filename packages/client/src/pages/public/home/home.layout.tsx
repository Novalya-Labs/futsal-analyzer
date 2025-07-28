import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<div className="h-screen w-screen flex flex-col bg-background text-foreground">
			{/* Header */}
			<header className="h-14 border-b px-4 flex items-center justify-between">
				<h1 className="text-xl font-bold">Futsal Analyzer</h1>
				<Button variant="outline">Test</Button>
			</header>

			{/* Content */}
			<main className="flex-1 overflow-hidden">{children}</main>
		</div>
	);
}

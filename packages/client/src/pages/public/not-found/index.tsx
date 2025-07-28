import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { publicRoutes } from "@/navigations/urls";

export default function NotFoundPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
			<h1 className="text-6xl font-bold text-gray-200 mb-4">Not Found</h1>
			<h2 className="text-2xl font-semibold text-gray-300 mb-6">Page not found</h2>
			<p className="text-gray-400 max-w-md mb-8">The page you are looking for does not exist.</p>
			<Link to={publicRoutes.home}>
				<Button variant="outline" size="lg">
					Go to home
				</Button>
			</Link>
		</div>
	);
}

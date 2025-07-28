import { Outlet } from "react-router-dom";

export default function PublicLayout() {
	return (
		<div className="flex min-h-screen">
			<Outlet />
		</div>
	);
}

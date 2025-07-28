import BodyDetection from "@/components/BodyDetection";
import HomeLayout from "./home.layout";

export default function HomePage() {
	return (
		<HomeLayout>
			{/* <LiveStream /> */}
			<BodyDetection />
		</HomeLayout>
	);
}

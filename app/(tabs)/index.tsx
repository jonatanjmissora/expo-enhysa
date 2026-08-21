import Hero from "@/components/Inicio/Hero";
import Landing from "@/components/Inicio/Landing";
import { ScrollView, useWindowDimensions } from "react-native";

export default function Index() {
	const { width, height } = useWindowDimensions();

	return (
		<ScrollView
			contentContainerStyle={{
				minHeight: height * 1.5,
				marginTop: 150,
			}}
			style={{
				backgroundColor: "#152436ff",
			}}
		>
			<Hero width={width} height={height} />

			<Landing />
		</ScrollView>
	);
}

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import type { Href } from "expo-router/build/typed-routes/types";
import { Pressable, Text, View } from "react-native";
import HeroImage from "../../assets/images/hero.webp";
import ImageViewer from "../ImageViewer";

type ItemProps = {
	id: string;
	title: string;
	icon: keyof typeof Ionicons.glyphMap;
	link: Href;
};

const items: ItemProps[] = [
	{ id: "1", title: "Iluminación", icon: "bulb-outline", link: "/iluminacion" },
	{ id: "2", title: "Sonido", icon: "musical-notes-outline", link: "/sonido" },
	{ id: "3", title: "Teoria", icon: "book-outline", link: "/teoria" },
];

export default function Hero({
	width,
	height,
}: {
	width: number;
	height: number;
}) {
	return (
		<View>
			<Text
				style={{
					color: "#ddd",
					fontSize: 32,
					textAlign: "center",
					fontFamily: "system-ui",
					letterSpacing: 1.5,
				}}
			>
				Selecciona tu nuevo informe.
			</Text>
			<ImageViewer
				imgSource={HeroImage}
				style={{
					width,
					height: height * 0.66,
					opacity: 0.75,
				}}
			/>
			<View
				style={{
					position: "absolute",
					bottom: 0,
					width: "100%",
					height: "42%",
				}}
			>
				<HeroIcons />
			</View>
		</View>
	);
}

function HeroIcons() {
	const router = useRouter();

	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: 10,
			}}
		>
			{items.map((item) => (
				<Pressable key={item.id} onPress={() => router.push(item.link)}>
					<View
						style={{
							width: 86,
							aspectRatio: 1,
							backgroundColor: "#ffffffaa",
							borderRadius: 14,
							justifyContent: "center",
							alignItems: "center",
							borderWidth: 1,
							borderColor: "gray",
							boxShadow: "3px 3px 3px #00000050",
							elevation: 5,
						}}
					>
						<Ionicons name={item.icon} size={24} color="black" />
						<Text style={{ color: "#222", fontSize: 14 }}>{item.title}</Text>
					</View>
				</Pressable>
			))}
		</View>
	);
}

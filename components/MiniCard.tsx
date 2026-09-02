import { View, Text } from "react-native"
import { theme } from "@/constants/theme"
import ImageViewer from "./ImageViewer"

export default function MiniCard({
	title,
	line1,
	line2,
	line3,
	imagen,
}: {
	title: string
	line1?: string
	line2?: string
	line3?: string
	imagen?: string
}) {
	return (
		<View
			style={{
				padding: 16,
				gap: 2,
				borderWidth: 1,
				borderColor: theme.orangeAlpha,
				backgroundColor: theme.gray,
				borderRadius: 4,
				width: "100%",
			}}
		>
			<Text
				style={{
					color: theme.orange,
					fontWeight: "600",
					fontSize: 18,
					textAlign: "center",
				}}
			>
				{title?.toUpperCase()}
			</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 6,
					width: "100%",
				}}
			>
				<View>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{line1?.toUpperCase()}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{line2?.toUpperCase()}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{line3?.toUpperCase()}
					</Text>
				</View>
				{imagen ? (
					<ImageViewer
						imgSource={{ uri: imagen }}
						style={{
							height: 50,
							aspectRatio: 4 / 3,
							borderRadius: 4,
						}}
					/>
				) : null}
			</View>
		</View>
	)
}

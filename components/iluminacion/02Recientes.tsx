import { theme } from "@/constants/theme"
import { LinearGradient } from "expo-linear-gradient"
import { View, Text } from "react-native"
import Button from "../Button"

export default function Recientes() {
	return (
		<View
			style={{
				paddingVertical: 120,
				paddingHorizontal: 0,
			}}
		>
			<LinearGradient
				colors={[theme.footerBG, "transparent"]}
				style={{
					flex: 1,
					position: "absolute",
					top: -1,
					left: 0,
					height: 100,
					width: "100%",
					zIndex: 1,
				}}
			/>

			<View style={{ paddingHorizontal: 30, gap: 40 }}>
				<Text
					style={{
						fontWeight: 600,
						letterSpacing: 1.5,
						color: "#ccc",
						fontSize: 20,
						gap: 20,
					}}
				>
					Informes Recientes
				</Text>

				<InformesIluminacion qnt={3} />

				<View
					style={{
						width: "100%",
						borderTopWidth: 1,
						borderTopColor: theme.orangeAlpha,
						opacity: 0.6,
					}}
				>
					<Button
						text="ver todos"
						onPress={() => {}}
						variant="ghost"
						style={{
							alignSelf: "flex-end",
							padding: 2,
						}}
					/>
				</View>

				<Button
					iconLeft="add-sharp"
					text="Nuevo Informe"
					onPress={() => {}}
					style={{
						marginHorizontal: "auto",
						marginVertical: 12,
						marginTop: 40,
						width: "90%",
					}}
				/>
			</View>
			<Button
				variant="ghost"
				text="Mi primer Informe"
				onPress={() => {}}
				style={{
					alignSelf: "flex-end",
					marginVertical: 20,
					opacity: 0.5,
				}}
				textStyle={{
					textDecorationLine: "underline",
				}}
			/>
		</View>
	)
}

function InformesIluminacion({ qnt }: { qnt: number }) {
	const INFORMES_ILUMINACION = [
		{
			id: "1",
			title: "Telefonica - Beruti 72",
			date: "20/07/2025",
			direccion: "Beruti 72",
			localidad: "Bahia Blanca",
			provincia: "Buenos Aires",
		},
		{
			id: "2",
			title: "Fravega - Donado 70",
			date: "26/07/2025",
			direccion: "Donado 70",
			localidad: "Bahia Blanca",
			provincia: "Buenos Aires",
		},
	]

	return (
		<View>
			{INFORMES_ILUMINACION.map(informe => (
				<InformeCard key={informe.id} informe={informe} />
			))}
		</View>
	)
}

function InformeCard({ informe }: { informe: any }) {
	return (
		<View
			style={{
				padding: 20,
				marginBottom: 20,
				borderWidth: 1,
				borderColor: theme.orangeAlpha,
				borderRadius: 6,
				gap: 4,
				backgroundColor: theme.grayPressed,
				maxWidth: 600,
			}}
		>
			<Text
				style={{
					fontWeight: 600,
					fontSize: 20,
					color: theme.orange,
					textAlign: "center",
					gap: 0,
				}}
			>
				{informe.title}
			</Text>
			<View style={{ flexDirection: "row", gap: 20, justifyContent: "center" }}>
				<Text
					style={{
						textAlign: "center",
						color: "#ddd",
					}}
				>
					{informe.date}
				</Text>
				<Text style={{ textAlign: "center", color: "#ddd" }}>
					{informe.direccion}
				</Text>
			</View>
			<View style={{ flexDirection: "row", gap: 20, justifyContent: "center" }}>
				<Text style={{ textAlign: "center", color: "#ddd" }}>
					{informe.localidad}
				</Text>
				<Text style={{ textAlign: "center", color: "#ddd" }}>
					{informe.provincia}
				</Text>
			</View>
		</View>
	)
}

/* <div className="flex justify-between items-center flex-col mt-[70px] sm:mt-10 h-[550px] sm:h-[450px] relative overflow-visible px-6 sm:w-2/3 mx-auto">
				<p className="text-[26px] text-center tracking-wider text-pretty px-0">
					Informes de iluminación SRT 84/12.
				</p>
				<img
					src="/movil-hero-light-meter.webp"
					alt="logo EnHySa"
					className="absolute opacity-75 top-6 left-0 w-screen sm:w-full h-[500px] sm:h-[400px] bottom-0 -z-10 max-w-none mask-t-from-50% mask-b-from-80% sm:mask-r-from-95% sm:mask-l-from-5% object-cover object-[50%_40%]"
				/>
				<Link
					to="/iluminacion/reportes/$id/crud/create-general"
					params={{
						id,
					}}
					className="py-3 w-11/12 sm:w-1/2 mx-auto tracking-widest font-semibold text-base bg-green-600 rounded-lg flex gap-2 items-center justify-center ring-[1px] ring-foreground/25"
				>
					<FileChartColumn size={20} />
					Nuevo Informe
				</Link>
			</div>

			<Link
				to="/iluminacion/reportes/instructivo"
				search={{
					from: "/iluminacion",
				}}
				className="w-11/12 italic text-foreground-soft tracking-wider text-sm underline text-right"
			>
				Instructivo: Mi primer Informe
			</Link>

			<InformesRecientes />
			*/

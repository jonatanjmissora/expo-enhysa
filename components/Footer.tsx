import { useCallback, useState } from "react"
import {
	Linking,
	Pressable,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import ImageViewer from "./ImageViewer"
import LogoImage from "../assets/images/logo2.png"
import { theme } from "@/constants/theme"

const NAV_ITEMS = [
	{ id: "1", label: "¿Qué es EnHySa App?", to: "landing" },
	{ id: "2", label: "Inicio", to: "hero" },
	{ id: "3", label: "Mi Perfil", to: "/perfil" },
	{ id: "4", label: "Suscripción", to: "/suscripcion" },
	{ id: "5", label: "Debug DB", to: "/debug/db" },
]

const CONTACTOS = [
	{
		label: "soporte",
		icon: "mail-outline",
		href: "mailto:jonatanjmissora@gmail.com",
		color: "#16a34a",
	},
	{
		label: "técnico",
		icon: "mail-outline",
		href: "mailto:mandrake@gmail.com",
		color: "#16a34a",
	},
	{
		label: "soporte",
		icon: "logo-whatsapp",
		href: "https://wa.me/+5492914319025",
		color: "#16a34a",
	},
	{
		label: "técnico",
		icon: "logo-whatsapp",
		href: "https://wa.me/+5492916426547",
		color: "#16a34a",
	},
]

const DESKTOP_CONTACTOS = [
	{
		label: "soporte",
		icon: "mail-outline",
		href: "https://mail.google.com/mail/u/0/?fs=1&to=jonatanjmissora@gmail.com&su=&body=&bcc=&tf=cm",
		color: "#16a34a",
	},
	{
		label: "técnico",
		icon: "mail-outline",
		href: "https://mail.google.com/mail/u/0/?fs=1&to=enhysa.consultora@gmail.com&su=&body=&bcc=&tf=cm",
		color: "#16a34a",
	},
	{
		label: "soporte",
		icon: "logo-whatsapp",
		href: "https://wa.me/+5492914319025",
		color: "#16a34a",
	},
	{
		label: "técnico",
		icon: "logo-whatsapp",
		href: "https://wa.me/+5492914319025",
		color: "#16a34a",
	},
]

export default function Footer({
	scrollTo,
}: {
	scrollTo: (section: string) => void
}) {
	const [soporte, setSoporte] = useState(false)
	const { width } = useWindowDimensions()
	const router = useRouter()
	const isNarrow = width < 600

	const actualYear = new Date().getFullYear()

	return (
		<View style={styles.footer}>
			<View style={styles.logoContainer}>
				<Text style={styles.title}>Mapa del sitio</Text>
			</View>

			<View>
				{NAV_ITEMS.map(item => (
					<Pressable
						key={item.id}
						onPress={() =>
							item.to.includes("/") ? router.push(item.to) : scrollTo(item.to)
						}
						style={styles.navItem}
					>
						<Text style={styles.navText}>{item.label}</Text>
					</Pressable>
				))}
				<Pressable onPress={() => setSoporte(s => !s)} style={styles.navItem}>
					<Text style={styles.navText}>Soporte técnico</Text>
				</Pressable>
				{soporte && (
					<View style={styles.contactosContainer}>
						{isNarrow ? (
							<View
								style={{
									gap: 12,
									flexDirection: "row",
									flexWrap: "wrap",
									justifyContent: "space-evenly",
								}}
							>
								{CONTACTOS.map((item, index) => (
									<ContactoItem key={index} item={item} />
								))}
							</View>
						) : (
							<View
								style={{
									gap: 12,
									flexDirection: "row",
									flexWrap: "wrap",
									justifyContent: "space-evenly",
								}}
							>
								{DESKTOP_CONTACTOS.map((item, index) => (
									<ContactoItem key={index} item={item} />
								))}
							</View>
						)}
					</View>
				)}
			</View>

			<Text style={styles.copy}>
				© {actualYear} Enhysa. Todos los derechos reservados.
			</Text>

			<ImageViewer
				imgSource={LogoImage}
				style={{
					position: "absolute",
					bottom: -10,
					right: -30,
					width: 200,
					height: 200,
					opacity: 0.2,
					transform: [{ rotate: "20deg" }],
					zIndex: -1,
				}}
			/>
		</View>
	)
}

function ContactoItem({
	item,
}: {
	item: { label: string; icon: string; href: string; color: string }
}) {
	const handlePress = useCallback(() => {
		Linking.openURL(item.href)
	}, [item.href])

	return (
		<Pressable onPress={handlePress} style={styles.contactoItem}>
			<Ionicons
				name={item.icon as keyof typeof Ionicons.glyphMap}
				size={18}
				color={item.color}
			/>
			<Text style={styles.contactoText}>{item.label}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	footer: {
		paddingVertical: 32,
		paddingHorizontal: 16,
		backgroundColor: theme.footerBG,
		gap: 16,
		overflow: "hidden",
	},
	logoContainer: {
		alignItems: "center",
	},
	title: {
		color: "#e2e8f0",
		fontSize: 22,
		fontWeight: "600",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(226, 232, 240, 0.2)",
		paddingVertical: 8,
		alignSelf: "stretch",
		fontStyle: "italic",
		letterSpacing: 1.5,
	},
	navContainer: {
		paddingVertical: 8,
		gap: 20,
	},
	navItem: {
		paddingVertical: 14,
	},
	navText: {
		color: "#e2e8f0",
		fontSize: 18,
	},
	contactosContainer: {
		marginTop: 8,
		gap: 12,
	},
	contactosColumn: {
		gap: 12,
	},
	contactosRow: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 32,
	},
	contactoItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		width: "45%",
	},
	contactoText: {
		color: "#eee",
		fontSize: 14,
	},
	copy: {
		color: "#bbb",
		fontSize: 12,
		textAlign: "center",
		marginTop: 16,
	},
})

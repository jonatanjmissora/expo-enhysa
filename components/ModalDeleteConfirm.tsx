import { theme } from "@/constants/theme"
import { Modal, View, Text, StyleSheet } from "react-native"
import Button from "./Button"

export default function ModalDeleteConfirm({
	visible,
	title,
	message,
	onClose,
	onConfirm,
}: {
	visible: boolean
	title: string
	message: string
	onClose: () => void
	onConfirm: () => void
}) {
	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={styles.overlay}>
				<View style={styles.alertBox}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.message}>{message}</Text>

					<View style={styles.actions}>
						<Button
							variant="ghost"
							size="small"
							onPress={onClose}
							style={{ backgroundColor: theme.grayPressed, flex: 1 }}
							text="Cancelar"
						></Button>
						<Button
							variant="danger"
							size="small"
							onPress={onConfirm}
							style={{ flex: 1 }}
							text="Eliminar"
						></Button>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	alertBox: {
		width: 300,
		backgroundColor: theme.gray,
		borderRadius: 16,
		padding: 24,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#ccc",
		marginBottom: 8,
	},
	message: {
		fontSize: 14,
		color: "#aaa",
		textAlign: "center",
		marginBottom: 24,
	},
	actions: {
		flexDirection: "row",
		gap: 12,
		width: "100%",
	},
	button: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	cancel: {
		backgroundColor: "#e2e8f0",
	},
	danger: {
		backgroundColor: "#e63946",
	},
	buttonText: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 16,
	},
})

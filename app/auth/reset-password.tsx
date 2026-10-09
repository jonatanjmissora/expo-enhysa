import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import { ApiError, apiResetPassword } from "@/src/api/client"
import { hashPassword } from "@/src/auth/password"
import {
	defaultResetPassword,
	resetPasswordFormValidator,
} from "@/src/db/schema/users"
import { userRepository } from "@/src/repositories/user.repository"
import { useOnlineGuard } from "@/src/utils/network"
import { useForm } from "@tanstack/react-form"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView, Text, TextInput, View } from "react-native"

const FIELDS = [
	{
		key: "password",
		label: "Nueva contraseña",
		placeholder: "Mínimo 6 caracteres",
	},
	{
		key: "confirmPassword",
		label: "Confirmar contraseña",
		placeholder: "Repetí la contraseña",
	},
] as const

export default function ResetPassword() {
	const router = useRouter()
	const { token } = useLocalSearchParams<{ token?: string }>()
	const tokenParam = Array.isArray(token) ? token[0] : token
	const [error, setError] = useState<string | null>(null)
	const checkOnline = useOnlineGuard()

	const form = useForm({
		defaultValues: defaultResetPassword,
		validators: { onSubmit: resetPasswordFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			if (!tokenParam) {
				setError("Falta el token del link. Pedí un link nuevo.")
				return
			}
			if (
				!(await checkOnline(
					"No podés restablecer la contraseña estando offline. Conectate e intentá de nuevo."
				))
			)
				return

			try {
				const { email } = await apiResetPassword(tokenParam, value.password)
				// Mantiene el login offline consistente con la contraseña nueva.
				const localHash = await hashPassword(value.password)
				await userRepository.updatePasswordHash(email, localHash)
			} catch (e) {
				if (e instanceof ApiError && e.code === "invalid_token") {
					setError("El link expiró o ya fue usado. Pedí uno nuevo.")
					return
				}
				setError(
					e instanceof Error
						? e.message
						: "No se pudo restablecer la contraseña"
				)
				return
			}

			Alert.alert(
				"Contraseña actualizada",
				"Por seguridad, se cerraron las sesiones en todos tus dispositivos. Iniciá sesión de nuevo.",
				[
					{
						text: "Ir a iniciar sesión",
						onPress: () => router.replace("/auth/login"),
					},
				]
			)
		},
		onSubmitInvalid: () => {
			setError("Error en uno de los campos")
		},
	})

	if (!tokenParam) {
		return (
			<ViewWithLogo>
				<ScrollView
					contentContainerStyle={{
						gap: 12,
						padding: 16,
						paddingBottom: 150,
					}}
				>
					<VolverBtn title="Restablecer contraseña" />
					<View style={{ gap: 12, padding: 20 }}>
						<Text style={{ color: "#cbd5e1" }}>
							El link no es válido o está incompleto. Pedí un link nuevo.
						</Text>
						<Button
							text="Pedir link nuevo"
							onPress={() => router.replace("/auth/forgot-password")}
							style={{ marginTop: 20 }}
						/>
						<Button
							variant="ghost"
							text="Volver a iniciar sesión"
							onPress={() => router.replace("/auth/login")}
							textStyle={{ textDecorationLine: "underline" }}
						/>
					</View>
				</ScrollView>
			</ViewWithLogo>
		)
	}

	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					gap: 12,
					padding: 16,
					paddingBottom: 150,
				}}
			>
				<VolverBtn title="Nueva contraseña" />

				<View style={{ gap: 12, padding: 20 }}>
					{FIELDS.map(f => (
						<form.Field key={f.key} name={f.key}>
							{field => (
								<>
									<Text style={{ color: "#cbd5e1" }}>{f.label}</Text>
									<TextInput
										selectTextOnFocus
										value={field.state.value}
										onBlur={field.handleBlur}
										onChangeText={field.handleChange}
										placeholder={f.placeholder}
										placeholderTextColor="#64748b"
										autoCapitalize="none"
										autoCorrect={false}
										style={{
											backgroundColor: theme.inputBG,
											color: "#e2e8f0",
											padding: 12,
											borderRadius: 6,
											borderWidth: 1,
											borderColor: theme.inputBorder,
										}}
									/>
									{!field.state.meta.isValid && (
										<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
											{field.state.meta.errors
												.map(err =>
													typeof err === "string"
														? err
														: (err?.message ?? String(err))
												)
												.join(",")}
										</Text>
									)}
								</>
							)}
						</form.Field>
					))}

					<form.Subscribe selector={state => state.isSubmitting}>
						{isSubmitting => (
							<Button
								onPress={form.handleSubmit}
								text={isSubmitting ? "Guardando..." : "Restablecer contraseña"}
								disabled={isSubmitting}
								style={{ marginTop: 20 }}
							/>
						)}
					</form.Subscribe>

					{error && (
						<Text style={{ color: "#fc4444", textAlign: "center" }}>
							{error}
						</Text>
					)}
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}

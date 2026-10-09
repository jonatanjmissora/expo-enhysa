import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import { apiForgotPassword } from "@/src/api/client"
import { normalizeEmail } from "@/src/auth/auth.service"
import {
	defaultForgotPassword,
	forgotPasswordFormValidator,
} from "@/src/db/schema/users"
import { useOnlineGuard } from "@/src/utils/network"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, TextInput, View } from "react-native"

export default function ForgotPassword() {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)
	const [sent, setSent] = useState(false)
	const checkOnline = useOnlineGuard()

	const form = useForm({
		defaultValues: defaultForgotPassword,
		validators: { onSubmit: forgotPasswordFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			if (
				!(await checkOnline(
					"No podés recuperar la contraseña estando offline. Conectate e intentá de nuevo."
				))
			)
				return
			try {
				await apiForgotPassword(normalizeEmail(value.email))
			} catch (e) {
				setError(e instanceof Error ? e.message : "No se pudo enviar el link")
				return
			}
			setSent(true)
		},
		onSubmitInvalid: () => {
			setError("Error en uno de los campos")
		},
	})

	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					gap: 12,
					padding: 16,
					paddingBottom: 150,
				}}
			>
				<VolverBtn title="Olvidé mi contraseña" />

				<View style={{ gap: 12, padding: 20 }}>
					{sent ? (
						<>
							<Text style={{ color: "#cbd5e1" }}>
								Si el email existe, te enviamos un link para restablecer tu
								contraseña. Revisá tu correo y seguí el enlace. Expira en 10
								minutos y es de un solo uso.
							</Text>
							<Button
								text="Volver a iniciar sesión"
								onPress={() => router.replace("/auth/login")}
								style={{ marginTop: 20 }}
							/>
						</>
					) : (
						<>
							<Text style={{ color: "#cbd5e1" }}>
								Ingresá tu email y te enviaremos un link para restablecer tu
								contraseña.
							</Text>

							<form.Field name="email">
								{field => (
									<>
										<Text style={{ color: "#cbd5e1" }}>Email</Text>
										<TextInput
											selectTextOnFocus
											value={field.state.value}
											onBlur={field.handleBlur}
											onChangeText={field.handleChange}
											placeholder="usuario@gmail.com"
											placeholderTextColor="#64748b"
											autoCapitalize="none"
											autoCorrect={false}
											keyboardType="email-address"
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

							<form.Subscribe selector={state => state.isSubmitting}>
								{isSubmitting => (
									<Button
										onPress={form.handleSubmit}
										text={isSubmitting ? "Enviando..." : "Enviar link"}
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

							<Button
								variant="ghost"
								text="Volver a iniciar sesión"
								onPress={() => router.replace("/auth/login")}
								textStyle={{ textDecorationLine: "underline" }}
							/>
						</>
					)}
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}

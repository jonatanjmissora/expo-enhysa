import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import { login } from "@/src/auth/auth.service"
import type { UserType } from "@/src/repositories/user.repository"
import { defaultLogin, loginFormValidator } from "@/src/db/schema/users"
import { useSession } from "@/src/session/session-context"
import { useForm } from "@tanstack/react-form"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView, Text, TextInput, View } from "react-native"

const FIELDS = [
	{
		key: "email",
		label: "Email",
		placeholder: "usuario@gmail.com",
		secure: false,
	},
	{
		key: "password",
		label: "Contraseña",
		placeholder: "••••••",
		secure: true,
	},
] as const

export default function Login() {
	const router = useRouter()
	const { from } = useLocalSearchParams<{ from?: string }>()
	const { setActiveUser } = useSession()
	const [error, setError] = useState<string | null>(null)

	const fromParam = Array.isArray(from) ? from[0] : from

	const goToOrigin = () => {
		if (fromParam) {
			router.dismissTo(fromParam)
			return
		}
		if (router.canGoBack()) {
			router.back()
			return
		}
		router.replace("/")
	}

	const form = useForm({
		defaultValues: defaultLogin,
		validators: { onSubmit: loginFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			let user: UserType
			try {
				user = await login(value.email, value.password)
			} catch (e) {
				setError(e instanceof Error ? e.message : "No se pudo iniciar sesión")
				return
			}
			try {
				await setActiveUser(user.id)
			} catch {
				Alert.alert("No se pudo guardar la sesión", "Volvé a ingresar.")
				return
			}
			goToOrigin()
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
				<VolverBtn title="Iniciar sesión" />

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
										secureTextEntry={f.secure}
										autoCapitalize={f.key === "email" ? "none" : undefined}
										autoCorrect={false}
										keyboardType={
											f.key === "email" ? "email-address" : "default"
										}
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
								text={isSubmitting ? "Ingresando..." : "Ingresar"}
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
						text="Crear una cuenta"
						onPress={() =>
							router.replace({
								pathname: "/auth/register",
								params: fromParam ? { from: fromParam } : undefined,
							})
						}
					/>
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}

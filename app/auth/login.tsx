import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import { login } from "@/src/auth/auth.service"
import { defaultLogin, loginFormValidator } from "@/src/db/schema/users"
import { useSession } from "@/src/session/session-context"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Text, TextInput, View } from "react-native"
import LogoImage from "../../assets/images/logo2.png"

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
	const { setActiveUser } = useSession()
	const [passwordVisible, setPasswordVisible] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [mailError, setMailError] = useState<string | null>(null)
	const [passError, setPassError] = useState<string | null>(null)

	const form = useForm({
		defaultValues: defaultLogin,
		validators: { onSubmit: loginFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			setMailError(null)
			setPassError(null)
			try {
				const user = await login(value.email, value.password)
				await setActiveUser(user.id)
				if (router.canGoBack()) {
					router.back()
				} else {
					router.replace("/")
				}
			} catch (e) {
				setError(e instanceof Error ? e.message : "No se pudo iniciar sesión")
			}
		},
		onSubmitInvalid: () => {
			setError("Error en uno de los campos")
		},
	})

	return (
		<ViewWithLogo>
			<Button
							variant="ghost"
							iconLeft="chevron-back"
							text="Volver"
							style={{
								alignSelf: "flex-start",
								paddingHorizontal: 20,
								opacity: 0.85,
								padding: 4,
							}}
							onPress={() => router.push("/")}
							/>

			<View
				style={{
					flex: 1,
					paddingHorizontal: 40,
					alignContent: "center",
					marginTop: 100,
				}}
			>

				<View style={{ gap:  30 }}>
<form.Field name="email" >
	{field => (
		<View style={{ gap: 6 }}>
									<Text style={{ color: "#cbd5e1" }}>Email</Text>
									<TextInput
										value={field.state.value}
										onBlur={field.handleBlur}
										onChangeText={field.handleChange}
										placeholder="usuario@gmail.com"
										placeholderTextColor="#64748b"
										secureTextEntry={false}
										autoCapitalize="none"
										autoCorrect={false}
										keyboardType="email-address"
										style={{
											backgroundColor: theme.inputBG,
											color: "#e2e8f0",
											padding: 12,
											borderRadius: 6,
											borderWidth: 1,
											borderColor: theme.inputBorder
										}}
									/>
									{mailError && (
						<Text style={{ color: "#fc4444", textAlign: "center" }}>
							{mailError}
						</Text>
					)}
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
								</View>
	)}
</form.Field>
<form.Field name="password" >
	{field => (
		<View style={{ gap: 6 }}>
									<Text style={{ color: "#cbd5e1" }}>Contraseña</Text>
									<View style={{ position: "relative" }}>

									<TextInput
										value={field.state.value}
										onBlur={field.handleBlur}
										onChangeText={field.handleChange}
										placeholder="••••••••"
										placeholderTextColor="#64748b"
										secureTextEntry={passwordVisible}
										autoCapitalize="none"
										autoCorrect={false}
										keyboardType="default"
										style={{
											backgroundColor: theme.inputBG,
											color: "#e2e8f0",
											padding: 12,
											borderRadius: 6,
											borderWidth: 1,
											borderColor: theme.inputBorder
										}}
										/>
										<Button
											onPress={() => setPasswordVisible(!passwordVisible)}
											iconLeft={passwordVisible ? "eye" : "eye-off"}
											iconSize={16}
											iconColor={"#999"}
											variant="ghost"
											style={{
												position: "absolute",
												right: 0,
												top: -5,
											}}
										/>
										</View>
									{passError && (
						<Text style={{ color: "#fc4444", textAlign: "center" }}>
							{passError}
						</Text>
					)}
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
								</View>
	)}
</form.Field>

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
						onPress={() => router.replace("/auth/register")}
						style={{
							zIndex: 10,
							
						}}
						textStyle={{
							color: "#999",
							textDecorationLine: "underline",
							textDecorationStyle: "solid",
						}}
					/>
				</View>
			</View>
			<ImageViewer
				imgSource={LogoImage}
				style={{
					position: "absolute",
					bottom: -50,
					right: -50,
					width: 400,
					height: 400,
					opacity: 0.2,
					transform: [{ rotate: "20deg" }],
					zIndex: 1,
				}}
			/>
		</ViewWithLogo>
	)
}

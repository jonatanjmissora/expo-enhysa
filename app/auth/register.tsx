import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import { register, RegisterError } from "@/src/auth/auth.service"
import { defaultRegister, registerFormValidator } from "@/src/db/schema/users"
import { useSession } from "@/src/session/session-context"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "expo-router"
import { useState } from "react"
import { View, Text, TextInput } from "react-native"
import LogoImage from "../../assets/images/logo2.png"

export default function Register() {
	const router = useRouter()
	const { setActiveUser } = useSession()
	const [passwordVisible, setPasswordVisible] = useState(true)
	const [mailError, setMailError] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const form = useForm({
		defaultValues: defaultRegister,
		validators: { onSubmit: registerFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			setMailError(null)
			try {
				const user = await register(value.email, value.password)
				await setActiveUser(user.id)
				if (router.canGoBack()) {
					router.back()
				} else {
					router.replace("/")
				}
			} catch (e) {
				if (e instanceof RegisterError && e.code === "EMAIL_EXISTS") {
					setMailError(e.message)
				} else {
					setError(
						e instanceof Error ? e.message : "No se pudo crear la cuenta"
					)
				}
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
					marginTop: 70,
				}}
			>
				<View style={{ gap: 30 }}>
					<form.Field name="email">
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
										borderColor: theme.inputBorder,
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

					<form.Field name="password">
						{field => (
							<View style={{ gap: 6 }}>
								<Text style={{ color: "#cbd5e1" }}>Contraseña</Text>
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
										borderColor: theme.inputBorder,
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
										top: 20,
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
							</View>
						)}
					</form.Field>

					<form.Field name="confirmPassword">
						{field => (
							<View style={{ gap: 6 }}>
								<Text style={{ color: "#cbd5e1" }}>Confirmar contraseña</Text>
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
										borderColor: theme.inputBorder,
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
										top: 20,
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
							</View>
						)}
					</form.Field>

					<form.Subscribe selector={state => state.isSubmitting}>
						{isSubmitting => (
							<Button
								onPress={form.handleSubmit}
								text={isSubmitting ? "Creando..." : "Crear cuenta"}
								disabled={isSubmitting}
								style={{ marginTop: 20, zIndex: 10 }}
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
						text="Ya tengo cuenta"
						onPress={() => router.replace("/auth/login")}
						style={{ zIndex: 10 }}
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

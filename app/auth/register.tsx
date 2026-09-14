import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import { register } from "@/src/auth/auth.service"
import { defaultRegister, registerFormValidator } from "@/src/db/schema/users"
import { useSession } from "@/src/session/session-context"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "expo-router"
import { useState } from "react"
import { View, Text, TextInput } from "react-native"
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
		placeholder: "Mínimo 6 caracteres",
		secure: true,
	},
	{
		key: "confirmPassword",
		label: "Confirmar contraseña",
		placeholder: "Repetí la contraseña",
		secure: true,
	},
] as const

export default function Register() {
	const router = useRouter()
	const { setActiveUser } = useSession()
	const [error, setError] = useState<string | null>(null)

	const form = useForm({
		defaultValues: defaultRegister,
		validators: { onSubmit: registerFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			try {
				const user = await register(value.email, value.password)
				await setActiveUser(user.id)
				if (router.canGoBack()) {
					router.back()
				} else {
					router.replace("/")
				}
			} catch (e) {
				setError(e instanceof Error ? e.message : "No se pudo crear la cuenta")
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
					{FIELDS.map(f => (
						<form.Field key={f.key} name={f.key}>
							{field => (
								<View style={{ gap: 6 }}>
									<Text style={{ color: "#cbd5e1" }}>{f.label}</Text>
									<TextInput
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
								</View>
							)}
						</form.Field>
					))}

					<form.Subscribe selector={state => state.isSubmitting}>
						{isSubmitting => (
							<Button
								onPress={form.handleSubmit}
								text={isSubmitting ? "Creando..." : "Crear cuenta"}
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
						text="Ya tengo cuenta"
						onPress={() => router.replace("/auth/login")}
						style={{zIndex: 10}}
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

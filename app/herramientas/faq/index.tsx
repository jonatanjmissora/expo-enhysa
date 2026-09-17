import ViewWithLogo from '@/components/ViewWithLogo'
import { theme } from '@/constants/theme'
import { Link } from 'expo-router'
import { View, Text, ScrollView } from 'react-native'

export default function FaqScreen() {
  return (
	<ViewWithLogo>
				<ScrollView
					style={{ flex: 1, gap:24 }}
					contentContainerStyle={{
						width: "92%",
						alignSelf: "center",
						paddingBottom: 120,
					}}
				>
					<Text>FaqScreen</Text>
				</ScrollView>
			</ViewWithLogo>
  )
}

function FaqItem1(){
	return (
		<View style={{borderBottomWidth: 1, borderBottomColor: theme.orangeAlpha, padding: 8, borderRadius: 10, gap: 8}}>
			<Text style={{fontSize: 18, color: theme.orange, textAlign: "left", fontWeight: "bold"}}>¿Qué me brinda EnHySa app?</Text>
			<Text style={{fontSize: 16, color: "#aaa", textAlign: "left"}}>EnHySa App esta destinada a facilitarle la tarea de preparar y confexionar los informes relacionados con seguridad e higiene. Desde la toma de mediciones, confexion de tablas, calculo de formulas y generacion del PDF final de entrega a tus empresas.</Text>
			<Text style={{fontSize: 16, color: "#aaa", textAlign: "left"}}>Además brinda un repertorio de herramientas como la elavoracion de <Link href={{pathname: "/herramientas/presupuesto"}}>cotizaciones</Link>, hasta el alquiler de <Link href={{pathname: "/herramientas/alquiler"}}>instrumentos de medicion</Link> necesarios para tu desempeño.</Text>
			<Text style={{fontSize: 16, color: "#aaa", textAlign: "left"}}>Además brinda un repertorio de herramientas como la elavoracion de presupuestos, hasta el alquiler de instrumentos de medicion necesarios para tu desempeño.</Text>
		</View>
	)
}

function FaqItem2(){
	return (
		<View style={{borderBottomWidth: 1, borderBottomColor: theme.orangeAlpha, padding: 8, borderRadius: 10, gap: 8}}>
			<Text style={{fontSize: 18, color: theme.orange, textAlign: "left", fontWeight: "bold"}}>¿Cómo utilizo la app?</Text>
			<Text style={{fontSize: 16, color: "#aaa", textAlign: "left"}}>La app consta de dos partes fundamentales: </Text>
			<Text style={{fontSize: 16, color: "#aaa", textAlign: "left"}}><Text>Primer paso: </Text>completar los datos de "Perfil" correspondientes a Técnico, Empresas e Instrumentos participantes, que seran utilizados en la confexion de los informes.</Text>
			<Text style={{fontSize: 16, color: "#aaa", textAlign: "left"}}><Text>Segundo paso: </Text>elegir el informe y seguir los pasos detallados que te llevaran seccion por seccion hasta completar todos los datos necesarios. Se tendran en cuenta los datos del "Primer paso"</Text>
			<Text style={{fontSize: 16, color: "#aaa", textAlign: "left"}}></Text>
			<Text style={{fontSize: 16, color: "#aaa", textAlign: "left"}}></Text>
		</View>
	)
}
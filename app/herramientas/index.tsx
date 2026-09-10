import Button from "@/components/Button"
import Select from "@/components/Select"
import IluminacionContent from "@/components/teoria/iluminacion"
import {
	TeoriaCard,
	TeoriaList,
	TeoriaParagraph,
	TeoriaSection,
	TeoriaStrong,
	TeoriaTable,
	teoriaColors,
} from "@/components/teoria/ui"
import IluminacionValoresRequeridosContent from "@/components/teoria/valor-requerido"
import ViewWithLogo from "@/components/ViewWithLogo"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { ScrollView, StyleSheet, Text, View } from "react-native"

const TEORIAS = [
	{ id: "iluminacion", label: "Estudio de Iluminación Res. 84/2012 SRT" },
	{
		id: "iluminacionValoresRequeridos",
		label: "➖ Tabla de Valores Requeridos",
	},
	{ id: "ruido", label: "Estudio de Ruido Res. 85/2012 SRT" },
	{ id: "extintores", label: "Control de Extintores, Recarga y PH" },
	{ id: "pat", label: "Estudio de PAT y Continuidad de las Masas" },
	{
		id: "vibraciones",
		label: "Medición de Vibraciones (Cuerpo Entero y Mano-Brazo)",
	},
	{
		id: "capacitaciones",
		label: "Capacitaciones HSE (Fundamentos y Matriz Esencial)",
	},
	{ id: "epp", label: "Control de EPP y EPIS" },
	{ id: "antisiniestral", label: "Informe Antisiniestral" },
	{
		id: "vehiculos",
		label: "Chequeo de Equipos y Vehículos (Checklists Operativos)",
	},
] as const

type TeoriaId = (typeof TEORIAS)[number]["id"]

function RuidoContent() {
	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					<TeoriaStrong>Finalidad: </TeoriaStrong>
					Determinar el nivel de exposición al ruido continuo y de impacto al
					que están sometidos los trabajadores durante su jornada laboral para
					prevenir la Hipoacusia Inducida por Ruido (HIR), así como evaluar el
					impacto sonoro ambiental hacia la comunidad lindante.
				</TeoriaParagraph>
				<TeoriaParagraph>
					<TeoriaStrong>Legislación Aplicable: </TeoriaStrong>
					Ámbito Laboral: Ley N° 19.587, Decreto N° 351/79 (Anexo V, Capítulo
					13) y la Resolución SRT N° 85/12 (Protocolo para la Medición del Ruido
					en el Ambiente de Laboral). Ámbito Ambiental: Norma IRAM 4062 y
					normativas municipales/provinciales específicas.
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection title="Niveles Máximos de Exposición">
				<TeoriaParagraph>
					El Decreto 351/79 (Anexo V) establece los niveles máximos de presión
					sonora permitidos según el tiempo de exposición:
				</TeoriaParagraph>
				<TeoriaTable
					head={["Nivel Sonoro (dBA)", "Tiempo Máximo Permitido"]}
					rows={[
						["85 dBA", "8 horas"],
						["88 dBA", "4 horas"],
						["91 dBA", "2 horas"],
						["94 dBA", "1 hora"],
						["97 dBA", "30 minutos"],
						["100 dBA", "15 minutos"],
						["103 dBA", "7.5 minutos"],
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Interpretación de la Tabla">
				<TeoriaLabeledList
					items={[
						{
							label: "Ruido Continuo",
							text: "Por cada incremento de 3 dBA, el tiempo de exposición máxima se reduce a la mitad (relación de intercambio 1:2). La dosis de ruido no debe superar el 100% en una jornada de 8 horas.",
						},
						{
							label: "Ruido de Impacto",
							text: "No se permite la exposición a niveles pico superiores a 140 dBC. El nivel pico ponderado C (LCpico) se mide con detector de pico.",
						},
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Protocolo SRT 85/2012">
				<TeoriaParagraph>
					La Resolución SRT 85/2012 define el procedimiento obligatorio para la
					medición y registro de los niveles de ruido en los establecimientos
					laborales.
				</TeoriaParagraph>
				<TeoriaList
					items={[
						"Registro del LAeq,Te y cálculo de dosis diaria",
						"Identificación de tipo de ruido (continuo, intermitente, impacto)",
						"Datos del instrumento (sonómetro o dosímetro calibrado)",
						"Firma del profesional interviniente",
						"Vigencia máxima de 12 meses",
					]}
				/>
			</TeoriaSection>
		</>
	)
}

function ExtintoresContent() {
	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					<TeoriaStrong>Finalidad: </TeoriaStrong>
					Diseñar e inspeccionar los sistemas de protección contra incendios
					pasivos y activos. El cálculo de carga de fuego determina el potencial
					calórico del sector para dimensionar los extintores e instalaciones
					fijas, mientras que el control de medios de escape asegura vías de
					evacuación rápida, libre de obstáculos y segura.
				</TeoriaParagraph>
				<TeoriaParagraph>
					<TeoriaStrong>Legislación Aplicable: </TeoriaStrong>
					Ley N° 19.587, Decreto N° 351/79 (Capítulo 18 y Anexo VII) y normas
					IRAM 3517.
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection title="Carga de Fuego">
				<TeoriaParagraph>
					Se define como el peso en madera por unidad de superficie (kg/m²)
					capaz de desarrollar una cantidad de calor equivalente a la de los
					materiales contenidos en el sector de incendio. Como patrón de
					referencia se considera madera con poder calorífico inferior de 18,41
					MJ/kg.
				</TeoriaParagraph>
				<TeoriaTable
					head={[
						"Riesgo",
						"Carga de Fuego (kg/m²)",
						"Potencial Extintor Mínimo",
					]}
					rows={[
						["Riesgo 1 — Explosivo", "Hasta 15", "—"],
						["Riesgo 2 — Inflamable", "16 a 30", "6B / 8B"],
						["Riesgo 3 — Muy Combustible", "31 a 60", "3A / 10B"],
						["Riesgo 4 — Combustible", "61 a 100", "6A / 20B"],
						["Riesgo 5 — Poco Combustible", "Más de 100", "A determinar"],
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Distribución de Extintores">
				<TeoriaList
					items={[
						"Mínimo un matafuego cada 200 m² de superficie a proteger (Art. 176)",
						"Distancia máxima a recorrer: 20 m para fuegos clase A, 15 m para fuego clase B",
						"Recarga y mantenimiento anual obligatorio (IRAM 3517)",
						"Señalización visible de la ubicación de cada extintor",
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Resistencia al Fuego">
				<TeoriaParagraph>
					Los elementos constructivos deben mantener su capacidad resistente
					durante un tiempo mínimo (F30, F60, F90, F120) según la carga de fuego
					y el riesgo del sector.
				</TeoriaParagraph>
			</TeoriaSection>
		</>
	)
}

function PatContent() {
	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					<TeoriaStrong>Finalidad: </TeoriaStrong>
					Verificar las condiciones de seguridad de la instalación eléctrica
					mediante la medición de la resistencia de la toma de tierra y la
					continuidad de las masas, garantizando la correcta actuación de las
					protecciones (disyuntores diferenciales) ante contactos
					directos/indirectos.
				</TeoriaParagraph>
				<TeoriaParagraph>
					<TeoriaStrong>Legislación Aplicable: </TeoriaStrong>
					Ley N° 19.587, Decreto N° 351/79 (Capítulo 14), Resolución SRT N°
					900/15 (Protocolo para la Verificación de las Condiciones de Seguridad
					de las Instalaciones Eléctricas) y reglamentaciones AEA 90364.
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection title="Valores de Referencia">
				<TeoriaTable
					head={["Concepto", "Valor Exigido"]}
					rows={[
						["Resistencia de PAT", "≤ 40 Ω (recomendable < 10 Ω)"],
						["Continuidad de masas", "Conductividad verificada"],
						["Tiempo de corte del ID", "≤ 200 ms (30 mA)"],
						["Vigencia del protocolo", "12 meses"],
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Procedimiento de Medición">
				<TeoriaParagraph>
					Se utiliza un telurímetro con el método de caída de potencial: se
					inyecta una corriente conocida en el terreno mediante la jabalina
					principal y electrodos auxiliares, midiendo la diferencia de potencial
					para calcular la resistencia en ohmios.
				</TeoriaParagraph>
				<TeoriaList
					items={[
						"Desconectar la jabalina de la instalación antes de medir",
						"Colocar picas auxiliares en línea recta",
						"Verificar la continuidad de todas las masas metálicas accesibles",
						"Ensayo de 9 pruebas por interruptor diferencial (tiempo de apertura y tensión de contacto)",
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Protocolo SRT 900/15">
				<TeoriaParagraph>
					La Resolución SRT 900/15 establece el formulario obligatorio que debe
					contener: datos del establecimiento, fecha, tipo de sistema, valor de
					resistencia medido, resultado de continuidad, tiempo de corte del ID,
					instrumento utilizado y firma del profesional responsable.
				</TeoriaParagraph>
			</TeoriaSection>
		</>
	)
}

function VibracionesContent() {
	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					<TeoriaStrong>Finalidad: </TeoriaStrong>
					Evaluar la magnitud de las aceleraciones mecánicas transmitidas al
					cuerpo del trabajador por maquinaria pesada o herramientas, con el
					objeto de implementar controles que prevengan afecciones
					osteoarticulares, neurológicas o vasculares.
				</TeoriaParagraph>
				<TeoriaParagraph>
					<TeoriaStrong>Legislación Aplicable: </TeoriaStrong>
					Ley N° 19.587, Decreto N° 351/79 y Resolución SRT N° 295/03 (Anexo V),
					Normas IRAM 4078 y 4097, ISO 2631 y ISO 5349.
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection title="Tipos de Vibraciones">
				<TeoriaLabeledList
					items={[
						{
							label: "Mano-Brazo",
							text: "Transmitidas a través de las manos por herramientas vibrátiles (amoladoras, percutoras, motosierras). Pueden causar síndrome de vibración mano-brazo (VWF), neuropatía y trastornos vasculares.",
						},
						{
							label: "Cuerpo Entero",
							text: "Transmitidas a través de los pies o la pelvis por vehículos y maquinaria pesada (autoelevadores, tractores, máquinas viales). Pueden causar lumbalgias, hernias discales y trastornos gastrointestinales.",
						},
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Límites de Exposición">
				<TeoriaParagraph>
					La Resolución 295/03 establece los valores de aceleración admisibles
					en función de la frecuencia, tiempo de exposición y eje de medición.
					Se utiliza un acelerómetro triaxial que registra la aceleración
					vibratoria en m/s² en cada eje (X, Y, Z).
				</TeoriaParagraph>
				<TeoriaTable
					head={["Tipo", "Valor Límite", "Período"]}
					rows={[
						["Mano-Brazo (A(8))", "5 m/s²", "8 horas"],
						["Cuerpo Entero (A(8))", "1.15 m/s²", "8 horas"],
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Instrumental y Metodología">
				<TeoriaList
					items={[
						"Acelerómetro triaxial con rango y sensibilidad adecuados",
						"Filtros de ponderación en frecuencia (Wh para mano-brazo, Wd/Wk para cuerpo entero)",
						"Medición durante toda la jornada o período representativo",
						"Protocolo según planilla 2.G de la Res. SRT 886/15 (Ergonomía)",
					]}
				/>
			</TeoriaSection>
		</>
	)
}

function CapacitacionesContent() {
	const cards = [
		{
			title: "Inducción y Cultura",
			items: [
				"Inducción General de HyS para Nuevos Ingresos",
				"Orden y Limpieza — Metodología 5S",
				"Gestión de Residuos Laborales e Industriales",
			],
		},
		{
			title: "Riesgos Críticos",
			items: [
				"Riesgo Eléctrico y Lockout/Tagout",
				"Seguridad en Trabajos en Altura",
				"Seguridad en Espacios Confinados",
				"Riesgo Químico — SGA/GHS",
			],
		},
		{
			title: "Equipos y Maquinaria",
			items: [
				"Uso Correcto de EPP/EPIS",
				"Operación Segura de Autoelevadores (Res. 960/15)",
				"Maquinaria Vial y Equipos de Izaje",
				"Herramientas Manuales y Eléctricas",
			],
		},
		{
			title: "Emergencias y Salud",
			items: [
				"Primeros Auxilios y RCP",
				"Plan de Evacuación y Emergencias",
				"Prevención y Extinción de Incendios",
			],
		},
		{
			title: "Ergonomía y Prevención",
			items: [
				"Ergonomía Postural y Levantamiento de Cargas",
				"Prevención de Riesgos Biológicos",
				"Exposición a Ruido y Conservación Auditiva",
				"Hidratación y Estrés Térmico",
			],
		},
		{
			title: "Gestión y Permisos",
			items: [
				"Permisos de Trabajo Seguro (PTS) y ART",
				"Manejo Defensivo y Seguridad Vial",
			],
		},
	]

	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					<TeoriaStrong>Finalidad: </TeoriaStrong>
					Cumplir con la obligación legal de instruir al personal en prevención
					de riesgos, promoviendo una cultura preventiva que reduzca la
					siniestralidad. <TeoriaStrong>Marco Legal: </TeoriaStrong>
					Ley 19.587, Dec. 351/79 (Cap. 21, Art. 208-210), Dec. 911/96.
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection>
				<View style={styles.cardGrid}>
					{cards.map(card => (
						<TeoriaCard key={card.title}>
							<Text style={styles.cardTitle}>{card.title}</Text>
							<TeoriaList items={card.items} />
						</TeoriaCard>
					))}
				</View>
			</TeoriaSection>

			<TeoriaParagraph>
				Exigencia legal: capacitación inicial al ingreso, reentrenamiento anual,
				registro firmado y evaluación de comprensión (Art. 208-210, Dec.
				351/79).
			</TeoriaParagraph>
		</>
	)
}

function EPPContent() {
	const epp = [
		{ emoji: "⛑️", name: "Casco", norm: "IRAM 3620" },
		{ emoji: "🥽", name: "Ocular", norm: "IRAM 3630" },
		{ emoji: "👂", name: "Auditiva", norm: "IRAM 4060" },
		{ emoji: "🫁", name: "Respiratoria", norm: "IRAM 3800" },
		{ emoji: "🧤", name: "Guantes", norm: "IRAM 3608" },
		{ emoji: "👢", name: "Calzado", norm: "IRAM 3610" },
		{ emoji: "🪢", name: "Arnés", norm: "IRAM 3605" },
		{ emoji: "👕", name: "Alta Visibilidad", norm: "IRAM 3859" },
	]

	const flujo = [
		{
			n: "01",
			t: "Identificar",
			d: "Riesgos del puesto y EPP requerido según el Servicio de HyS",
		},
		{
			n: "02",
			t: "Seleccionar",
			d: "Equipo certificado bajo norma IRAM, talla y modelo adecuados",
		},
		{
			n: "03",
			t: "Entregar",
			d: "Registrar en Constancia de Entrega (Res. 299/11) con firma del trabajador",
		},
		{
			n: "04",
			t: "Capacitar",
			d: "Uso, conservación, limpieza y señales de deterioro del EPP",
		},
		{
			n: "05",
			t: "Reponer",
			d: "Recambio por desgaste, vencimiento o pérdida; siempre sin costo",
		},
	]

	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					<TeoriaStrong>Finalidad: </TeoriaStrong>
					Gestionar la selección, entrega, reposición y verificación de los
					Equipos de Protección Personal, garantizando certificaciones oficiales
					que mitiguen los riesgos del puesto de trabajo.{" "}
					<TeoriaStrong>Marco Legal: </TeoriaStrong>
					Ley 19.587, Dec. 351/79 (Cap. 19), Res. SRT 299/11 (registro de
					entrega), Res. 896/99 (certificación).
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection>
				<View style={styles.eppGrid}>
					{epp.map(item => (
						<View key={item.name} style={styles.eppItem}>
							<Text style={styles.eppEmoji}>{item.emoji}</Text>
							<Text style={styles.eppName}>{item.name}</Text>
							<Text style={styles.eppNorm}>{item.norm}</Text>
						</View>
					))}
				</View>
			</TeoriaSection>

			<TeoriaSection title="Flujo de Gestión de EPP">
				<View style={{ gap: 12 }}>
					{flujo.map(step => (
						<TeoriaCard key={step.n}>
							<Text style={styles.flowNumber}>{step.n}</Text>
							<Text style={styles.flowTitle}>{step.t}</Text>
							<Text style={styles.flowDesc}>{step.d}</Text>
						</TeoriaCard>
					))}
				</View>
			</TeoriaSection>

			<TeoriaSection>
				<View style={styles.amberBox}>
					<Text style={styles.amberText}>
						<TeoriaStrong>Importante: </TeoriaStrong>
						Sin el sello de certificación IRAM o equivalente, el EPP no se
						considera certificado a los fines de la Res. 299/11. Ante una
						auditoría, la falta de certificación expone al empleador a sanciones
						administrativas y responsabilidad civil.
					</Text>
				</View>
			</TeoriaSection>
		</>
	)
}

function AntisiniestralContent() {
	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					<TeoriaStrong>Finalidad: </TeoriaStrong>
					Evaluar de forma integral las condiciones edilicias, técnicas,
					estructurales y operativas de un establecimiento para certificar que
					cumple con los estándares mínimos de seguridad contra incendios,
					explosiones y otros siniestros, sirviendo como requisito crítico para
					habilitaciones comerciales e industriales.
				</TeoriaParagraph>
				<TeoriaParagraph>
					<TeoriaStrong>Legislación Aplicable: </TeoriaStrong>
					Ley N° 19.587, Decreto N° 351/79 (Capítulo 18), Ley N° 14.836 PBA,
					normativas municipales. En CABA rige la Ley 5920 (Sistema de
					Autoprotección).
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection title="Contenido del Informe">
				<TeoriaList
					items={[
						"Tipo de Riesgo y Cálculo de Carga de Fuego",
						"Determinación del Factor de Ocupación",
						"Tipo y cantidad de extintores portátiles necesarios",
						"Dimensionamiento de vías de escape y ancho de salidas",
						"Verificación de señalización de vías de escape y emergencia",
						"Tipo, cantidad y ubicación de luminarias de emergencia",
						"Medición de niveles de iluminación de emergencia",
						"Verificación de medidas de seguridad contra incendios",
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Requisitos para Habilitación">
				<TeoriaParagraph>
					El Informe Antisiniestral es requisito excluyente para obtener la
					habilitación municipal o el Certificado de Aptitud Ambiental. Debe ser
					firmado por un profesional matriculado con incumbencia en Higiene y
					Seguridad. Sin este certificado, el seguro no cubre siniestros y la
					empresa no puede habilitarse.
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection title="Sistema de Autoprotección (CABA)">
				<TeoriaParagraph>
					En CABA, la Ley 5920 establece el Sistema de Autoprotección, que
					incluye roles de evacuación, simulacros obligatorios y un plan de
					emergencia más exigente que el estándar nacional.
				</TeoriaParagraph>
			</TeoriaSection>
		</>
	)
}

function VehiculosContent() {
	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					<TeoriaStrong>Finalidad: </TeoriaStrong>
					Realizar la verificación pre operacional rutinaria de maquinaria
					pesada (retropala, autoelevador, motoniveladora, hidrogrúa) y
					vehículos corporativos para detectar fallas mecánicas, hidráulicas o
					de seguridad antes de su puesta en marcha, previniendo accidentes
					operativos.
				</TeoriaParagraph>
				<TeoriaParagraph>
					<TeoriaStrong>Legislación Aplicable: </TeoriaStrong>
					Ley N° 19.587, Decreto N° 351/79 (Capítulo 15), Resolución SRT N°
					960/15 (Condiciones de seguridad para autoelevadores), Decreto N°
					911/96, Ley Nac. de Tránsito N° 24.449.
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection title="Checklist Diario de Autoelevadores (Res. SRT 960/15)">
				<TeoriaParagraph>
					El Art. 16 de la Res. 960/15 establece la obligación de realizar un
					checklist diario antes de la puesta en marcha del equipo:
				</TeoriaParagraph>
				<TeoriaList
					items={[
						"Estado de frenos de servicio y estacionamiento",
						"Luces (giro, balizas, posición, freno, trabajo)",
						"Bocina y dispositivo de aviso de retroceso",
						"Cinturón de seguridad",
						"Espejos retrovisores (ambos lados)",
						"Neumáticos (presión y desgaste)",
						"Niveles de fluidos (hidráulico, motor, batería)",
						"Mástil, torre y cilindro de elevación",
						"Orquillas y accesorios de carga",
						"Extintor a bordo",
						"Superficies antideslizantes (pedales, escalera)",
						"Pictogramas y cartelería de seguridad visibles",
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Requisitos del Operador">
				<TeoriaList
					items={[
						"Capacitación teórico-práctica mínima de 10 horas con evaluación final",
						"Revalidación anual de 2 horas de duración",
						"Credencial con foto, apto médico y vigencia visible",
						"Solo conductores autorizados por el empleador",
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Elementos de Seguridad Obligatorios">
				<TeoriaParagraph>
					El autoelevador debe contar con: cinturón de seguridad, luces de giro
					y freno, bocina, alarma de retroceso acústico-luminosa, espejos
					retrovisores, arrestallamas (si corresponde), dispositivo aislante en
					tubo de escape, y asiento ergonómico regulable. Además, señalización
					de áreas de circulación y prohibición de personas debajo de la carga.
				</TeoriaParagraph>
			</TeoriaSection>
		</>
	)
}

function TeoriaLabeledList({
	items,
}: {
	items: { label: string; text: string }[]
}) {
	return (
		<View style={{ gap: 12 }}>
			{items.map(item => (
				<View key={item.label} style={styles.labeledRow}>
					<Text style={styles.labeledLabel}>{item.label}</Text>
					<Text style={styles.labeledText}>{item.text}</Text>
				</View>
			))}
		</View>
	)
}

const CONTENT: Record<TeoriaId, () => React.ReactNode> = {
	iluminacion: IluminacionContent,
	iluminacionValoresRequeridos: IluminacionValoresRequeridosContent,
	ruido: RuidoContent,
	extintores: ExtintoresContent,
	pat: PatContent,
	vibraciones: VibracionesContent,
	capacitaciones: CapacitacionesContent,
	epp: EPPContent,
	antisiniestral: AntisiniestralContent,
	vehiculos: VehiculosContent,
}

export default function Herramientas() {
	const params = useLocalSearchParams<{ t?: string; from?: string }>()
	const t = (params.t as TeoriaId) ?? "iluminacion"
	const Content = CONTENT[t] ?? IluminacionContent

	return (
		<ViewWithLogo>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					width: "92%",
					alignSelf: "center",
					paddingBottom: 120,
				}}
			>
				<View style={{ gap: 16, marginBottom: 24 }}>
					<Button
						variant="ghost"
						iconLeft="chevron-back"
						text="Volver"
						style={{ alignSelf: "flex-start", paddingHorizontal: 0 }}
						onPress={() => router.back()}
					/>
					<View style={{ position: "relative" }}>
						<Select
							data={TEORIAS}
							value={t}
							onChange={value => router.setParams({ t: value })}
							placeholder="Seleccionar tema"
							renderItem={item => item.label}
						/>
						<Ionicons
							name="chevron-down"
							size={24}
							color="#ccc"
							style={{ position: "absolute", left: 12, top: 12 }}
						/>
					</View>
					<Button
						variant="secondary"
						iconLeft="calculator-outline"
						text="Presupuesto"
						onPress={() => router.push("/herramientas/presupuesto")}
					/>
				</View>

				<Content />
			</ScrollView>
		</ViewWithLogo>
	)
}

const styles = StyleSheet.create({
	cardGrid: {
		gap: 12,
	},
	cardTitle: {
		color: teoriaColors.foreground,
		fontSize: 14,
		fontWeight: "700",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	labeledRow: {
		flexDirection: "row",
		gap: 12,
	},
	labeledLabel: {
		color: teoriaColors.foreground,
		fontFamily: "monospace",
		fontSize: 12,
		fontWeight: "700",
		width: 100,
	},
	labeledText: {
		color: teoriaColors.soft,
		fontSize: 14,
		lineHeight: 20,
		flex: 1,
	},
	eppGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	eppItem: {
		width: "23%",
		alignItems: "center",
		gap: 4,
		borderWidth: 1,
		borderColor: teoriaColors.border,
		borderRadius: 12,
		padding: 10,
		backgroundColor: teoriaColors.mutedBg,
	},
	eppEmoji: {
		fontSize: 22,
	},
	eppName: {
		color: teoriaColors.foreground,
		fontSize: 11,
		fontWeight: "600",
		textAlign: "center",
	},
	eppNorm: {
		color: teoriaColors.soft,
		fontSize: 9,
		textAlign: "center",
	},
	flowNumber: {
		color: teoriaColors.primary,
		fontSize: 10,
		fontWeight: "700",
		letterSpacing: 2,
	},
	flowTitle: {
		color: teoriaColors.foreground,
		fontSize: 13,
		fontWeight: "600",
	},
	flowDesc: {
		color: teoriaColors.soft,
		fontSize: 12,
		lineHeight: 17,
	},
	amberBox: {
		borderWidth: 1,
		borderStyle: "dashed",
		borderColor: "rgba(217,119,6,0.4)",
		backgroundColor: "rgba(217,119,6,0.05)",
		borderRadius: 12,
		padding: 16,
	},
	amberText: {
		color: teoriaColors.soft,
		fontSize: 12,
		lineHeight: 18,
		textAlign: "center",
	},
})

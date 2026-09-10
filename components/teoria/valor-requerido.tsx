import {
	TeoriaCollapsible,
	TeoriaList,
	TeoriaParagraph,
	TeoriaSection,
	TeoriaStrong,
	TeoriaTable,
	TeoriaTitle,
} from "@/components/teoria/ui"

const INDUSTRIAS = [
	{
		label: "Vivienda",
		rows: [
			["Baño — Iluminación general", "100 lux"],
			[
				"Baño — Iluminación localizada sobre espejos",
				"200 lux (plano vertical)",
			],
			["Dormitorio — Iluminación general", "200 lux"],
			["Dormitorio — Iluminación localizada (cama, espejo)", "200 lux"],
			["Cocina — Sobre zona de trabajo (cocina, pileta, mesada)", "200 lux"],
		],
	},
	{
		label: "Centros Comerciales",
		rows: [
			["Iluminación general (mediana importancia)", "1000 lux"],
			["Iluminación general (baja importancia)", "500 lux"],
			["Depósito de mercaderías", "300 lux"],
		],
	},
	{
		label: "Hoteles",
		rows: [
			["Pasillos, palier y ascensor", "100 lux"],
			["Hall de entrada", "300 lux"],
			["Escalera", "100 lux"],
			["Local para ropa blanca — Iluminación general", "200 lux"],
			["Local para ropa blanca — Costura", "400 lux"],
			["Lavandería", "100 lux"],
			["Vestuarios", "100 lux"],
			["Sótano, bodegas", "70 lux"],
			["Depósitos", "100 lux"],
		],
	},
	{
		label: "Garajes y Estaciones de Servicio",
		rows: [
			["Iluminación general", "100 lux"],
			["Gomería", "200 lux"],
		],
	},
	{
		label: "Oficinas",
		rows: [
			["Halls para el público", "200 lux"],
			[
				"Contaduría, tabulaciones, teneduría de libros, operaciones bursátiles",
				"500 lux",
			],
			["Trabajo general de oficinas, lectura, archivo", "500 lux"],
			["Trabajos especiales (sistemas de computación de datos)", "750 lux"],
			["Sala de conferencias", "300 lux"],
			["Circulación", "200 lux"],
		],
	},
	{
		label: "Bancos",
		rows: [
			["Iluminación general", "500 lux"],
			["Sobre zonas de escritura y cajas", "750 lux"],
			["Sala de caudales", "500 lux"],
		],
	},
	{
		label: "Industrias Alimenticias",
		rows: [
			["Mataderos — Recepción", "50 lux"],
			["Mataderos — Inspección", "300 lux"],
			["Mataderos — Matanza, deshollado, escaldado", "100 lux"],
			["Mataderos — Evisceración", "300 lux"],
			["Frigoríficos — Cámaras frías", "50 lux"],
			["Frigoríficos — Salas de máquinas", "150 lux"],
			["Conservas de carne — Corte, deshuesado", "300 lux"],
			["Conservas de pescado — Recepción", "300 lux"],
			["Conservas de verduras — Recepción y selección", "300 lux"],
			["Panaderías — Amasado sobre artesas", "200 lux"],
			["Panaderías — Cocción delante de hornos", "300 lux"],
			["Pastas alimenticias — Elaboración", "200 lux"],
			["Usinas pasteurizadoras — Laboratorio", "600 lux"],
			["Fábrica de derivados lácteos — Elaboración", "300 lux"],
			["Fábrica de azúcar — Elaboración", "200 lux"],
		],
	},
	{
		label: "Metalúrgica",
		rows: [
			["Fundiciones — Depósito de barras y lingotes", "100 lux"],
			["Fundiciones — Fabricación de noyos fino", "300 lux"],
			["Fundiciones — Taller de moldeo (iluminación general)", "250 lux"],
			["Fundiciones — Iluminación localizada en moldes", "500 lux"],
			["Acerías — Zona de colado", "100 lux"],
			["Mecánica general — Trabajo grueso (control)", "300 lux"],
			["Mecánica general — Trabajo mediano (ensamble previo)", "600 lux"],
			["Mecánica general — Trabajo fino (calibración)", "1200 lux"],
			[
				"Mecánica general — Trabajo muy fino (calibración e inspección)",
				"2000 lux",
			],
			["Mecánica general — Trabajo minucioso", "3000 lux"],
			["Talleres de montaje — Trabajo grueso", "200 lux"],
			["Talleres de montaje — Trabajo mediano", "400 lux"],
			[
				"Talleres de montaje — Trabajo fino (iluminación localizada)",
				"1200 lux",
			],
			[
				"Máquinas herramientas — Iluminación localizada trabajos delicados",
				"1000 lux",
			],
			["Soldadura", "300 lux"],
			["Pintura — Preparación, dosaje y mezcla de colores", "1000 lux"],
		],
	},
	{
		label: "Del Calzado",
		rows: [
			["Clasificación, marcado y corte", "400 lux"],
			["Costura", "600 lux"],
			["Inspección", "1000 lux"],
		],
	},
	{
		label: "Centrales Eléctricas",
		rows: [
			["Estaciones de transformación — Circulación", "100 lux"],
			["Locales de máquinas rotativas", "200 lux"],
			["Tableros — Sobre el plano de lectura", "400 lux"],
			["Subestaciones — Interiores", "100 lux"],
		],
	},
	{
		label: "Cerámica",
		rows: [
			["Preparación, amasado, molde, prensas, hornos", "200 lux"],
			["Barnizado y decoración — Trabajos finos", "800 lux"],
			["Barnizado y decoración — Trabajos medianos", "400 lux"],
			["Inspección — Iluminación localizada", "1000 lux"],
		],
	},
	{
		label: "Imprenta",
		rows: [
			["Taller de tipografía — Iluminación general", "300 lux"],
			["Taller de tipografía — Mesa de correctores", "800 lux"],
			["Taller de linotipos — Iluminación general", "300 lux"],
			["Inspección de impresión de colores", "1000 lux"],
			["Grabado a mano — Iluminación localizada", "1000 lux"],
			["Litografía", "700 lux"],
		],
	},
	{
		label: "Joyería y Relojería",
		rows: [
			["Zona de trabajo — Iluminación general", "400 lux"],
			["Trabajos finos", "900 lux"],
			["Trabajos minuciosos", "2000 lux"],
			["Corte de gemas, pulido y engarce", "1300 lux"],
		],
	},
	{
		label: "Maderera",
		rows: [
			["Aserraderos — Iluminación general", "100 lux"],
			["Aserraderos — Zona de corte y clasificación", "200 lux"],
			["Carpintería — Zona de bancos y máquinas", "300 lux"],
			["Carpintería — Trabajos de terminación e inspección", "600 lux"],
			["Manufactura de muebles — Selección del enchapado", "900 lux"],
		],
	},
	{
		label: "Textil",
		rows: [
			["Algodón y lino — Mezcla, cardado, hilado", "200 lux"],
			["Algodón y lino — Urdimbre sobre los peines", "700 lux"],
			["Algodón y lino — Tejido telas claras", "400 lux"],
			["Algodón y lino — Tejido telas oscuras", "700 lux"],
			["Algodón y lino — Inspección telas claras", "600 lux"],
			["Algodón y lino — Inspección telas oscuras", "900 lux"],
			["Lana — Tejido telas claras", "600 lux"],
			["Lana — Tejido telas oscuras", "900 lux"],
			["Lana — Máquinas de tejidos de punto", "900 lux"],
			["Lana — Inspección telas claras", "1200 lux"],
			["Lana — Inspección telas oscuras", "1500 lux"],
			["Seda — Tejido telas claras y medianas", "600 lux"],
			["Seda — Tejido telas oscuras", "900 lux"],
		],
	},
	{
		label: "Del Vestido",
		rows: [
			["Sombreros — Limpieza, tintura, planchado", "400 lux"],
			["Sombreros — Costura", "600 lux"],
			["Vestimenta — Sobre máquinas", "600 lux"],
			["Vestimenta — Manual", "800 lux"],
			["Fábrica de guantes — Costura", "600 lux"],
			["Fábrica de guantes — Control", "1000 lux"],
		],
	},
	{
		label: "Del Vidrio",
		rows: [
			["Sala de mezclado — Iluminación general", "200 lux"],
			["Sala de mezclado — Zona de dosificación", "400 lux"],
			["Local de horno", "100 lux"],
			["Manufactura manual — Iluminación general", "200 lux"],
			["Corte, pulido y biselado", "400 lux"],
			["Inspección general", "400 lux"],
		],
	},
	{
		label: "Química",
		rows: [
			["Planta de procesamiento — Circulación general", "100 lux"],
			["Planta de procesamiento — Sobre mesas y pupitres", "400 lux"],
			["Laboratorio de ensayo — Iluminación general", "400 lux"],
			["Laboratorio de ensayo — Plano de lectura de aparatos", "600 lux"],
			["Jabones — Iluminación general", "300 lux"],
			["Pinturas — Mezcla de pinturas", "600 lux"],
			["Pinturas — Combinación de colores", "1000 lux"],
			["Plásticos — Calandrado, extrusión, inyección", "300 lux"],
		],
	},
	{
		label: "Papelera",
		rows: [
			["Local de máquinas", "100 lux"],
			["Corte, terminación", "300 lux"],
			["Inspección", "500 lux"],
		],
	},
	{
		label: "Depósitos y Almacenes",
		rows: [
			["Piezas grandes", "100 lux"],
			["Piezas pequeñas", "200 lux"],
			["Expedición de mercaderías", "300 lux"],
		],
	},
]

export default function IluminacionValoresRequeridosContent() {
	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					Anexo IV — Decreto 351/79, Capítulo 12 (Iluminación y Color).
					Establece las intensidades mínimas de iluminación sobre el plano de
					trabajo según la dificultad de la tarea visual y el destino del local.
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection title="Tabla 1 — Clases de Tarea Visual">
				<TeoriaParagraph>
					Intensidad media de iluminación según IRAM-AADL J 20-06. Usar estos
					valores para tareas no incluidas en la Tabla 2.
				</TeoriaParagraph>
				<TeoriaTable
					minWidth={560}
					head={["Clase de tarea visual", "Iluminación", "Ejemplos"]}
					rows={[
						[
							"Visión ocasional solamente",
							"100 lux",
							"Lugares de poco tránsito: sala de calderas, depósito de materiales voluminosos",
						],
						[
							"Tareas intermitentes ordinarias y fáciles, con contrastes fuertes",
							"100 – 300 lux",
							"Trabajos simples e intermitentes, inspección general, contado de partes de stock, colocación de maquinaria pesada",
						],
						[
							"Tarea moderadamente crítica y prolongada, con detalles medianos",
							"300 – 750 lux",
							"Trabajos medianos mecánicos y manuales, inspección y montaje; trabajos comunes de oficina: lectura, escritura y archivo",
						],
						[
							"Tareas severas y prolongadas, de poco contraste",
							"750 – 1500 lux",
							"Trabajos finos mecánicos y manuales, montaje e inspección; pintura extrafina, sopleteado, costura de ropa oscura",
						],
						[
							"Tareas muy severas y prolongadas, con detalles minuciosos o muy poco contraste",
							"1500 – 3000 lux",
							"Montaje e inspección de mecanismos delicados, fabricación de herramientas y matrices, trabajo de molienda fina",
						],
						[
							"Tareas excepcionales, difíciles o importantes",
							"3000 lux",
							"Trabajo fino de relojería y reparación",
						],
						[
							"Tareas excepcionales, difíciles o importantes",
							"5000 – 10.000 lux",
							"Casos especiales: iluminación del campo operatorio en sala de cirugía",
						],
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Tabla 2 — Intensidad Mínima por Tipo de Edificio y Local">
				<TeoriaParagraph>
					Valor mínimo de servicio de iluminación (lux) según IRAM-AADL J 20-06,
					organizado por industria y sector.
				</TeoriaParagraph>
				{INDUSTRIAS.map(industria => (
					<TeoriaCollapsible key={industria.label} label={industria.label}>
						<TeoriaTable head={[]} rows={industria.rows} />
					</TeoriaCollapsible>
				))}
			</TeoriaSection>

			<TeoriaSection title="Tabla 3 — Relación de Máximas Luminancias">
				<TeoriaParagraph>
					Relaciones máximas admisibles para evitar diferencias de iluminancias
					causantes de incomodidad visual o deslumbramiento.
				</TeoriaParagraph>
				<TeoriaTable
					head={["Zona del campo visual", "Relación con la tarea visual"]}
					rows={[
						["Campo visual central (cono de 30° de abertura)", "3 : 1"],
						["Campo visual periférico (cono de 90° de abertura)", "10 : 1"],
						[
							"Entre la fuente de luz y el fondo sobre el cual se destaca",
							"20 : 1",
						],
						["Entre dos puntos cualesquiera del campo visual", "40 : 1"],
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Tabla 4 — Iluminación General Mínima">
				<TeoriaParagraph>
					Iluminación general mínima en función de la iluminancia localizada.
					Cuando se ilumine en forma localizada, la iluminación general no podrá
					tener una intensidad menor a la indicada.
				</TeoriaParagraph>
				<TeoriaTable
					head={["Iluminación localizada", "Iluminación general mínima"]}
					rows={[
						["250 lux", "125 lux"],
						["500 lux", "250 lux"],
						["1.000 lux", "300 lux"],
						["2.500 lux", "500 lux"],
						["5.000 lux", "600 lux"],
						["10.000 lux", "700 lux"],
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Requisitos de Uniformidad">
				<TeoriaParagraph>
					Es un parámetro crítico en luminotecnia que mide cuán homogénea es la
					distribución de la luz en un plano de trabajo específico. Su objetivo
					es garantizar que no existan contrastes severos o zonas de sombra que
					fuercen la acomodación visual del trabajador, previniendo así la
					fatiga ocular y disminuyendo el riesgo de accidentes.
				</TeoriaParagraph>
				<TeoriaParagraph>
					Para asegurar una uniformidad razonable en la iluminancia de un local,
					se exige una relación no menor de <TeoriaStrong>0,5</TeoriaStrong>{" "}
					entre sus valores mínimo y medio:
				</TeoriaParagraph>
				<TeoriaParagraph>E mínima ≥ E media / 2</TeoriaParagraph>
				<TeoriaParagraph>
					La iluminancia media se determina por media aritmética de la
					iluminancia general del local. La iluminancia mínima es el menor valor
					sobre las superficies de trabajo o sobre un plano horizontal a 0,80 m
					del suelo. No aplica a lugares de tránsito, ingreso/egreso de personal
					ni iluminación de emergencia.
				</TeoriaParagraph>
				<TeoriaList
					items={[
						"Emin: Valor mínimo en Lux tomado en la grilla de medición.",
						"Emax: Valor máximo en Lux tomado en la grilla de medición.",
						"Emed: Iluminancia Media, es la media aritmética en Lux calculada, teniendo en cuenta todas las mediciones de la grilla.",
						"Uniformidad General U0 = Emin / Emed. Es el indicador más utilizado por la legislación para validar si el ambiente en general está bien iluminado de manera equilibrada.",
						"Uniformidad Localizada U1 = Emin / Emax. Se utiliza para analizar áreas específicas o puestos de trabajo puntuales, asegurando que no existan picos de brillo excesivos respecto a la zona menos iluminada.",
					]}
				/>
				<TeoriaParagraph>
					Criterio de Validación: El cociente U0 obtenido es menor al límite
					establecido por la normativa para esa actividad, el estudio se
					dictamina como "No Conforme", aun cuando el valor medio Emed cumpla
					con los lux mínimos requeridos. Esto obligaría a rediseñar la
					distribución de las luminarias o modificar sus potencias. Los valores
					para U0 &gt; 0,60, pero va a depender de la actividad. Para área
					interior sería:
				</TeoriaParagraph>
				<TeoriaTitle>Uniformidad por tipo de área</TeoriaTitle>
				<TeoriaTable
					minWidth={720}
					head={[
						"Área interior",
						"Almacenes",
						"Áreas de manipulación de embalaje de despacho",
						"Aparcamientos públicos",
						"Salas de exposiciones",
						"Fundición a presión",
						"Fabricación de cables y alambres",
						"Talleres electrónicos, pruebas, ajustes",
					]}
					rows={[
						["Uniformidad", "0.4", "0.6", "0.4", "0.4", "0.6", "0.6", "0.7"],
					]}
				/>
				<TeoriaParagraph>
					En el marco legal y técnico aplicable (como la Resolución SRT 84/2012
					y la Norma IRAM AADDL J 20-06 en Argentina, o la ISO 8995-1 a nivel
					internacional), el cálculo y control de este factor es obligatorio al
					confeccionar los protocolos de medición.
				</TeoriaParagraph>
			</TeoriaSection>
		</>
	)
}

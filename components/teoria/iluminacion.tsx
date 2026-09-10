import {
	TeoriaList,
	TeoriaParagraph,
	TeoriaSection,
	TeoriaStrong,
	TeoriaTable,
} from "@/components/teoria/ui"

export default function IluminacionContent() {
	return (
		<>
			<TeoriaSection>
				<TeoriaParagraph>
					<TeoriaStrong>Finalidad: </TeoriaStrong>
					Evaluar los niveles de iluminancia en los puestos de trabajo para
					garantizar condiciones visuales óptimas, prevenir la fatiga ocular,
					reducir el riesgo de accidentes y optimizar el desempeño laboral,
					asegurando que la distribución de la luz sea uniforme y evite
					deslumbramientos. Legislación Aplicable: Ley N° 19.587 de Higiene y
					Seguridad en el Trabajo, Decreto Reglamentario N° 351/79 (Anexo IV,
					Capítulo 12) y la Resolución SRT N° 84/12 (Protocolo para la Medición
					del Nivel de Iluminación en el Ambiente de Laboral).
				</TeoriaParagraph>
			</TeoriaSection>

			<TeoriaSection title="Niveles Mínimos de Iluminación">
				<TeoriaParagraph>
					El Decreto 351/79 (Anexo IV) establece los lux mínimos según la
					dificultad de la tarea visual:
				</TeoriaParagraph>
				<TeoriaTable
					head={["Tarea", "Iluminancia Mínima"]}
					rows={[
						["Pasillos y zonas de circulación general", "50 Lux"],
						[
							"Tareas con requerimiento visual simple (Depósitos)",
							"100 — 200 Lux",
						],
						["Trabajos de oficina general, lectura y pantallas", "300 Lux"],
						[
							"Tareas de alta precisión o talleres de control",
							"500 — 1000 Lux",
						],
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Interpretación">
				<TeoriaList
					items={[
						<>
							<TeoriaStrong>50 Lux: </TeoriaStrong>Solo para tránsito peatonal
							sin riesgo. No se realiza ninguna tarea visual continua en estos
							sectores.
						</>,
						<>
							<TeoriaStrong>100–200 Lux: </TeoriaStrong>Tareas gruesas donde el
							detalle no es crítico. Aplica a depósitos, almacenes y zonas de
							paso donde se manipulan objetos grandes.
						</>,
						<>
							<TeoriaStrong>300 Lux: </TeoriaStrong>Umbral para trabajo
							administrativo y visual continuo. Oficinas, lectura prolongada,
							uso de pantallas y tareas de escritorio en general.
						</>,
						<>
							<TeoriaStrong>500–1000 Lux: </TeoriaStrong>Tareas finas que
							requieren agudeza visual sostenida: control de calidad,
							laboratorios, montaje fino, talleres de precisión.
						</>,
					]}
				/>
			</TeoriaSection>

			<TeoriaSection title="Protocolo SRT 84/2012">
				<TeoriaParagraph>
					La Resolución SRT 84/2012 define el procedimiento obligatorio para la
					medición y registro de los niveles de iluminación en los
					establecimientos laborales.
				</TeoriaParagraph>
				<TeoriaList
					items={[
						"Registro del lux media, uniformidad y factor de mantenimiento",
						"Croquis del sector con puntos de medición",
						"Datos del instrumento (luxómetro calibrado)",
						"Firma del profesional interviniente",
						"Vigencia máxima de 12 meses (salvo modificaciones del entorno)",
					]}
				/>
			</TeoriaSection>
		</>
	)
}

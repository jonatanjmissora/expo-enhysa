/**
 * Registro de entidades sincronizables del lado local.
 *
 * Las columnas están en el mismo nombre que usa la API de la nube (camelCase),
 * así el mapeo local ↔ nube es directo. Debe coincidir con `SYNC_ENTITIES` del
 * backend (`expo-enhysa-backend/lib/sync-entities.ts`).
 */
export type LocalEntity = {
	key: string
	table: string
	/** Columnas de datos (sin `id`, `userId` ni `updatedAt`). */
	columns: string[]
	/** Columnas numéricas (el resto se trata como texto al restaurar). */
	numberFields: string[]
	/** Columnas que guardan un `imageId` simple. */
	imageFields: string[]
	/** Columnas que guardan un JSON array de `imageId`. */
	imageArrayFields: string[]
	label: string
}

export const LOCAL_ENTITIES: LocalEntity[] = [
	{
		key: "tecnicos",
		table: "tecnicos",
		columns: [
			"nombre",
			"telefono",
			"localidad",
			"cargo",
			"matricula",
			"matriculaImg",
			"firmaImg",
			"empresaLogo",
			"dni",
		],
		numberFields: ["dni"],
		imageFields: ["matriculaImg", "firmaImg", "empresaLogo"],
		imageArrayFields: [],
		label: "técnicos",
	},
	{
		key: "empresas",
		table: "empresas",
		columns: [
			"cuit",
			"razonSocial",
			"direccion",
			"localidad",
			"provincia",
			"codigoPostal",
			"horarios",
			"logo",
		],
		numberFields: [],
		imageFields: ["logo"],
		imageArrayFields: [],
		label: "empresas",
	},
	{
		key: "instrumentos",
		table: "instrumentos",
		columns: [
			"nombre",
			"marca",
			"modelo",
			"serie",
			"fechaCalibracion",
			"imagenesCalibracion",
			"imagenes",
		],
		numberFields: [],
		imageFields: [],
		imageArrayFields: ["imagenesCalibracion", "imagenes"],
		label: "instrumentos",
	},
]

export function getLocalEntity(key: string): LocalEntity | undefined {
	return LOCAL_ENTITIES.find(entity => entity.key === key)
}

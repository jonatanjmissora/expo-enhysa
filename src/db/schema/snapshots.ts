export type TecnicoSnapshot = {
	nombre: string
	telefono: string
	localidad: string
	cargo: string
	matricula: string
	matriculaImg: string
	firmaImg: string
	empresaLogo: string | null
	dni: number | null
}

export type EmpresaSnapshot = {
	cuit: string
	razonSocial: string
	direccion: string
	localidad: string
	provincia: string
	codigoPostal: string
	horarios: string
	logo: string
}

export type InstrumentoSnapshot = {
	instrumentoId: string
	nombre: string
	marca: string
	modelo: string
	serie: string
	fechaCalibracion: string
	imagenesCalibracion: string[]
	imagenes: string[]
}

export const emptyTecnicoSnapshot: TecnicoSnapshot = {
	nombre: "",
	telefono: "",
	localidad: "",
	cargo: "",
	matricula: "",
	matriculaImg: "",
	firmaImg: "",
	empresaLogo: null,
	dni: null,
}

export const emptyEmpresaSnapshot: EmpresaSnapshot = {
	cuit: "",
	razonSocial: "",
	direccion: "",
	localidad: "",
	provincia: "",
	codigoPostal: "",
	horarios: "",
	logo: "",
}

export const emptyInstrumentoSnapshot: InstrumentoSnapshot = {
	instrumentoId: "",
	nombre: "",
	marca: "",
	modelo: "",
	serie: "",
	fechaCalibracion: "",
	imagenesCalibracion: [],
	imagenes: [],
}

function parseObject<T>(value: string | null | undefined): Partial<T> {
	if (!value) return {}
	try {
		const parsed = JSON.parse(value)
		return parsed && typeof parsed === "object" ? (parsed as Partial<T>) : {}
	} catch {
		return {}
	}
}

export function serializeSnapshot(
	snapshot: TecnicoSnapshot | EmpresaSnapshot | InstrumentoSnapshot
): string {
	return JSON.stringify(snapshot)
}

export function parseTecnicoSnapshot(
	value: string | null | undefined
): TecnicoSnapshot {
	return { ...emptyTecnicoSnapshot, ...parseObject<TecnicoSnapshot>(value) }
}

export function parseEmpresaSnapshot(
	value: string | null | undefined
): EmpresaSnapshot {
	return { ...emptyEmpresaSnapshot, ...parseObject<EmpresaSnapshot>(value) }
}

export function parseInstrumentoSnapshot(
	value: string | null | undefined
): InstrumentoSnapshot {
	const parsed = {
		...emptyInstrumentoSnapshot,
		...parseObject<InstrumentoSnapshot>(value),
	}
	return {
		...parsed,
		imagenesCalibracion: Array.isArray(parsed.imagenesCalibracion)
			? parsed.imagenesCalibracion
			: [],
		imagenes: Array.isArray(parsed.imagenes) ? parsed.imagenes : [],
	}
}

export function tecnicoSnapshotImageIds(snapshot: TecnicoSnapshot): string[] {
	return [
		snapshot.matriculaImg,
		snapshot.firmaImg,
		snapshot.empresaLogo,
	].filter((id): id is string => Boolean(id))
}

export function empresaSnapshotImageIds(snapshot: EmpresaSnapshot): string[] {
	return snapshot.logo ? [snapshot.logo] : []
}

export function instrumentoSnapshotImageIds(
	snapshot: InstrumentoSnapshot
): string[] {
	return [...snapshot.imagenesCalibracion, ...snapshot.imagenes].filter(
		(id): id is string => Boolean(id)
	)
}

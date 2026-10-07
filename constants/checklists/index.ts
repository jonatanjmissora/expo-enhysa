import type { ChecklistSectionId } from "@/constants"
import { andamiosChecklist } from "./andamios"
import { apiladorElectricoChecklist } from "./apilador-electrico"
import { autoelevadoresChecklist } from "./autoelevadores"
import { chequeoInicialAlClienteChecklist } from "./chequeo-inicial-al-cliente"
import { compresoresChecklist } from "./compresores"
import { dispositivosAnticaidasChecklist } from "./dispositivos-anticaidas"
import { equiposDeIzajeChecklist } from "./equipos-de-izaje"
import { extintoresChecklist } from "./extintores"
import { fresadoraYTornoMecanicoChecklist } from "./fresadora-y-torno-mecanico"
import { generadoresGrandesYPortatilesChecklist } from "./generadores-grandes-y-portatiles"
import { herramientasElectricasChecklist } from "./herramientas-electricas"
import { herramientasManualesChecklist } from "./herramientas-manuales"
import { inspeccionDeEquiposVialesChecklist } from "./inspeccion-de-equipos-viales"
import { inspeccionDeFrenteDeObraChecklist } from "./inspeccion-de-frente-de-obra"
import { lijadoraDeBancoChecklist } from "./lijadora-de-banco"
import { manipuladorTelescopicoChecklist } from "./manipulador-telescopico"
import { maquinaDeSoldarElectricaChecklist } from "./maquina-de-soldar-electrica"
import { oxicorteChecklist } from "./oxicorte"
import { piedraDeAmoladoChecklist } from "./piedra-de-amolado"
import { plataformaElevadoraDePersonasChecklist } from "./plataforma-elevadora-de-personas"
import { tablerosElectricosChecklist } from "./tableros-electricos"
import { tableroElectricoPortatilChecklist } from "./tablero-electrico-portatil"
import { vehiculoLivianoChecklist } from "./vehiculo-liviano"
import type { ChecklistSpec } from "./types"

export type { ChecklistQuestion, ChecklistSpec } from "./types"

export const CHECKLIST_SPECS: Partial<
	Record<ChecklistSectionId, ChecklistSpec>
> = {
	andamios: andamiosChecklist,
	"apilador-electrico": apiladorElectricoChecklist,
	autoelevadores: autoelevadoresChecklist,
	"chequeo-inicial-al-cliente": chequeoInicialAlClienteChecklist,
	compresores: compresoresChecklist,
	"dispositivos-anticaidas": dispositivosAnticaidasChecklist,
	"equipos-de-izaje": equiposDeIzajeChecklist,
	extintores: extintoresChecklist,
	"fresadora-y-torno-mecanico": fresadoraYTornoMecanicoChecklist,
	"generadores-grandes-y-portatiles": generadoresGrandesYPortatilesChecklist,
	"herramientas-electricas": herramientasElectricasChecklist,
	"herramientas-manuales": herramientasManualesChecklist,
	"inspeccion-de-equipos-viales": inspeccionDeEquiposVialesChecklist,
	"inspeccion-de-frente-de-obra": inspeccionDeFrenteDeObraChecklist,
	"lijadora-de-banco": lijadoraDeBancoChecklist,
	"manipulador-telescopico": manipuladorTelescopicoChecklist,
	"maquina-de-soldar-electrica": maquinaDeSoldarElectricaChecklist,
	oxicorte: oxicorteChecklist,
	"piedra-de-amolado": piedraDeAmoladoChecklist,
	"plataforma-elevadora-de-personas": plataformaElevadoraDePersonasChecklist,
	"tableros-electricos": tablerosElectricosChecklist,
	"tablero-electrico-portatil": tableroElectricoPortatilChecklist,
	"vehiculo-liviano": vehiculoLivianoChecklist,
}

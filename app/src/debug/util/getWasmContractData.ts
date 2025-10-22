/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	CONTRACT_SECTIONS,
	type ContractData,
	type ContractSectionName,
} from "../types/types"
import { prettifyJsonString } from "./prettifyJsonString"
import * as StellarXdr from "./StellarXdr"

export const getWasmContractData = async (wasmBytes: Buffer) => {
	try {
		const mod = await WebAssembly.compile(wasmBytes)

		const result: Record<ContractSectionName, ContractData> = {
			contractmetav0: {},
			contractenvmetav0: {},
			contractspecv0: {},
		}

		// Make sure the StellarXdr is available
		await StellarXdr.initialize()

		for (const sectionName of CONTRACT_SECTIONS) {
			const sections = WebAssembly.Module.customSections(mod, sectionName)

			if (sections.length > 0) {
				for (let i = 0; i < sections.length; i++) {
					const sectionData = sectionResult(sectionName, sections[i])

					if (sectionData) {
						result[sectionName] = sectionData
					}
				}
			}
		}

		return result
	} catch (e) {
		console.error("Error getting wasm contract data:", e)
		return null
	}
}

const sectionResult = (
	sectionName: ContractSectionName,
	section: ArrayBuffer,
) => {
	const sectionData = new Uint8Array(section)
	const sectionXdr = Buffer.from(sectionData).toString("base64")
	const { json, xdr } = getJsonAndXdr(sectionName, sectionXdr)

	return {
		xdr,
		json,
		// TODO: add text format
	}
}

const TYPE_VARIANT: Record<ContractSectionName, string> = {
	contractenvmetav0: "ScEnvMetaEntry",
	contractmetav0: "ScMetaEntry",
	contractspecv0: "ScSpecEntry",
}

const getJsonAndXdr = (sectionName: ContractSectionName, xdr: string) => {
	try {
		const jsonStringArray = StellarXdr.decode_stream(
			TYPE_VARIANT[sectionName],
			xdr,
		)

		return {
			json: jsonStringArray.map((s: string) => prettifyJsonString(s)),
			xdr: jsonStringArray.map((s: string) =>
				StellarXdr.encode(TYPE_VARIANT[sectionName], s),
			),
		}
	} catch (e) {
		return { json: [], xdr: [] }
	}
}

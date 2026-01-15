import { type Client } from "@stellar/stellar-sdk/contract"
import { useQuery } from "@tanstack/react-query"
import {
	loadContractMetadata,
	type ContractMetadata,
} from "../util/loadContractMetada"

const contractModules = import.meta.glob("../../contracts/*.ts")

type ContractModule = {
	default: Client
	metadata?: ContractMetadata
}

type ContractMap = Record<string, ContractModule>

const loadContracts = async () => {
	const loadedContracts: ContractMap = {}
	const failed: Record<string, string> = {}

	for (const [path, importFn] of Object.entries(contractModules)) {
		const filename = path.split("/").pop()?.replace(".ts", "") || ""
		if (filename && filename === "util") continue

		try {
			const module = (await importFn()) as ContractModule
			const metadata = await loadContractMetadata(
				module.default.options.contractId,
			)
			loadedContracts[filename] = { ...module, metadata }
		} catch (error) {
			failed[filename] = error instanceof Error ? error.message : String(error)
		}
	}

	return { loadedContracts, failed }
}

export function useContracts() {
	return useQuery({
		queryKey: ["contracts"],
		queryFn: loadContracts,
		staleTime: Infinity,
	})
}

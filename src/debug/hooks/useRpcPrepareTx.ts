import { rpc as StellarRpc, TransactionBuilder } from "@stellar/stellar-sdk"
import { useMutation } from "@tanstack/react-query"

import {
	type NetworkHeaders,
	type PrepareRpcErrorResponse,
	type PrepareRpcResponse,
} from "../types/types"
import { isEmptyObject } from "../util/isEmptyObject"

type PrepareRpcTxProps = {
	rpcUrl: string
	transactionXdr: string
	networkPassphrase: string
	headers: NetworkHeaders
}

// RPC's prepareTransaction method handles both
// simulating and assembling transactions
export const useRpcPrepareTx = () => {
	const mutation = useMutation<
		PrepareRpcResponse,
		PrepareRpcErrorResponse,
		PrepareRpcTxProps
	>({
		mutationFn: async ({
			rpcUrl,
			transactionXdr,
			networkPassphrase,
			headers,
		}: PrepareRpcTxProps) => {
			try {
				const transaction = TransactionBuilder.fromXDR(
					transactionXdr,
					networkPassphrase,
				)
				const rpcServer = new StellarRpc.Server(rpcUrl, {
					headers: isEmptyObject(headers) ? undefined : { ...headers },
					allowHttp: new URL(rpcUrl).hostname === "localhost",
				})
				const preparedTx = await rpcServer.prepareTransaction(transaction)

				return {
					transactionXdr: preparedTx.toXDR(),
				}
			} catch (e) {
				throw {
					result: e,
				}
			}
		},
	})

	return mutation
}

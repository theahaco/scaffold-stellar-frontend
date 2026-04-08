import { Layout } from "@stellar/design-system"
import { ContractExplorer, loadContracts } from "@theahaco/contract-explorer"
import { network } from "../contracts/util"
import { useWallet } from "../hooks/useWallet"

// Import contract clients and load them for the Contract Explorer
const contractModules = import.meta.glob("../contracts/*.ts")
const contracts = await loadContracts(contractModules)

const Debugger: React.FC = () => {
	const { address, signTransaction } = useWallet()

	return (
		<Layout.Content>
			<Layout.Inset>
				<h2>Debug Contracts</h2>

				<ContractExplorer
					contracts={contracts}
					network={network}
					address={address}
					signTransaction={signTransaction}
				/>
			</Layout.Inset>
		</Layout.Content>
	)
}

export default Debugger

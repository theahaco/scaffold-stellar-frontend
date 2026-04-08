import {
	Button,
	Text,
	Modal,
	Profile,
	Icon,
	Tooltip,
} from "@stellar/design-system"
import { useState } from "react"
import { useWallet } from "../hooks/useWallet"
import { connectWallet, disconnectWallet } from "../util/wallet"

export const WalletButton = () => {
	const [showDisconnectModal, setShowDisconnectModal] = useState(false)
	const [isWarningTooltipVisible, setIsWarningTooltipVisible] = useState(false)
	const { address, isPending, balances, walletWarnings } = useWallet()
	const buttonLabel = isPending ? "Loading..." : "Connect"

	// Build warning message based on wallet issues
	const getWarningMessage = () => {
		const warnings: string[] = []
		if (walletWarnings.popupAlways) {
			warnings.push("This wallet triggers a popup on every interaction")
		}
		if (walletWarnings.noGetNetworkSupport) {
			warnings.push("This wallet doesn't support network detection")
		}
		return warnings.join(". ")
	}

	// Handle click on warning icon - open help URL if available
	const handleWarningClick = () => {
		if (walletWarnings.helpUrl) {
			window.open(walletWarnings.helpUrl, "_blank", "noopener,noreferrer")
		}
	}

	if (!address) {
		return (
			<Button variant="primary" size="md" onClick={() => void connectWallet()}>
				{buttonLabel}
			</Button>
		)
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: "5px",
				opacity: isPending ? 0.6 : 1,
			}}
		>
			<Text as="div" size="sm">
				Wallet Balance: {balances?.xlm?.balance ?? "-"} XLM
			</Text>

			<div id="modalContainer">
				<Modal
					visible={showDisconnectModal}
					onClose={() => setShowDisconnectModal(false)}
					parentId="modalContainer"
				>
					<Modal.Heading>
						Connected as{" "}
						<code style={{ lineBreak: "anywhere" }}>{address}</code>. Do you
						want to disconnect?
					</Modal.Heading>
					<Modal.Footer itemAlignment="stack">
						<Button
							size="md"
							variant="primary"
							onClick={() => {
								void disconnectWallet().then(() =>
									setShowDisconnectModal(false),
								)
							}}
						>
							Disconnect
						</Button>
						<Button
							size="md"
							variant="tertiary"
							onClick={() => {
								setShowDisconnectModal(false)
							}}
						>
							Cancel
						</Button>
					</Modal.Footer>
				</Modal>
			</div>

			<div style={{ position: "relative" }}>
				<Profile
					publicAddress={address}
					size="md"
					isShort
					onClick={() => setShowDisconnectModal(true)}
				/>

				{walletWarnings.hasWarnings && (
					<div
						onMouseEnter={() => setIsWarningTooltipVisible(true)}
						onMouseLeave={() => setIsWarningTooltipVisible(false)}
						style={{
							position: "absolute",
							top: "-6px",
							right: "-6px",
							zIndex: 1,
						}}
					>
						<Tooltip
							isVisible={isWarningTooltipVisible}
							isContrast
							placement="bottom"
							triggerEl={
								<div
									onClick={handleWarningClick}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
										backgroundColor: "var(--color-gray-00, #fff)",
										borderRadius: "50%",
										padding: "3px",
										border: "2px solid var(--color-yellow-60, #f0ad4e)",
										boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
									}}
								>
									<Icon.AlertTriangle
										style={{
											color: "var(--color-yellow-60, #f0ad4e)",
											width: "12px",
											height: "12px",
										}}
									/>
								</div>
							}
						>
							<div style={{ maxWidth: "15em" }}>
								{getWarningMessage()}. Click to learn more about this issue.
							</div>
						</Tooltip>
					</div>
				)}
			</div>
		</div>
	)
}

import {
	Button,
	Text,
	Modal,
	Profile,
	Icon,
	Tooltip,
} from "@stellar/design-system"
import React, { useState } from "react"
import { useWallet } from "../hooks/useWallet"
import { connectWallet, disconnectWallet } from "../util/wallet"
import cssStyles from "./WalletButton.module.css"

export const WalletButton = () => {
	const [showDisconnectModal, setShowDisconnectModal] = useState(false)
	const { address, isPending, balances, walletWarnings } = useWallet()
	const buttonLabel = isPending ? "Loading..." : "Connect"

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
					<Modal.Heading>Disconnect wallet?</Modal.Heading>
					<Modal.Body>
						<Text
							as="div"
							size="sm"
							style={{
								display: "flex",
								alignItems: "baseline",
								minWidth: 0,
							}}
						>
							<span style={{ flexShrink: 0 }}>Connected as&nbsp;</span>
							<code
								style={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									fontSize: "0.85em",
								}}
								title={address}
							>
								{address}
							</code>
						</Text>
					</Modal.Body>
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

			<div className={cssStyles.profileWrap}>
				<Profile
					publicAddress={address}
					size="md"
					isShort
					onClick={() => setShowDisconnectModal(true)}
				/>

				{walletWarnings.hasWarnings && (
					<Tooltip
						placement="bottom"
						triggerEl={<Icon.AlertTriangle className={cssStyles.warningIcon} />}
					>
						<div style={{ maxWidth: "15em" }}>
							{walletWarnings.messages.join("")}
							{walletWarnings.helpUrl && (
								<a
									className={cssStyles.learnMore}
									href={walletWarnings.helpUrl}
									target="_blank"
								>
									Learn more
								</a>
							)}
						</div>
					</Tooltip>
				)}
			</div>
		</div>
	)
}

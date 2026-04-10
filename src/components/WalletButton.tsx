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
	const [isWarningTooltipVisible, setIsWarningTooltipVisible] = useState(false)
	const { address, isPending, balances, walletWarnings } = useWallet()
	const buttonLabel = isPending ? "Loading..." : "Connect"

	const warningIconStyles = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		backgroundColor: "var(--color-gray-00, #fff)",
		borderRadius: "50%",
		padding: "3px",
		border: "2px solid var(--color-yellow-60, #f0ad4e)",
		boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
		lineHeight: 0,
		textDecoration: "none",
	} as const

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
							triggerEl={React.createElement(
								walletWarnings.helpUrl ? "a" : "span",
								walletWarnings.helpUrl
									? {
											href: walletWarnings.helpUrl,
											target: "_blank",
											className: cssStyles.warningIcon,
											style: warningIconStyles,
										}
									: { style: warningIconStyles },
								<Icon.AlertTriangle
									style={{
										color: "var(--color-yellow-60, #f0ad4e)",
										width: "12px",
										height: "12px",
									}}
								/>,
							)}
						>
							<div style={{ maxWidth: "15em" }}>
								{walletWarnings.messages.join(". ")}
								{walletWarnings.helpUrl ? ". Click to learn more." : ""}
							</div>
						</Tooltip>
					</div>
				)}
			</div>
		</div>
	)
}

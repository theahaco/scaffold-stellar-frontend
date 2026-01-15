import { Box } from "../../components/layout/Box"
import { type AnyObject } from "../types/types"
import { LabelHeading } from "./LabelHeading"
import { PrettyJson } from "./PrettyJson"

const styles = {
	jsonContainer: {
		border: "1px solid var(--sds-input-color-border-disabled)",
		borderRadius: "0.375rem", // 6px
		maxHeight: "13.75rem", // 220px
		overflow: "auto" as const,
		padding: "0.5rem 0.75rem", // 8px 12px
	} as React.CSSProperties,
}

export const PrettyJsonTextarea = ({
	json,
	label,
}: {
	json: AnyObject
	label: string
	isCodeWrapped?: boolean
}) => {
	return (
		<Box gap="sm">
			<LabelHeading size="md">{label}</LabelHeading>
			<div style={styles.jsonContainer}>
				<PrettyJson json={json} isCollapsible={false} />
			</div>
		</Box>
	)
}

import { Box } from "../../components/layout/Box";

const styles = {
  value: {
    marginLeft: "var(--sds-gap-sm)",
  } as React.CSSProperties,
  link: {
    color: "var(--sds-clr-gray-12)",
    wordBreak: "break-all" as const,
    fontWeight: "var(--sds-fw-regular)",
  } as React.CSSProperties,
};

export const TxResponse = ({
  label,
  value,
  item,
}: {
  label: string;
  value?: string | number;
  item?: React.ReactNode;
}) => (
  <Box gap="xs">
    <div>{label.toLocaleUpperCase()}</div>
    <div style={styles.value}>
      <div style={styles.link}>{value || item}</div>
    </div>
  </Box>
);

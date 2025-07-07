import React from "react";
import { Box } from "../../components/layout/Box";
import { ContractMetadata } from "../util/loadContractMetada";
import { Input, Link, Table, Text } from "@stellar/design-system";
import { AnyObject } from "../types/types";

interface RenderContractMetadataProps {
  metadata?: ContractMetadata;
}

const metaDocsLink =
  "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#contract-meta";

interface TableItem {
  val: string;
  key: string;
  id: string;
}
const RenderContractMetadata: React.FC<RenderContractMetadataProps> = ({
  metadata,
}) => {
  if (!metadata) return null;

  const getTableData = (data: unknown): TableItem[] => {
    if (typeof data !== "object" || data === null) {
      return [];
    }
    return Object.entries(data).map(([key, value]) => ({
      key: String(key),
      val: value as string,

      id: String(key),
    }));
  };

  return (
    <>
      <Input
        label="Contract Wasm Hash"
        id="contract-wasm-hash"
        fieldSize="md"
        copyButton={{
          position: "right",
        }}
        readOnly
        value={metadata?.wasmHash}
      />

      <Box gap="xs" direction="column">
        <h4 style={{ marginBottom: "0.5rem" }}>Metadata </h4>
        <Text as="span" size="xs" style={{ marginBottom: "0.5rem" }}>
          This section contains the metadata of the contract, which is a
          collection of key-value pairs that provide additional information
          about the contract. See{" "}
          <Link href={metaDocsLink} target="_blank" rel="noopener noreferrer">
            Contract Metadata Documentation
          </Link>{" "}
          for further details.
        </Text>
        <>
          <Table
            breakpoint={300}
            hideNumberColumn
            columnLabels={[]}
            data={getTableData({
              ...(metadata.contractmetav0 as AnyObject),
              ...(metadata.contractenvmetav0 as AnyObject),
            })}
            renderItemRow={(item: TableItem) => (
              <>
                <td
                  style={{
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <Text as="p" size="xs">
                    {item.key}
                  </Text>
                </td>
                <td
                  style={{
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <Text as="p" size="xs">
                    {item.val}
                  </Text>
                </td>
              </>
            )}
          />
        </>
      </Box>
    </>
  );
};

export default RenderContractMetadata;

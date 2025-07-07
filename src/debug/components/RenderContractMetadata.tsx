import React from "react";
import { Box } from "../../components/layout/Box";
import { ContractMetadata } from "../util/loadContractMetada";
import { Input, Table } from "@stellar/design-system";
import { AnyObject } from "../types/types";

interface RenderContractMetadataProps {
  metadata?: ContractMetadata;
}

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

      <Box gap="md" direction="column">
        <h4>Metadata </h4>
        <>
          <Table
            breakpoint={300}
            hideNumberColumn
            columnLabels={[
              { id: "key", label: "Key" },
              { id: "val", label: "Value" },
            ]}
            data={getTableData({
              ...(metadata.contractmetav0 as AnyObject),
              ...(metadata.contractenvmetav0 as AnyObject),
            })}
            renderItemRow={(item: TableItem) => (
              <>
                <td>{item.key}</td>
                <td>{item.val}</td>
              </>
            )}
          />
        </>
      </Box>
    </>
  );
};

export default RenderContractMetadata;

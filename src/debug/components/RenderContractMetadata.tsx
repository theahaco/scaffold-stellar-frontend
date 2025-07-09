import React from "react";
import { Box } from "../../components/layout/Box";
import { ContractMetadata } from "../util/loadContractMetada";
import {
  Badge,
  Card,
  Input,
  Label,
  Link,
  Table,
  Text,
} from "@stellar/design-system";

interface RenderContractMetadataProps {
  metadata?: ContractMetadata;
}

const metaDocsLink =
  "https://developers.stellar.org/docs/learn/fundamentals/contract-development/overview#contract-meta";

enum ContractMetadataType {
  SCEnvMetaEntry = "SCEnvMetaEntry",
  SCMetaEntry = "SCMetaEntry",
}

interface TableItem {
  metaType: ContractMetadataType;
  val: string;
  key: string;
  id: string;
}
const RenderContractMetadata: React.FC<RenderContractMetadataProps> = ({
  metadata,
}) => {
  if (!metadata) return null;

  const formatTableItems = (
    data: unknown,
    metaType: ContractMetadataType,
  ): TableItem[] => {
    if (typeof data !== "object" || data === null) {
      return [];
    }
    return Object.entries(data).map(([key, value]) => ({
      key: String(key),
      val: value as string,
      id: String(key),
      metaType: metaType,
    }));
  };

  const getTableData = (): TableItem[] => {
    const tableEntries: TableItem[] = [
      ...formatTableItems(
        metadata.contractmetav0,
        ContractMetadataType.SCMetaEntry,
      ),
      ...formatTableItems(
        metadata.contractenvmetav0,
        ContractMetadataType.SCEnvMetaEntry,
      ),
    ];
    return tableEntries;
  };

  const renderTextCell = (item: string) => (
    <td
      style={{
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
      }}
    >
      <Text as="p" size="xs">
        {item}
      </Text>
    </td>
  );

  const renderBadgeCell = (item: string) => (
    <td
      style={{
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
      }}
    >
      <Badge size="sm" variant="secondary">
        {item}
      </Badge>
    </td>
  );

  const renderRow = (key: string, val: string, type: ContractMetadataType) => (
    <>
      {renderBadgeCell(type)}
      {renderTextCell(key)}
      {renderTextCell(val)}
    </>
  );

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

      <Box gap="sm" direction="column">
        <Label size="sm" htmlFor="contract-metadata">
          Contract Metadata
        </Label>
        <Card variant="primary">
          <Text as="span" size="xs">
            This section contains the metadata of the contract, which is a
            collection of key-value pairs that provide additional information
            about the contract. This data is added to the contract during
            compilation and can be retrieved directly from the WASM file. See{" "}
            <Link href={metaDocsLink} target="_blank" rel="noopener noreferrer">
              Contract Metadata Documentation
            </Link>{" "}
            for further details.
          </Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginTop: "1.5rem",
            }}
          >
            <Table
              breakpoint={300}
              hideNumberColumn
              columnLabels={[
                { id: "type", label: "Type" },
                { id: "key", label: "Key" },
                { id: "value", label: "Value" },
              ]}
              data={getTableData()}
              renderItemRow={(item: TableItem) =>
                renderRow(item.key, item.val, item.metaType)
              }
            />
          </div>
        </Card>
      </Box>
    </>
  );
};

export default RenderContractMetadata;

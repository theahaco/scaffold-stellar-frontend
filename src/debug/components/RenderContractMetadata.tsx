import React from "react";
import { Box } from "../../components/layout/Box";
import MetadataCard from "./MetadataCard";
import { ContractMetadata } from "../util/loadContractMetada";
import { Input } from "@stellar/design-system";

interface RenderContractMetadataProps {
  metadata?: ContractMetadata;
}

const RenderContractMetadata: React.FC<RenderContractMetadataProps> = ({
  metadata,
}) => {
  if (!metadata) return null;

  const renderCards = (data: unknown) => {
    if (typeof data !== "object" || data === null) {
      return <MetadataCard title="Metadata" content={String(data)} />;
    }
    return Object.entries(data).map(([key, value]) => (
      <MetadataCard key={key} title={key} content={String(value)} />
    ));
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
          {metadata.contractmetav0 && renderCards(metadata.contractmetav0)}

          {metadata.contractenvmetav0 &&
            renderCards(metadata.contractenvmetav0)}
        </>
      </Box>
    </>
  );
};

export default RenderContractMetadata;

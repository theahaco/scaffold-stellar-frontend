import React, { useState, useEffect } from "react";
import { Layout, Code, Card, Button, Input } from "@stellar/design-system";
import { Client } from "@stellar/stellar-sdk/contract";
import { ContractForm } from "../debug/components/ContractForm.tsx";
import {
  ContractMetadata,
  loadContractMetadata,
} from "../debug/util/loadContractMetada.ts";
import { Box } from "../components/layout/Box.tsx";

// Dynamically import all contract clients under src/contracts/
const contractModules = import.meta.glob("../contracts/*.ts");

type ContractModule = {
  default: Client;
  metadata?: ContractMetadata;
};

type ContractMap = Record<string, ContractModule>;

const Debugger: React.FC = () => {
  const [contractMap, setContractMap] = useState<ContractMap>({});
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  useEffect(() => {
    const loadContracts = async () => {
      const loadedContracts: ContractMap = {};

      for (const [path, importFn] of Object.entries(contractModules)) {
        const filename = path.split("/").pop()?.replace(".ts", "") || "";

        if (filename && filename === "util") continue;

        try {
          const module = (await importFn()) as ContractModule;
          const metadata = await loadContractMetadata(
            module.default.options.contractId,
          );
          loadedContracts[filename] = { ...module, metadata };
        } catch (error) {
          console.warn(`Skipping contract ${filename} – import failed`, error);
        }
      }

      setContractMap(loadedContracts);
      setSelectedContract(Object.keys(loadedContracts)[0] || "");
      setIsLoading(false);
    };

    void loadContracts();
  }, []);

  const contractKeys = Object.keys(contractMap);

  if (isLoading) {
    return (
      <Layout.Content>
        <Layout.Inset>
          <p>Loading contracts...</p>
        </Layout.Inset>
      </Layout.Content>
    );
  }

  if (contractKeys.length === 0) {
    return (
      <Layout.Content>
        <Layout.Inset>
          <p>No contracts found in src/contracts/</p>
        </Layout.Inset>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content>
      {/* Top Info Box */}
      <Layout.Inset>
        <h2>Debug Contracts</h2>
        <p>
          You can debug & interact with your deployed contracts here. Check{" "}
          <Code size="md">src/contracts/*.ts</Code>
        </p>
        <hr />
      </Layout.Inset>

      {/* Contract Selector Pills */}
      <Layout.Inset>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1rem",
            marginTop: "1rem",
          }}
        >
          {contractKeys.map((key) => (
            <Button
              key={key}
              variant={selectedContract === key ? "primary" : "tertiary"}
              size="sm"
              onClick={() => setSelectedContract(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      </Layout.Inset>

      <Layout.Inset>
        <div style={{ marginTop: "0 2rem" }}>
          <div style={{ display: "flex", flexFlow: "column", gap: "1rem" }}>
            {/* Contract detail card */}
            <div
              style={{
                flexBasis: "30%",
                minWidth: "100%",
                alignSelf: "flex-start",
              }}
            >
              <Card variant="primary">
                <Box gap="md">
                  <h3>{selectedContract}</h3>

                  <Input
                    label="Contract ID"
                    id="contract-id"
                    fieldSize="md"
                    copyButton={{
                      position: "right",
                    }}
                    readOnly
                    value={
                      (
                        contractMap[selectedContract]
                          ?.default as unknown as Client
                      )?.options?.contractId || ""
                    }
                  />

                  {isDetailExpanded && (
                    <>
                      <Input
                        label="Contract Wasm Hash"
                        id="contract-wasm-hash"
                        fieldSize="md"
                        copyButton={{
                          position: "right",
                        }}
                        readOnly
                        value={
                          contractMap[selectedContract]?.metadata?.wasmHash
                        }
                      />

                      {(contractMap[selectedContract]?.metadata
                        ?.contractenvmetav0 as object) &&
                        contractMap[selectedContract]?.metadata
                          ?.contractenvmetav0 && (
                          <Box gap="md">
                            <h4>Env Metadata</h4>
                            {Object.keys(
                              contractMap[selectedContract]?.metadata
                                ?.contractenvmetav0 as object,
                            ).map((key) => (
                              <Box key={key} gap="sm">
                                <strong>{key}:</strong>{" "}
                                {String(
                                  (
                                    contractMap[selectedContract]?.metadata
                                      ?.contractenvmetav0 as Record<
                                      string,
                                      unknown
                                    >
                                  )[key],
                                )}
                              </Box>
                            ))}
                          </Box>
                        )}

                      {(contractMap[selectedContract]?.metadata
                        ?.contractmetav0 as object) &&
                        contractMap[selectedContract]?.metadata
                          ?.contractmetav0 && (
                          <Box gap="md">
                            <h4> Metadata</h4>

                            {Object.keys(
                              contractMap[selectedContract]?.metadata
                                .contractmetav0 as object,
                            ).map((key) => (
                              <Box key={key} gap="sm">
                                <strong>{key}:</strong>{" "}
                                {String(
                                  (
                                    contractMap[selectedContract]?.metadata
                                      ?.contractmetav0 as Record<
                                      string,
                                      unknown
                                    >
                                  )[key],
                                )}
                              </Box>
                            ))}
                          </Box>
                        )}
                    </>
                  )}
                </Box>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                  style={{ justifySelf: "flex-end", marginTop: "1rem" }}
                >
                  {isDetailExpanded ? "Hide Details" : "Show Details"}
                </Button>
              </Card>
            </div>

            {/* Contract methods and interactions */}
            <div style={{ flex: 1 }}>
              <ContractForm
                key={selectedContract}
                contractClient={contractMap[selectedContract]?.default}
                contractClientError={null}
              />
            </div>
          </div>
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default Debugger;

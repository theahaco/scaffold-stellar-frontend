import React, { useState, useEffect } from "react";
import { Layout, Code, Card, Button, Input } from "@stellar/design-system";
import { Client } from "@stellar/stellar-sdk/contract";
import { ContractForm } from "../debug/components/ContractForm.tsx";

// Dynamically import all contract clients under src/contracts/
const contractModules = import.meta.glob("../contracts/*.ts");

type ContractModule = {
  default: Client;
};

type ContractMap = Record<string, ContractModule>;

const Debugger: React.FC = () => {
  const [contractMap, setContractMap] = useState<ContractMap>({});
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContracts = async () => {
      const loadedContracts: ContractMap = {};

      for (const [path, importFn] of Object.entries(contractModules)) {
        const filename = path.split("/").pop()?.replace(".ts", "") || "";

        if (filename && filename !== "util") {
          try {
            const module = (await importFn()) as ContractModule;
            loadedContracts[filename] = module;
          } catch (error) {
            console.error(`Failed to load contract ${filename}:`, error);
          }
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
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* Contract detail card */}
          <div
            style={{
              flexBasis: "30%",
              alignSelf: "flex-start",
            }}
          >
            <Card variant="secondary">
              <h3>{selectedContract}</h3>

              <Input
                label="Contract ID"
                id="contract-id"
                fieldSize="md"
                copyButton={{
                  position: "right",
                }}
                value={
                  (contractMap[selectedContract]?.default as unknown as Client)
                    ?.options?.contractId || ""
                }
              />
            </Card>
          </div>

          {/* Contract methods and interactions */}
          <div style={{ flex: 1 }}>
            <ContractForm
              contractClient={contractMap[selectedContract]?.default}
              contractClientError={null}
            />
          </div>
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default Debugger;

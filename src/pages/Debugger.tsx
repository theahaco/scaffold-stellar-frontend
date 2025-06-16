import React, { useState } from "react";
import { Layout, Code, Card, Button, Input } from "@stellar/design-system";

import * as soroban_hello_world_contract from "../contracts/soroban_hello_world_contract.ts";
import * as fungible_token_contract from "../contracts/fungible_token_interface_example.ts";
import { Client } from "@stellar/stellar-sdk/contract";

const contractMap = {
  soroban_hello_world_contract,
  fungible_token_contract,
};

type ContractKey = keyof typeof contractMap;
const contractKeys = Object.keys(contractMap) as ContractKey[];

const Debugger: React.FC = () => {
  // State holding the selected contract key
  const [selectedContract, setSelectedContract] = useState<ContractKey>(
    contractKeys[0],
  );

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

          <div style={{ flexBasis: "30%" }}>
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
                  (contractMap[selectedContract].default as unknown as Client)
                    .options.contractId
                }
              />
            </Card>
          </div>

          {/* Contract methods and interactions */}
          <div style={{ flex: 1 }}>
            {/* TODO: Add components to interact with contract */}
          </div>
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default Debugger;

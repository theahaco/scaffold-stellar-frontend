import React, { useEffect, useState } from "react";
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

interface ContractMethod {
  name: string;
  args: {
    name: string;
    type: string;
  }[];
}

const toIgnore = [
  "Address",
  "AllowanceData",
  "AllowanceKey",
  "DataUrl",
  "I32",
  "I64",
  "I128",
  "I256",
  "Metadata",
  "ScString",
  "ScSymbol",
  "StorageKey",
  "U32",
  "U64",
  "U128",
  "U256",
];

const Debugger: React.FC = () => {
  // State holding the selected contract key
  const [selectedContract, setSelectedContract] = useState<ContractKey>(
    contractKeys[0]
  );
  const [contractMethods, setContractMethods] = useState<ContractMethod[]>([]);
  console.log(contractMethods);

  const getContractMethods = () => {
    const jsonSchema = contractMap[selectedContract].default.spec.jsonSchema();
    if (jsonSchema.definitions) {
      const methods: ContractMethod[] = [];
      for (const [key, value] of Object.entries(jsonSchema.definitions)) {
        if (!toIgnore.includes(key)) {
          if (typeof value === "boolean") continue;
          const args = value?.properties?.args;
          if (typeof args === "boolean") continue;
          if (
            args &&
            "properties" in args &&
            typeof args.properties === "object"
          ) {
            const functionArgs = [];
            for (const [argName, argSchema] of Object.entries(
              args.properties ?? {}
            )) {
              if (typeof argSchema === "boolean") continue;
              if ("$ref" in argSchema && typeof argSchema.$ref === "string") {
                const match = argSchema.$ref.match(/^#\/definitions\/(.+)$/);
                if (match) {
                  const defName = match[1];
                  const definition = jsonSchema.definitions?.[defName];
                  if (definition) {
                    functionArgs.push({ name: argName, type: defName });
                  }
                }
              }
            }
            methods.push({ name: key, args: functionArgs });
          }
        }
      }
      setContractMethods(methods);
    }
  };

  useEffect(() => {
    getContractMethods();
  });

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

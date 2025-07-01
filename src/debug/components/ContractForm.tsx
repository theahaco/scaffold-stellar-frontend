import { Alert, Card, Text } from "@stellar/design-system";
import { contract } from "@stellar/stellar-sdk";

import { Box } from "../../components/layout/Box";

import { InvokeContractForm } from "./InvokeContractForm";
import { useWallet } from "../../hooks/useWallet";

export const ContractForm = ({
  contractClient,
  contractClientError,
}: {
  contractClient: contract.Client;
  contractClientError: Error | null;
}) => {
  const { address: userPk } = useWallet();

  const contractSpecFuncs = contractClient.spec?.funcs();

  const renderFunctionCard = () =>
    contractSpecFuncs
      ?.filter((func) => !func.name().toString().includes("__"))
      ?.map((func) => {
        const funcName = func.name().toString();

        return (
          <InvokeContractForm
            key={funcName}
            funcName={funcName}
            contractClient={contractClient}
          />
        );
      });

  const renderError = () => (
    <Alert variant="error" placement="inline" title="Error">
      {contractClientError?.message}
    </Alert>
  );

  return (
    <Box gap="md">
      {!userPk ? (
        <Alert variant="warning" placement="inline" title="Connect wallet">
          A connected wallet is required to invoke this contract. Please connect
          your wallet to proceed.
        </Alert>
      ) : null}
      <Card variant="secondary">
        <Box gap="lg" data-testid="invoke-contract-container">
          <Text as="h2" size="md" weight="semi-bold">
            Invoke Contract
          </Text>

          {contractSpecFuncs ? renderFunctionCard() : null}
          {contractClientError ? renderError() : null}
        </Box>
      </Card>
    </Box>
  );
};

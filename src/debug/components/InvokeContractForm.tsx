/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useRef, useState } from "react";
import { Button, Card, Text, Textarea } from "@stellar/design-system";
import { BASE_FEE, contract } from "@stellar/stellar-sdk";
import { JSONSchema7 } from "json-schema";
import { Box } from "../../components/layout/Box";
import { useAccountSequenceNumber } from "../hooks/useAccountSequenceNumber";
import { useRpcPrepareTx } from "../hooks/useRpcPrepareTx";
import { useSimulateTx } from "../hooks/useSimulateTx";
import { useSubmitRpcTx } from "../hooks/useSubmitRpcTx";
import { isEmptyObject } from "../util/isEmptyObject";
import { dereferenceSchema } from "../util/dereferenceSchema";
import { getNetworkHeaders } from "../util/getNetworkHeaders";
import { getTxnToSimulate } from "../util/sorobanUtils";
import {
  AnyObject,
  SorobanInvokeValue,
  TransactionBuildParams,
  DereferencedSchemaType,
} from "../types/types";
import { useWallet } from "../../hooks/useWallet";
import { ErrorText } from "./ErrorText";
import { PrettyJsonTransaction } from "./PrettyJsonTransaction";
import { TransactionSuccessCard } from "./TransactionSuccessCard";
import { RpcErrorResponse } from "./ErrorResponse";
import { network } from "../../contracts/util";
import { JsonSchemaRenderer } from "./JsonSchemaRenderer";

const pageBodyStyles = {
  content: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem", // 16px
    padding: "1rem", // 16px
    backgroundColor: "var(--sds-clr-gray-03)",
    borderRadius: "0.5rem", // 8px
  },
  contentError: {
    border: "1px solid var(--sds-clr-red-06)",
  },
  scrollable: {
    maxWidth: "100%",
    maxHeight: "37.5rem", // 600px
    overflow: "auto" as const,
  },
};

export const InvokeContractForm = ({
  contractClient,
  funcName,
}: {
  contractClient: contract.Client;
  funcName: string;
}) => {
  const { address: userPk, signTransaction } = useWallet();

  const contractSpec = contractClient.spec;
  const contractId = contractClient.options.contractId;

  const [invokeError, setInvokeError] = useState<{
    message: string;
    methodType: string;
  } | null>(null);
  const [isExtensionLoading, setIsExtensionLoading] = useState(false);
  const [formValue, setFormValue] = useState<SorobanInvokeValue>({
    contract_id: contractId,
    function_name: funcName,
    args: {},
  });
  const [formError, setFormError] = useState<AnyObject>({});
  const [isGetFunction, setIsGetFunction] = useState(false);
  const [dereferencedSchema, setDereferencedSchema] =
    useState<DereferencedSchemaType | null>(null);

  const hasNoFormErrors = isEmptyObject(formError);

  const {
    data: sequenceNumberData,
    isFetching: isFetchingSequenceNumber,
    isLoading: isLoadingSequenceNumber,
    refetch: fetchSequenceNumber,
  } = useAccountSequenceNumber({
    publicKey: userPk || "",
    horizonUrl: network.horizonUrl,
    headers: getNetworkHeaders(network, "horizon"),
    uniqueId: funcName,
    enabled: !!userPk,
  });

  const {
    mutate: simulateTx,
    data: simulateTxData,
    isError: isSimulateTxError,
    isPending: isSimulateTxPending,
    reset: resetSimulateTx,
  } = useSimulateTx();

  const {
    mutate: prepareTx,
    isPending: isPrepareTxPending,
    data: prepareTxData,
    reset: resetPrepareTx,
  } = useRpcPrepareTx();

  const {
    data: submitRpcResponse,
    mutate: submitRpc,
    error: submitRpcError,
    isPending: isSubmitRpcPending,
    isSuccess: isSubmitRpcSuccess,
    isError: isSubmitRpcError,
    reset: resetSubmitRpc,
  } = useSubmitRpcTx();

  const responseSuccessEl = useRef<HTMLDivElement | null>(null);
  const responseErrorEl = useRef<HTMLDivElement | null>(null);

  const signTx = async (xdr: string): Promise<string | null> => {
    if (!signTransaction || !userPk) {
      return null;
    }

    setIsExtensionLoading(true);

    if (userPk) {
      try {
        console.log("Signing transaction with extension:", network);
        const result = await signTransaction(xdr || "", {
          address: userPk,
          networkPassphrase: network.passphrase,
        });

        console.log("Transaction signed:", result);

        if (result.signedTxXdr && result.signedTxXdr !== "") {
          return result.signedTxXdr;
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message) {
          setInvokeError({ message: error.message, methodType: "sign" });
        }
      } finally {
        setIsExtensionLoading(false);
      }
    }
    return null;
  };

  useEffect(() => {
    if (contractSpec) {
      const schema = dereferenceSchema(
        contractSpec?.jsonSchema(funcName),
        funcName,
      );

      setDereferencedSchema(schema);
    }
  }, [contractSpec, funcName]);

  const handleChange = (value: SorobanInvokeValue) => {
    setInvokeError(null);
    setFormValue(value);
  };

  const isSimulating =
    isLoadingSequenceNumber ||
    isFetchingSequenceNumber ||
    isSimulateTxPending ||
    isPrepareTxPending;

  const resetSubmitState = () => {
    if (submitRpcError || submitRpcResponse) {
      resetSubmitRpc();
    }
  };

  const resetSimulateState = () => {
    if (isSimulateTxError || (simulateTxData && "result" in simulateTxData)) {
      resetSimulateTx();
    }
  };

  const handleSubmit = async () => {
    if (!prepareTxData?.transactionXdr) {
      setInvokeError({
        message: "No transaction data available to sign",
        methodType: "submit",
      });
      return;
    }
    resetSimulateState();
    resetSubmitState();

    try {
      const signedTxXdr = await signTx(prepareTxData.transactionXdr);
      if (!signedTxXdr) {
        throw new Error(
          "Transaction signing failed - no signed transaction received",
        );
      }
      submitRpc({
        rpcUrl: network.rpcUrl,
        transactionXdr: signedTxXdr,
        networkPassphrase: network.passphrase,
        headers: getNetworkHeaders(network, "rpc"),
      });
    } catch (error: unknown) {
      setInvokeError({
        message: (error as Error)?.message || "Failed to sign transaction",
        methodType: "submit",
      });
    }
  };

  const handleSimulate = async () => {
    // reset
    setInvokeError(null);
    resetSimulateState();
    resetSubmitState();
    resetPrepareTx();

    try {
      // fetch sequence number first
      await fetchSequenceNumber();

      if (!sequenceNumberData) {
        throw new Error("Failed to fetch sequence number. Please try again.");
      }

      const txnParams: TransactionBuildParams = {
        source_account: userPk || "",
        fee: BASE_FEE,
        seq_num: sequenceNumberData,
        cond: {
          time: {
            min_time: "0",
            max_time: "0",
          },
        },
        memo: {},
      };

      const sorobanOperation = {
        operation_type: "invoke_contract_function",
        params: {
          contract_id: formValue.contract_id,
          function_name: formValue.function_name,
          args: formValue.args,
        },
      };

      const { xdr, error: simulateError } = getTxnToSimulate(
        formValue,
        txnParams,
        sorobanOperation,
        network.passphrase,
      );

      if (xdr) {
        simulateTx({
          rpcUrl: network.rpcUrl,
          transactionXdr: xdr,
          headers: getNetworkHeaders(network, "rpc"),
        });

        // using prepareTransaction instead of assembleTransaction because
        // assembleTransaction requires an auth, but signing for simulation is rare
        prepareTx({
          rpcUrl: network.rpcUrl,
          transactionXdr: xdr,
          networkPassphrase: network.passphrase,
          headers: getNetworkHeaders(network, "rpc"),
        });
      }

      if (simulateError) {
        setInvokeError({ message: simulateError, methodType: "simulate" });
      }
    } catch (error: unknown) {
      setInvokeError({
        message:
          (error as Error)?.message ||
          "Failed to simulate transaction. Please try again.",
        methodType: "simulate",
      });
    }
  };

  const renderTitle = (name: string, description?: string) => (
    <>
      <Text size="sm" as="div" weight="bold">
        {name}
      </Text>
      {description ? (
        <Textarea
          id={`invoke-contract-description-${name}`}
          fieldSize="md"
          disabled
          rows={description.length > 100 ? 7 : 1}
          value={description}
          spellCheck="false"
        >
          {description}
        </Textarea>
      ) : null}
    </>
  );

  useEffect(() => {
    if (dereferencedSchema && !dereferencedSchema?.required.length) {
      setIsGetFunction(true);
    } else {
      setIsGetFunction(false);
    }
  }, [dereferencedSchema]);

  const renderSchema = () => {
    if (!contractSpec || !dereferencedSchema) {
      return null;
    }

    return (
      <Box gap="md">
        {renderTitle(funcName, dereferencedSchema?.description)}
        {formValue.contract_id &&
          formValue.function_name &&
          dereferencedSchema && (
            <JsonSchemaRenderer
              name={funcName}
              schema={dereferencedSchema as JSONSchema7}
              onChange={handleChange}
              formError={formError}
              setFormError={setFormError}
              parsedSorobanOperation={formValue}
            />
          )}
      </Box>
    );
  };

  const renderResponse = () => {
    const { result: simulateResult } = simulateTxData || {};
    const { result: submitResult } = submitRpcResponse || {};

    const result = simulateResult || submitResult;

    if (result) {
      return (
        <Box gap="md">
          <div
            data-testid="invoke-contract-simulate-tx-response"
            style={{
              ...pageBodyStyles.content,
              ...pageBodyStyles.scrollable,
              ...(result && "error" in result
                ? pageBodyStyles.contentError
                : {}),
            }}
          >
            <PrettyJsonTransaction
              json={result}
              xdr={result && "xdr" in result}
            />
          </div>
        </Box>
      );
    }

    return null;
  };

  const renderSuccess = () => {
    if (isSubmitRpcSuccess && submitRpcResponse && network.id) {
      return (
        <div ref={responseSuccessEl}>
          <TransactionSuccessCard response={submitRpcResponse} />
        </div>
      );
    }

    return null;
  };

  const renderError = () => {
    if (submitRpcError) {
      return (
        <div ref={responseErrorEl}>
          <RpcErrorResponse error={submitRpcError} />
        </div>
      );
    }

    if (invokeError?.message) {
      return (
        <div ref={responseErrorEl}>
          <ErrorText
            errorMessage={`${invokeError.methodType}: ${invokeError.message}`}
            size="sm"
          />
        </div>
      );
    }

    return null;
  };

  /*
    isSubmitDisabled is true if:
    - there is an invoke error from simulation or signing
    - there is a submit rpc error
    - the transaction is simulating
    - the wallet is not connected
    - there are form validation errors
    - the transaction data from simulation is not available (needed to submit)
  */

  const simulatedResultResponse =
    simulateTxData?.result?.transactionData ||
    simulateTxData?.result?.transactionDataJson;

  const isSubmitDisabled =
    !!invokeError?.message ||
    isSubmitRpcError ||
    isSimulating ||
    !userPk ||
    !hasNoFormErrors ||
    !simulatedResultResponse;
  const isSimulationDisabled = () => {
    const disabled = !isGetFunction && !Object.keys(formValue.args).length;
    return !userPk || !hasNoFormErrors || disabled;
  };

  return (
    <Card>
      <div className="ContractInvoke">
        <Box gap="md">
          {renderSchema()}

          <Box gap="sm" direction="row" align="end" justify="end" wrap="wrap">
            <Button
              size="md"
              variant="tertiary"
              disabled={isSimulationDisabled()}
              isLoading={isSimulating}
              onClick={() => void handleSimulate()}
            >
              Simulate
            </Button>

            <Button
              size="md"
              variant="secondary"
              isLoading={isExtensionLoading || isSubmitRpcPending}
              disabled={isSubmitDisabled}
              onClick={() => void handleSubmit()}
            >
              Submit
            </Button>
          </Box>

          <>{renderResponse()}</>
          <>{renderSuccess()}</>
          <>{renderError()}</>
        </Box>
      </div>
    </Card>
  );
};

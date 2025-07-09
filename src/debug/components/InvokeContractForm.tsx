/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Icon,
  Text,
  Textarea,
  Tooltip,
} from "@stellar/design-system";
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
import { ValidationResponseCard } from "./ValidationResponseCard";
import { Api } from "@stellar/stellar-sdk/rpc";

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
  // Based on whether the function requires input arguments
  const [isGetFunction, setIsGetFunction] = useState(false);
  // Based on reads and writes to the contract
  // Can only be determined based on the simulation result
  const [isWriteFn, setIsWriteFn] = useState<boolean | undefined>(undefined);
  const [dereferencedSchema, setDereferencedSchema] =
    useState<DereferencedSchemaType | null>(null);
  // used to delay the simulation until after the sequence number is fetched
  const [isSimulationQueued, setSimulationQueued] = useState(false);
  // Used to delay a submit until after a simulation is complete
  const [isSubmitQueued, setSubmissionQueued] = useState(false);

  const [isReadTooltipVisible, setIsReadTooltipVisible] = useState(false);

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
        const result = await signTransaction(xdr || "", {
          address: userPk,
          networkPassphrase: network.passphrase,
        });

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

  const isSuccessfulSimulation =
    simulateTxData &&
    "result" in simulateTxData &&
    !simulateTxData.result.error;

  const isFailedSimulation =
    simulateTxData && "result" in simulateTxData && simulateTxData.result.error;

  useEffect(() => {
    if (isSuccessfulSimulation) {
      const result =
        simulateTxData.result as Api.RawSimulateTransactionResponse;
      const simulationChangesState =
        result.stateChanges && result.stateChanges.length > 0;

      if (isSubmitQueued && !isSimulationQueued && prepareTxData) {
        void triggerSubmit();
      }

      if (simulationChangesState) {
        setIsWriteFn(true);
        return;
      }

      setIsWriteFn(false);
      return;
    }

    if (isFailedSimulation) {
      setSubmissionQueued(false);
      setIsWriteFn(undefined);
    }
  }, [simulateTxData, isSimulationQueued, prepareTxData]);

  useEffect(() => {
    if (isSimulationQueued && !isFetchingSequenceNumber) {
      void triggerSimulate();
    }
  }, [sequenceNumberData, isFetchingSequenceNumber]);

  const handleChange = (value: SorobanInvokeValue) => {
    setInvokeError(null);
    setFormValue(value);
    resetSimulateTx();
    resetPrepareTx();
    resetSubmitRpc();
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

  const handleSimulate = async () => {
    setInvokeError(null);
    resetSimulateState();
    resetSubmitState();
    resetPrepareTx();

    setSimulationQueued(true);

    await fetchSequenceNumber();
  };

  const handleSubmit = async () => {
    setSubmissionQueued(true);
    return handleSimulate();
  };

  const triggerSubmit = async () => {
    setSubmissionQueued(false);

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

  const triggerSimulate = () => {
    try {
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

    setSimulationQueued(false);
  };

  const renderReadWriteBadge = (isWriteFn: boolean | undefined) => {
    if (isWriteFn === undefined) return null;

    const badge = (
      <Badge
        icon={isWriteFn ? <Icon.Pencil01 /> : <Icon.Eye />}
        variant={isWriteFn ? "secondary" : "success"}
        iconPosition="left"
      >
        {isWriteFn ? "Write" : "Read"}
      </Badge>
    );

    return !isWriteFn ? (
      <div
        onMouseEnter={() => setIsReadTooltipVisible(true)}
        onMouseLeave={() => setIsReadTooltipVisible(false)}
        style={{ cursor: "pointer" }}
      >
        <Tooltip
          isVisible={isReadTooltipVisible}
          isContrast
          title="Read Only"
          placement="right-end"
          triggerEl={badge}
        >
          {`When a transaction doesn't change the state of the contract, it is
               considered a read operation. \nIn this scenario, it is not
               necessary to submit the transaction to the network, as it does not
               modify any data. \nYou can simply simulate the transaction to see
               the results without incurring any costs.`}
        </Tooltip>
      </div>
    ) : (
      badge
    );
  };

  const renderTitle = (name: string) => (
    <>
      <Box gap="sm" direction="row">
        <Text size="sm" as="div" weight="bold">
          {name}
        </Text>
        {renderReadWriteBadge(isWriteFn)}
      </Box>
    </>
  );

  const renderRustDoc = (description?: string) => {
    if (!description) return null;

    return (
      <Textarea
        id={`invoke-contract-description-${funcName}`}
        label="Rustdoc"
        infoText="This description is auto-generated from the contract's Rust documentation. It can be edited in the contract's source code."
        infoTextIcon={<Icon.InfoCircle />}
        fieldSize="sm"
        wrap="on"
        rows={description.length > 100 ? 4 : 1}
        value={description}
        spellCheck="false"
        readOnly
      >
        {description}
      </Textarea>
    );
  };

  const isEmptySchema =
    Object.entries(dereferencedSchema?.properties || {}).length === 0;

  useEffect(() => {
    if (dereferencedSchema && !dereferencedSchema?.required.length) {
      setIsGetFunction(true);
    } else {
      setIsGetFunction(false);
    }
  }, [dereferencedSchema]);

  const renderSchema = () => {
    if (!contractSpec || !contractSpec.jsonSchema) {
      return null;
    }

    return (
      <Box gap="md">
        <Box gap="sm" direction="row" justify="space-between" align="center">
          {renderTitle(funcName)}
          {isEmptySchema && renderButtons()}
        </Box>
        {renderRustDoc(dereferencedSchema?.description)}
        {formValue.contract_id &&
          formValue.function_name &&
          dereferencedSchema &&
          !isEmptySchema && (
            <JsonSchemaRenderer
              name={funcName}
              schema={dereferencedSchema as JSONSchema7}
              onChange={handleChange}
              formError={formError}
              setFormError={setFormError}
              parsedSorobanOperation={formValue}
              isWriteFn={isWriteFn}
            />
          )}
      </Box>
    );
  };

  const renderResponse = () => {
    const { result: simulateResult } = simulateTxData || {};
    const { result: submitResult } = submitRpcResponse || {};

    const result = simulateResult || submitResult;

    const simulationSummary = isSuccessfulSimulation ? (
      <Alert variant="success" placement="inline" title="Successful Simulation">
        {`The Simulation succeeded with
        ${
          (
            simulateResult as Api.RawSimulateTransactionResponse
          ).results?.filter(
            (r) => "returnValueJson" in r && r.returnValueJson !== "void",
          ).length || 0
        }
        returned value(s).`}
      </Alert>
    ) : isFailedSimulation ? (
      <Alert variant="error" placement="inline" title="Simulation Failed">
        {simulateResult?.error}`
      </Alert>
    ) : null;

    if (result && !isSuccessfulTxExection) {
      return (
        <ValidationResponseCard
          variant="primary"
          title="Response"
          note={<></>}
          summary={simulationSummary}
          detailedResponse={
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
          }
        />
      );
    }

    return null;
  };

  const isSuccessfulTxExection =
    isSubmitRpcSuccess && submitRpcResponse && network.id;

  const renderSuccess = () => {
    if (isSuccessfulTxExection) {
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

  const renderButtons = () => (
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
  );

  const isSimulationDisabled = () => {
    const disabled = !isGetFunction && !Object.keys(formValue.args).length;
    return !userPk || !hasNoFormErrors || disabled;
  };

  const isSubmitDisabled =
    !!invokeError?.message ||
    isSimulating ||
    !userPk ||
    !hasNoFormErrors ||
    isSimulationDisabled();
  return (
    <Card>
      <div className="ContractInvoke">
        <Box gap="md" direction={isEmptyObject({ a: true }) ? "row" : "column"}>
          {renderSchema()}
          {!isEmptySchema && renderButtons()}
          <>{renderResponse()}</>
          <>{renderSuccess()}</>
          <>{renderError()}</>
        </Box>
      </div>
    </Card>
  );
};

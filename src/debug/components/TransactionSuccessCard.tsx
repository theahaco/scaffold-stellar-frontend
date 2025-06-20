/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Box } from "../../components/layout/Box";
import { TxResponse } from "./TxResponse";
import { ValidationResponseCard } from "./ValidationResponseCard";
import { SubmitRpcResponse } from "../types/types";
import init, { decode } from "@stellar/stellar-xdr-json";
import { PrettyJsonTextarea } from "./PrettyJsonTextarea";

interface TransactionSuccessCardProps {
  response: SubmitRpcResponse;
}

await init();

export const TransactionSuccessCard = ({
  response,
}: TransactionSuccessCardProps) => {
  return (
    <ValidationResponseCard
      variant="success"
      title="Transaction submitted!"
      subtitle={`Transaction succeeded with ${response.operationCount} operation(s)`}
      note={<></>}
      response={
        <Box gap="lg">
          <TxResponse
            data-testid="submit-tx-rpc-success-hash"
            label="Hash:"
            value={response.hash}
          />

          <TxResponse
            data-testid="submit-tx-rpc-success-ledger"
            label="Ledger number:"
            value={response.result.ledger.toString()}
          />
          <TxResponse
            data-testid="submit-tx-rpc-success-envelope-xdr"
            label="Transaction Envelope:"
            item={
              <PrettyJsonTextarea
                label=""
                isCodeWrapped={true}
                json={JSON.parse(
                  decode(
                    "TransactionEnvelope",
                    response.result.envelopeXdr.toXDR("base64").toString(),
                  ),
                )}
              />
            }
          />

          <TxResponse
            data-testid="submit-tx-rpc-success-result-xdr"
            label="Transaction Result:"
            item={
              <PrettyJsonTextarea
                label=""
                isCodeWrapped={true}
                json={JSON.parse(
                  decode(
                    "TransactionResult",
                    response.result.resultXdr.toXDR("base64").toString(),
                  ),
                )}
              />
            }
          />
          <TxResponse
            data-testid="submit-tx-rpc-success-result-meta-xdr"
            label="Transaction Result Meta:"
            item={
              <PrettyJsonTextarea
                label=""
                isCodeWrapped={true}
                json={JSON.parse(
                  decode(
                    "TransactionMeta",
                    response.result.resultMetaXdr.toXDR("base64").toString(),
                  ),
                )}
              />
            }
          />

          <TxResponse label="Fee:" value={response.fee} />
        </Box>
      }
    />
  );
};

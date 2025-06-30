import { Box } from "../../components/layout/Box";
import { TxResponse } from "./TxResponse";
import { ValidationResponseCard } from "./ValidationResponseCard";
import { SubmitRpcResponse } from "../types/types";

import { XdrJsonViewer } from "./XdrJsonViewer";

interface TransactionSuccessCardProps {
  response: SubmitRpcResponse;
}

export const TransactionSuccessCard = ({
  response,
}: TransactionSuccessCardProps) => {
  return (
    <ValidationResponseCard
      variant="success"
      title="Transaction submitted!"
      subtitle={`Transaction succeeded with ${response.operationCount} operation(s)`}
      note={<></>}
      detailedResponse={
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
              <XdrJsonViewer
                xdr={response.result.envelopeXdr.toXDR("base64").toString()}
                typeVariant="TransactionEnvelope"
              />
            }
          />

          <TxResponse
            data-testid="submit-tx-rpc-success-result-xdr"
            label="Transaction Result:"
            item={
              <XdrJsonViewer
                xdr={response.result.resultXdr.toXDR("base64").toString()}
                typeVariant="TransactionResult"
              />
            }
          />
          <TxResponse
            data-testid="submit-tx-rpc-success-result-meta-xdr"
            label="Transaction Result Meta:"
            item={
              <XdrJsonViewer
                xdr={response.result.resultMetaXdr.toXDR("base64").toString()}
                typeVariant="TransactionMeta"
              />
            }
          />

          <TxResponse label="Fee:" value={response.fee} />
        </Box>
      }
    />
  );
};

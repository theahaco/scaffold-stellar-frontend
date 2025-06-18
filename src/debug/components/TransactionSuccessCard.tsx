import { Box } from "../../components/layout/Box";
import { TxResponse } from "./TxResponse";
import { ValidationResponseCard } from "./ValidationResponseCard";
import { SubmitRpcResponse } from "../types/types";

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
      response={
        <Box gap="xs">
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
            label="Envelope XDR:"
            value={response.result.envelopeXdr.toXDR("base64").toString()}
          />
          <TxResponse
            data-testid="submit-tx-rpc-success-result-xdr"
            label="Result XDR:"
            value={response.result.resultXdr.toXDR("base64").toString()}
          />
          <TxResponse
            data-testid="submit-tx-rpc-success-result-meta-xdr"
            label="Result Meta XDR:"
            value={response.result.resultMetaXdr.toXDR("base64").toString()}
          />
          <TxResponse label="Fee:" value={response.fee} />
        </Box>
      }
    />
  );
};

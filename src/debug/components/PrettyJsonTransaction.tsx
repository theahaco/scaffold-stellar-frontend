import { useEffect } from "react";
import { toSafeNumberOrThrow } from "lossless-json";

import { PrettyJson } from "./PrettyJson";
import { signatureHint } from "../util/signatureHint";
import { xdrUtils } from "../util/xdrUtils";
import { formatAmount } from "../util/formatAmount";
import { getNetworkHeaders } from "../util/getNetworkHeaders";

import { useCheckTxSignatures } from "../hooks/useCheckTxSignatures";

import { AnyObject } from "../types/types";
import { network } from "../../contracts/util";

type PrettyJsonTransactionProps = {
  xdr: string;
  json: AnyObject;
};

export const PrettyJsonTransaction = ({
  xdr,
  json,
}: PrettyJsonTransactionProps) => {
  const { data, isFetching, isLoading, refetch } = useCheckTxSignatures({
    xdr,
    networkPassphrase: network.passphrase,
    networkUrl: network.horizonUrl,
    headers: getNetworkHeaders(network, "horizon"),
  });

  const isTx = Boolean(json?.tx || json?.tx_fee_bump);

  useEffect(() => {
    // Check transaction signatures
    if (isTx) {
      void refetch();
    }
  }, [isTx, refetch]);

  const customValueRenderer = (
    item: unknown,
    key: string,
    parentKey?: string,
  ): React.ReactNode => {
    // Signature hint
    if (parentKey === "signatures" && key === "hint") {
      return PrettyJson.renderStringValue({
        item: signatureHint(item as string),
      });
    }

    // Signature check
    if (data && parentKey === "signatures" && key === "signature") {
      const match =
        typeof item === "string"
          ? data.find((s) => s.sig.equals(Buffer.from(item, "hex")))
          : undefined;

      if (match) {
        return PrettyJson.renderStringValue({
          item: item as string,
        });
      }

      return item as string;
    }

    // Amount
    const amountKeys = [
      "amount",
      "buy_amount",
      "starting_balance",
      "send_max",
      "send_amount",
      "dest_min",
      "dest_amount",
      "limit",
    ];

    if (amountKeys.includes(key)) {
      const parsedAmount = xdrUtils.fromAmount(item as string);
      let formattedAmount = "";

      try {
        formattedAmount = formatAmount(toSafeNumberOrThrow(parsedAmount));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // It might fail for BigInt
        formattedAmount = formatAmount(Number(parsedAmount));
      }

      if (formattedAmount) {
        return PrettyJson.renderStringValue({
          item: `${formattedAmount} (raw: ${item as string})`,
          itemType: "number",
        });
      }

      return PrettyJson.renderStringValue({ item: item as string });
    }

    // Manage data
    if (parentKey === "manage_data") {
      if (key === "data_name") {
        return PrettyJson.renderStringValue({
          item: `${item as string} (hex: ${Buffer.from(item as string).toString("base64")})`,
        });
      }

      if (key === "data_value") {
        return PrettyJson.renderStringValue({
          item: `${Buffer.from(item as string, "hex").toString()} (hex: ${Buffer.from(item as string, "hex").toString("base64")})`,
        });
      }
    }

    return null;
  };

  const customKeyRenderer = (item: unknown, key: string) => {
    if (key === "signatures" && Array.isArray(item) && item.length > 0) {
      return <div className="PrettyJson__key__note">· Signatures Checked</div>;
    }

    return null;
  };

  return (
    <PrettyJson
      json={json}
      customValueRenderer={customValueRenderer}
      customKeyRenderer={customKeyRenderer}
      isLoading={isLoading || isFetching}
    />
  );
};

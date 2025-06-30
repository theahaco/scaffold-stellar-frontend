/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import { PrettyJsonTextarea } from "./PrettyJsonTextarea";
import { decode, guess, initialize } from "../util/StellarXdr";
import { Button, Code, Icon } from "@stellar/design-system";

interface Props {
  xdr: string;
  typeVariant?: string;
}

await initialize();

export const XdrJsonViewer = ({ xdr, typeVariant }: Props) => {
  const [displayFormatted, setDisplayFormatted] = useState<"XDR" | "JSON">(
    "XDR",
  );

  const toggleDisplay = () => {
    setDisplayFormatted((prev) => (prev === "XDR" ? "JSON" : "XDR"));
  };

  let decodeTypeVariant = typeVariant;
  if (!decodeTypeVariant) {
    const validXdrTypes = guess(xdr);
    if (validXdrTypes.length === 0) {
      throw new Error("Invalid XDR type");
    }
    decodeTypeVariant = validXdrTypes[0];
  }

  const parsedJson = JSON.parse(decode(decodeTypeVariant, xdr));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {displayFormatted === "XDR" && <Code size="sm">{xdr}</Code>}
      {displayFormatted === "JSON" && (
        <PrettyJsonTextarea label="" isCodeWrapped={true} json={parsedJson} />
      )}
      <Button
        title={`View as ${displayFormatted === "XDR" ? "JSON" : "XDR"}`}
        variant="tertiary"
        size="sm"
        onClick={toggleDisplay}
        iconPosition="left"
        icon={displayFormatted === "XDR" ? <Icon.Brackets /> : <Icon.Code01 />}
        style={
          {
            alignSelf: "flex-end",
          } as React.CSSProperties
        }
      >
        {displayFormatted === "XDR" ? "JSON " : "XDR"}
      </Button>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import { PrettyJsonTextarea } from "./PrettyJsonTextarea";
import { decode, guess, initialize } from "../util/StellarXdr";
import { Code, Icon } from "@stellar/design-system";

interface Props {
  xdr: string;
  typeVariant?: string;
}

const variant = {
  toggled: {
    backgroundColor: "#f0f0f0",
    color: "#333",
    padding: "0.25rem 0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "4px",
  },
  untoggled: {
    backgroundColor: "#C9C8C8",
    color: "#333",
    padding: "0.25rem 0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "4px",
  },
};

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
      <div
        style={{
          alignSelf: "flex-end",
          cursor: "pointer",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.25rem",
          borderRadius: "4px",
          backgroundColor: "#C9C8C8",
          color: "#333",
        }}
        title={`View as ${displayFormatted === "XDR" ? "JSON" : "XDR"}`}
        onClick={toggleDisplay}
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div
            style={
              displayFormatted === "XDR" ? variant.toggled : variant.untoggled
            }
          >
            <Icon.Code01 />
            XDR
          </div>
          <div
            style={
              displayFormatted === "JSON" ? variant.toggled : variant.untoggled
            }
          >
            <Icon.Brackets />
            JSON
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Property } from "csstype";

interface Props {
  children?: React.ReactNode;
  title?: string;
  cursor?: Property.Cursor;
  textColor?: string;
  bgColor?: string;
}

const Pill: React.FC<Props> = ({
  children,
  title,
  cursor,
  textColor,
  bgColor,
}: Props) => {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "4px 10px",
        borderRadius: "16px",
        fontSize: "12px",

        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        cursor: cursor || "default",
      }}
      title={title}
    >
      {children}
    </div>
  );
};

export default Pill;

import React from "react";

// Define gap values (you may need to adjust these based on your design system)
const gapValues = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  xxl: "3rem", // 48px
};

export const Box = ({
  gap,
  children,
  customValue,
  addlClassName,
  direction = "column",
  justify = "baseline",
  align = "stretch",
  wrap,
  style,
  ...props
}: (
  | { gap: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"; customValue?: undefined }
  | { gap: "custom"; customValue: string }
) & {
  children: React.ReactElement | React.ReactElement[] | React.ReactNode;
  addlClassName?: string;
  direction?: "column" | "row" | "column-reverse" | "row-reverse";
  justify?:
    | "center"
    | "space-between"
    | "space-around"
    | "end"
    | "left"
    | "right"
    | "baseline";
  align?: "center" | "end" | "start" | "baseline" | "stretch";
  wrap?: "nowrap" | "wrap";
  style?: React.CSSProperties;
}) => {
  const boxStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    gap: gap === "custom" ? customValue : gapValues[gap],
    ...(wrap ? { flexWrap: wrap } : {}),
    ...style,
  };

  return (
    <div className={addlClassName} style={boxStyle} {...props}>
      {children}
    </div>
  );
};

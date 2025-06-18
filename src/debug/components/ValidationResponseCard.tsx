import { Card, Text } from "@stellar/design-system";
import { Box } from "../../components/layout/Box";

type ValidationResponseCard = {
  variant: "primary" | "success" | "error";
  title: string | React.ReactNode;
  response: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  note?: string | React.ReactNode;
  footerLeftEl?: React.ReactNode;
  footerRightEl?: React.ReactNode;
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
  },
  title: (variant: "primary" | "success" | "error") => ({
    color:
      variant === "success"
        ? "var(--sds-clr-green-11)"
        : variant === "error"
          ? "var(--sds-clr-red-11)"
          : "var(--sds-clr-gray-12)",
  }),
  subtitle: {
    color: "var(--sds-clr-gray-11)",
  } as React.CSSProperties,
  note: {
    color: "var(--sds-clr-gray-11)",
  } as React.CSSProperties,
  content: {
    fontSize: "14px",
    lineHeight: "20px",
    color: "var(--sds-clr-gray-12)",
    fontFamily: "var(--sds-ff-monospace)",
    fontWeight: "var(--sds-fw-medium)",
    padding: "1rem",
    wordWrap: "break-word" as const,
    overflowY: "auto" as const,
  } as React.CSSProperties,
  footer: {
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  footerButtons: {
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  responsiveButtons: {
    "@media (max-width: 440px)": {
      width: "100%",
      flex: 1,
    },
  } as React.CSSProperties,
};

export const ValidationResponseCard = ({
  variant,
  title,
  response,
  subtitle,
  note,
  footerLeftEl,
  footerRightEl,
}: ValidationResponseCard) => {
  return (
    <Card>
      <Box gap="xs" style={styles.container}>
        <>
          <Text
            as="div"
            size="sm"
            weight="medium"
            style={styles.title(variant)}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text as="div" size="xs" weight="medium" style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}

          <Card variant="secondary" noPadding>
            <div style={styles.content}>
              {response}
              <style>
                {`
                  .ValidationResponseCard__content ul {
                    font-size: inherit;
                    line-height: inherit;
                    font-family: var(--sds-ff-monospace);
                    font-weight: var(--sds-fw-medium);
                    padding-left: 1rem;
                  }
                  @media screen and (max-width: 440px) {
                    .ValidationResponseCard__footer--leftEl,
                    .ValidationResponseCard__footer--rightEl {
                      width: 100%;
                    }
                    .ValidationResponseCard__footer--leftEl .Button,
                    .ValidationResponseCard__footer--rightEl .Button {
                      flex: 1;
                    }
                  }
                `}
              </style>
            </div>
          </Card>

          {footerLeftEl || footerRightEl || note ? (
            <Box gap="lg">
              <>
                {note ? (
                  <Text as="div" size="xs" weight="regular" style={styles.note}>
                    {note}
                  </Text>
                ) : null}

                {footerLeftEl || footerRightEl ? (
                  <Box
                    gap="sm"
                    direction="row"
                    align="center"
                    justify="space-between"
                    style={styles.footer}
                    wrap="wrap"
                  >
                    <>
                      {footerLeftEl ? (
                        <Box
                          gap="sm"
                          direction="row"
                          style={styles.footerButtons}
                          wrap="wrap"
                        >
                          <>{footerLeftEl}</>
                        </Box>
                      ) : null}

                      {footerRightEl ? (
                        <Box
                          gap="sm"
                          direction="row"
                          justify="right"
                          style={styles.footerButtons}
                          wrap="wrap"
                        >
                          <>{footerRightEl}</>
                        </Box>
                      ) : null}
                    </>
                  </Box>
                ) : null}
              </>
            </Box>
          ) : null}
        </>
      </Box>
    </Card>
  );
};

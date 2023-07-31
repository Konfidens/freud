import { type CSS, styled } from "../../../stitches";

const StyledCell = styled("td", {
  px: "$3",
  py: "$3",
  color: "$textBody",

  "&:first-of-type": {
    pl: "$6",
  },
  "&:last-of-type": {
    pr: "$6",
  },

  variants: {
    tabularNumbers: {
      true: {
        fontVariantNumeric: "tabular-nums",
      },
      false: {},
    },
    align: {
      left: {
        textAlign: "left",
      },
      center: {
        textAlign: "center",
      },
      right: {
        textAlign: "right",
      },
    },
  },
  defaultVariants: {
    tabularNumbers: "false",
    align: "left",
  },
});

type Props = {
  header?: boolean;
  children: React.ReactNode;
  tabularNumbers?: boolean;
  align?: "left" | "center" | "right";
  colSpan?: number | "100%";
  css?: CSS;
};

export const Cell = ({
  children,
  header = false,
  tabularNumbers,
  align,
  colSpan,
  css,
}: Props) => {
  return (
    <StyledCell
      as={header ? "th" : undefined}
      tabularNumbers={tabularNumbers}
      align={align}
      colSpan={colSpan as unknown as number}
      css={css}
    >
      {children}
    </StyledCell>
  );
};

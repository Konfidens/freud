import { type CSS, styled } from "../../../stitches";

type Props = {
  children: React.ReactNode;
  css?: CSS;
};

const StyledRow = styled("tr", {
  "&:not(:last-of-type)": {
    borderBottom: "1px solid $colors$gray200",
  },
});

export const Row = ({ children, css }: Props) => {
  return <StyledRow css={css}>{children}</StyledRow>;
};

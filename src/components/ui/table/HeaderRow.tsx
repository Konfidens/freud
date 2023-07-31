import { styled } from "../../../stitches";

type Props = {
  children: React.ReactNode;
};

const StyledHeaderRow = styled("tr", {
  bg: "$gray50",
  borderBottom: "1px solid $colors$gray300",
});

export const HeaderRow = ({ children }: Props) => {
  return <StyledHeaderRow>{children}</StyledHeaderRow>;
};

import { styled } from "../../../stitches";
import { Div } from "../basic/Div";
import { Icon } from "../icon/Icon";

const CellContent = styled("button", {
  px: "$3",
  py: "$2",
  fontSize: "$s",
  fontWeight: "500",
  color: "$textBody",
  border: "none",
  width: "100%",
  height: "100%",
  bg: "transparent",
  display: "flex",
  alignItems: "center",

  "th:first-of-type > &": {
    pl: "$6",
  },

  "th:last-of-type > &": {
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
        justifyContent: "flex-start",
      },
      center: {
        justifyContent: "center",
      },
      right: {
        justifyContent: "flex-end",
      },
    },
    sortable: {
      true: {
        cursor: "pointer",
        "&:hover": {
          bg: "$gray100",
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    tabularNumbers: "false",
    align: "left",
    sortable: "false",
  },
});

type CellContentProps = React.ComponentProps<typeof CellContent>;

type Props = CellContentProps & {
  sortDirection: "asc" | "desc" | false;
};

export const HeaderCell = ({
  children,
  tabularNumbers,
  align,
  onClick,
  sortDirection,
  sortable,
}: Props) => {
  return (
    <th>
      <CellContent
        tabularNumbers={tabularNumbers}
        align={align}
        onClick={onClick}
        sortable={sortable}
      >
        {children}
        {sortable && sortDirection ? (
          <Div css={{ ml: "$1" }}>
            <Icon
              name={sortDirection === "asc" ? "arrowUpSolid" : "arrowDownSolid"}
              color="green450"
            />
          </Div>
        ) : undefined}
      </CellContent>
    </th>
  );
};

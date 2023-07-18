import { FramerBox } from '../framerBox/FramerBox';

type Props = React.ComponentProps<typeof FramerBox> & {
  as?: React.ElementType;
};

export const SidebarItemGroup = ({ children, as, css, ...rest }: Props) => (
  <FramerBox
    as={as}
    css={{
      display: 'flex',
      flexDirection: 'column',
      gap: '$2',
      ...css,
    }}
    {...rest}
  >
    {children}
  </FramerBox>
);

import { FramerBox } from '../framerBox/FramerBox';
import { HR } from '../hr/HR';

type Props = React.ComponentProps<typeof FramerBox> & {
  as?: React.ElementType;
};

export const SidebarSeparator = ({ as }: Props) => (
  <FramerBox
    as={as}
    css={{
      display: 'flex',
      flexDirection: 'column',
      gap: '$2',
      py: '$6',
    }}
  >
    <HR />
  </FramerBox>
);

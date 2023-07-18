import { motion } from 'framer-motion';

import { styled, theme } from '~/stitches';

import { SidebarItemGroup } from './ItemGroup';
import { SidebarSeparator } from './Separator';
import { Item } from './item/Item';
import { ItemText } from './item/ItemText';

const Aside = styled(motion.aside);

type Props = {
  minified?: boolean;
} & React.ComponentProps<typeof Aside>;

const MINIFIED_WIDTH = theme.sizes[20].value;
const EXPANDED_WIDTH = theme.sizes[64].value;

export const Sidebar = ({ children, minified }: Props) => {
  return (
    <Aside
      className="print-hidden"
      css={{
        display: 'none',
        flexShrink: 0,
        bg: 'white',
        height: '100%',
        borderRight: '1px solid $gray200',
        p: '$4',
        overflowX: 'hidden',

        '@m2': {
          display: 'initial',
        },
      }}
      initial={{
        opacity: 0,
        width: minified ? MINIFIED_WIDTH : EXPANDED_WIDTH,
      }}
      animate={{
        opacity: 1,
        width: minified ? MINIFIED_WIDTH : EXPANDED_WIDTH,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      }}
    >
      {children}
    </Aside>
  );
};

Sidebar.Item = Item;
Sidebar.ItemGroup = SidebarItemGroup;
Sidebar.Separator = SidebarSeparator;
Sidebar.AnimatedText = ItemText;
Sidebar.MINIFIED_WIDTH = MINIFIED_WIDTH;
Sidebar.EXPANDED_WIDTH = EXPANDED_WIDTH;

import * as RadixPopover from '@radix-ui/react-popover';

import { CSS } from '~/stitches'
import { Icon } from '../icon/Icon';

import {
  StyledPopoverArrow,
  StyledPopoverClose,
  StyledPopoverContent,
} from './StyledPopover';

type Root = React.ComponentProps<typeof RadixPopover.Root>;
type Content = React.ComponentProps<typeof StyledPopoverContent>;

export type PopoverProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  backgroundColor?: CSS['backgroundColor'];
  closeButton?: boolean;

  // Root props
  open?: Root['open'];
  defaultOpen?: Root['defaultOpen'];
  onOpenChange?: Root['onOpenChange'];

  // Content props
  side?: Content['side'];
  sideOffset?: Content['sideOffset'];
  align?: Content['align'];
  alignOffset?: Content['alignOffset'];
  css?: CSS;
  hideArrow?: boolean;
  arrowOffset?: number;
};

export const Popover = ({
  children,
  content,
  backgroundColor,
  closeButton = false,
  open,
  defaultOpen,
  onOpenChange,
  side,
  sideOffset = 6,
  align,
  alignOffset,
  css,
  hideArrow = false,
  arrowOffset = 20,
}: PopoverProps) => {
  return (
    <RadixPopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <StyledPopoverContent
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          css={{ ...css, backgroundColor }}
        >
          {content}
          {closeButton && (
            <StyledPopoverClose aria-label="Lukk">
              <Icon name="x" />
            </StyledPopoverClose>
          )}
          {!hideArrow && (
            <StyledPopoverArrow
              offset={arrowOffset}
              width={12}
              height={6}
              css={{ fill: backgroundColor }}
            />
          )}
        </StyledPopoverContent>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

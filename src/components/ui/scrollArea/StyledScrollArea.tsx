import * as RadixScrollArea from '@radix-ui/react-scroll-area';

import { styled } from '~/stitches';

const SCROLLBAR_SIZE = 10;

export const StyledRoot = styled(RadixScrollArea.Root, {
  width: '100%',
  height: '85vh',
  overflow: 'hidden',
});

export const StyledViewport = styled(RadixScrollArea.Viewport, {
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  bg: 'transparent !important',
});

export const StyledScrollbar = styled(RadixScrollArea.Scrollbar, {
  display: 'flex',
  // ensures no selection
  userSelect: 'none',
  // disable browser handling of all panning and zooming gestures on touch devices
  touchAction: 'none',
  padding: 2,
  background: 'hsla(0, 0%, 0%, 0.05)',
  transition: 'background 80ms ease-out',
  '&:hover': { background: 'hsla(0, 0%, 0%, 0.05)' },
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height: SCROLLBAR_SIZE,
  },
});

export const StyledThumb = styled(RadixScrollArea.Thumb, {
  flex: 1,
  background: 'hsla(0, 0%, 0%, 0.5)',
  borderRadius: SCROLLBAR_SIZE,
  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
});

export const StyledCorner = styled(RadixScrollArea.Corner, {
  background: 'hsla(0, 0%, 0%, 0.05)',
});

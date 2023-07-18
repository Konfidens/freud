import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { styled } from '~/stitches';

type Props = {
  children: React.ReactNode;
  minified?: boolean;
  minifiedText?: string;
};

const Div = styled(motion.div);

/**
 * Makes text only visible to screen readers when sidebar is minified.
 * Animates between expanded and minified state.
 */
export const ItemText = ({ children, minified, minifiedText }: Props) => (
  <>
    <AnimatePresence initial={false}>
      {!minified && (
        <Div
          css={{ flexShrink: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.2,
            },
          }}
        >
          {children}
        </Div>
      )}
    </AnimatePresence>
    {minified && (
      <Div css={{ visibleFor: 'screenreaders-only' }}>
        {minifiedText || children}
      </Div>
    )}
  </>
);

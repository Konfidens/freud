import React from 'react';

import { StyledTextArea } from './StyledTextArea';

type StyledTextAreaProps = React.ComponentProps<typeof StyledTextArea>;

export const TextArea = React.forwardRef(
  (
    props: StyledTextAreaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>,
  ) => <StyledTextArea {...props} ref={ref} />,
);
TextArea.displayName = 'TextArea';

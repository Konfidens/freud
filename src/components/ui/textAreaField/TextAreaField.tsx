import React from 'react';

import { Div } from '../basic/Div';
import { ErrorMessage } from '../errorMessage/ErrorMessage';
import { HelpPopover, HelpPopoverProps } from '../label/HelpPopover';
import { HelpText } from '../label/HelpText';
import { Label } from '../label/Label';
import { LabelSuffix } from '../label/LabelSuffix';
import { getAriaDescribedBy } from '../label/utils';
import { TextArea } from '../textArea/TextArea';

type TextAreaProps = React.ComponentProps<typeof TextArea>;

type Props = TextAreaProps & {
  id: string;
  label?: string;
  labelSuffix?: React.ReactNode;
  helpText?: string;
  helpPopover?: React.ReactNode;
  helpPopoverProps?: HelpPopoverProps;
  error?: boolean;
  errorMessage?: string;
};

export const TextAreaField = React.forwardRef(
  (
    {
      css,
      helpText,
      helpPopover,
      helpPopoverProps,
      id,
      label,
      labelSuffix,
      errorMessage,
      error,
      ...rest
    }: Props,
    ref: React.ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const errorMessageId = `${id}-error`;
    const labelSuffixId = `${id}-labelSuffix`;
    const helpTextId = `${id}-helpText`;

    const ariaDescribedBy = getAriaDescribedBy([
      !!errorMessage && error ? errorMessageId : undefined,
      helpText ? helpTextId : undefined,
      labelSuffix ? labelSuffixId : undefined,
    ]);

    return (
      <Div
        css={{
          display: 'flex',
          flexDirection: 'column',
          ...css,
        }}
      >
        <Div
          css={{ mb: '$1', display: 'flex', justifyContent: 'space-between' }}
        >
          {label && (
            <div>
              <Label htmlFor={id}>{label}</Label>
              {labelSuffix && (
                <LabelSuffix id={labelSuffixId}>{labelSuffix}</LabelSuffix>
              )}
            </div>
          )}

          {helpPopover && (
            <HelpPopover {...helpPopoverProps}>{helpPopover}</HelpPopover>
          )}
        </Div>
        <TextArea
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          {...rest}
          css={{ height: '100%' }}
          ref={ref}
        />
        {helpText && <HelpText id={helpTextId}>{helpText}</HelpText>}
        <ErrorMessage show={!!error} id={errorMessageId} css={{ mt: '$2' }}>
          {errorMessage}
        </ErrorMessage>
      </Div>
    );
  },
);
TextAreaField.displayName = 'TextAreaField';

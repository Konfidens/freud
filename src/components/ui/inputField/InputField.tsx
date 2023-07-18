import { PropertyValue } from '@stitches/react';
import React from 'react';

import { CSS } from '~/stitches';
import { LiteralUnion } from '~/types/literalUnion';
import { Div } from '../basic/Div';
import { ErrorMessage } from '../errorMessage/ErrorMessage';
import { Input } from '../input/Input';
import { HelpPopover, HelpPopoverProps } from '../label/HelpPopover';
import { HelpText } from '../label/HelpText';
import { Label } from '../label/Label';
import { LabelSuffix } from '../label/LabelSuffix';
import { getAriaDescribedBy } from '../label/utils';

type InputProps = React.ComponentProps<typeof Input>;

type Props = Omit<InputProps, 'id'> & {
  width?: LiteralUnion<PropertyValue<'width'>, string>;
  id: string;
  label: string;
  labelSuffix?: React.ReactNode;
  helpText?: React.ReactNode;
  helpPopover?: React.ReactNode;
  helpPopoverProps?: HelpPopoverProps;
  error?: boolean;
  errorMessage?: string;
  css?: CSS;
};

export const InputField = React.forwardRef(
  (
    {
      css,
      id,
      label,
      helpText,
      helpPopover,
      helpPopoverProps,
      labelSuffix,
      errorMessage,
      error,
      width = '100%',
      ...rest
    }: Props,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    const errorMessageId = `${id}-error`;
    const helpTextId = `${id}-helpText`;
    const labelSuffixId = `${id}-labelSuffix`;

    const ariaDescribedBy = getAriaDescribedBy([
      !!errorMessage && error ? errorMessageId : undefined,
      helpText ? helpTextId : undefined,
      labelSuffix ? labelSuffixId : undefined,
    ]);

    return (
      <Div
        css={{
          width,
          display: 'flex',
          flexDirection: 'column',
          ...css,
        }}
      >
        <Div
          css={{ mb: '$1', display: 'flex', justifyContent: 'space-between' }}
        >
          <div>
            <Label htmlFor={id}>{label}</Label>
            {labelSuffix && (
              <LabelSuffix id={labelSuffixId}>{labelSuffix}</LabelSuffix>
            )}
          </div>

          {helpPopover && (
            <HelpPopover {...helpPopoverProps}>{helpPopover}</HelpPopover>
          )}
        </Div>

        <Input
          id={id}
          width={width}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          {...rest}
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

InputField.displayName = 'InputField';

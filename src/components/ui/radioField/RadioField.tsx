import React from 'react';

import { Div } from '../basic/Div';
import { ErrorMessage } from '../errorMessage/ErrorMessage';
import { Label } from '../label/Label';
import { Radio, RadioProps } from '../radio/Radio';
import { RadioGroup, RadioGroupProps } from '../radio/RadioGroup';

import { Fieldset } from './Fieldset';
import { Legend } from './Legend';

export type Props = RadioGroupProps & {
  id: string;
  options: Array<{
    value: string;
    label: string | JSX.Element;
    disabled?: boolean;
  }>;
  disabled?: boolean;
  error?: boolean;
  legend?: string;
  errorMessage?: string;
  size?: RadioProps['size'];
};

export const RadioField = React.forwardRef(
  (
    {
      options,
      id,
      disabled,
      error,
      errorMessage,
      css,
      legend,
      size,
      ...rest
    }: Props,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const errorMessageId = `${id}-error`;

    return (
      <Div css={css}>
        <Fieldset>
          {!!legend && <Legend>{legend}</Legend>}
          <RadioGroup
            css={{
              mt: legend ? '$2' : undefined,
              display: 'flex',
              flexDirection: 'column',
              gap: '$3',
            }}
            id={id}
            ref={ref}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              !!errorMessage && error ? errorMessageId : undefined
            }
            {...rest}
          >
            {options.map((option) => {
              const optionId = `${id}-${option.label}`;
              return (
                <Div key={optionId} css={{ display: 'flex' }}>
                  <Radio
                    disabled={option.disabled || disabled}
                    id={optionId}
                    value={option.value}
                    css={{ mr: '$3' }}
                    size={size}
                  />
                  <Label
                    htmlFor={optionId}
                    disabled={option.disabled || disabled}
                    css={{ mt: size === 'small' ? '-1px' : undefined }}
                  >
                    {option.label}
                  </Label>
                </Div>
              );
            })}
          </RadioGroup>
        </Fieldset>
        <ErrorMessage
          show={!!error}
          id={errorMessageId}
          iconCss={{ mr: '$4' }}
          css={{ mt: '$2' }}
        >
          {errorMessage}
        </ErrorMessage>
      </Div>
    );
  },
);

RadioField.displayName = 'RadioField';

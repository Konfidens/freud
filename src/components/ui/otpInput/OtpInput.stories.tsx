import { Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { Div } from '../basic/Div';
import { ErrorMessage } from '../errorMessage/ErrorMessage';

import { OtpInput } from './OtpInput';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: OtpInput,
} as Meta;

const Template = (props: React.ComponentProps<typeof OtpInput>) => (
  <OtpInput {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof OtpInput>;

export const OtpDefault = () => {
  const { register, watch } = useForm({
    defaultValues: {
      otp: '',
    },
  });

  const otpFromUser = watch('otp');

  const TOP_SECRET_OTP_CODE = '112358';
  const showError =
    otpFromUser.length === 6 && otpFromUser !== TOP_SECRET_OTP_CODE;

  return (
    <Div
      css={{
        width: '$96',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <OtpInput numDigits={6} value={otpFromUser} {...register('otp')} />
      <ErrorMessage show={showError} css={{ mt: '$4', mx: 'auto' }}>
        Wrong code! Try fibonaccis number 😉
      </ErrorMessage>
      {otpFromUser === TOP_SECRET_OTP_CODE && (
        <Div css={{ color: '$green500', fontWeight: 500, mx: 'auto' }}>
          Success! 🎉
        </Div>
      )}
    </Div>
  );
};

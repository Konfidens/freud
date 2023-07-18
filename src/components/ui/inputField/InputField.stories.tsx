import { Meta } from '@storybook/react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { styled } from '~/stitches';
import { Button } from '../button/Button';
import { Icon } from '../icon/Icon';

import { InputField } from './InputField';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: InputField,
} as Meta;

const Template = (props: React.ComponentProps<typeof InputField>) => (
  <InputField {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof InputField>;

export const InputFieldDefault = Template.bind({});
InputFieldDefault.args = {
  id: 'email-input',
  label: 'Email',
  error: true,
  prefix: <Icon name="mail" />,
  errorMessage: 'Please enter your email address',
  width: '$64',
  css: {
    mb: '$4',
  },
};

interface ExampleInputs {
  email: string;
  password: string;
}

const Form = styled('form', {
  width: '$80',
});

export const WithReactHookForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExampleInputs>();

  const onSubmit: SubmitHandler<ExampleInputs> = (data) => {
    console.log(JSON.stringify(data)); // eslint-disable-line no-console
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        {...register('email', {
          required: 'Please enter your email address',
        })}
        id="email-input"
        label="Email"
        error={!!errors.email}
        errorMessage={errors.email?.message}
        css={{
          mb: '$4',
        }}
      />
      <InputField
        {...register('password', {
          required: 'Please enter your password. At least 8 characters',
        })}
        id="password-input"
        type="password"
        label="Password"
        error={!!errors.password}
        errorMessage={errors.password?.message}
        css={{
          mb: '$4',
        }}
      />

      <Button type="submit" align="center" color="green">
        Submit
      </Button>
    </Form>
  );
};

export const LabelSuffix = Template.bind({});
LabelSuffix.args = {
  id: 'email-input',
  label: 'Email',
  labelSuffix: '(Optional)',
  width: '$64',
  css: {
    mb: '$4',
  },
};

export const HelpText = Template.bind({});
HelpText.args = {
  id: 'helpText-input',
  label: 'Description',
  helpText: 'Useful information about the client',
  width: '$64',
  css: {
    mb: '$4',
  },
};

export const HelpPopover = Template.bind({});
HelpPopover.args = {
  id: 'helpPopover-input',
  label: 'Description',
  helpPopover: 'Useful information about the client',
  width: '$64',
  css: {
    mb: '$4',
  },
};

export const HelpPopoverWithCustomProps = Template.bind({});
HelpPopoverWithCustomProps.args = {
  id: 'HelpPopoverCustom-input',
  label: 'Description',
  helpPopover: 'Bam!',
  helpPopoverProps: {
    backgroundColor: '$red500',
    css: {
      width: '$64',
      height: '$64',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '$3xl',
    },
  },
  width: '$64',
  css: {
    mb: '$4',
  },
};

export const HelpTextAndError = Template.bind({});
HelpTextAndError.args = {
  id: 'helpTextAndError-input',
  label: 'Description',
  helpText:
    'Useful information about the client. This description is extra long.',
  error: true,
  errorMessage: 'This field is required',
  width: '$64',
  css: {
    mb: '$4',
  },
};

export const ButtonAddon = () => {
  return (
    <>
      <InputField
        id="email-input"
        label="Email"
        prefix={
          <Button type="submit" align="center" withBorder color="green">
            Submit
          </Button>
        }
        prefixStyle="button"
      />
      <InputField
        id="email-input"
        label="Email"
        suffix={
          <Button type="submit" align="center">
            Submit
          </Button>
        }
        suffixStyle="button"
      />
    </>
  );
};

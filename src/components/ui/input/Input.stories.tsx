import { Meta } from '@storybook/react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { Div } from '../basic/Div';
import { Button } from '../button/Button';
import { ErrorMessage } from '../errorMessage/ErrorMessage';
import { Icon } from '../icon/Icon';

import { Input } from './Input';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Input,
} as Meta;

const Template = (props: React.ComponentProps<typeof Input>) => (
  <Input {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Input>;

export const InputDefault = Template.bind({});
InputDefault.args = {
  placeholder: 'Search',
};

export const InputDisabled = Template.bind({});
InputDisabled.args = {
  placeholder: 'Search',
  disabled: true,
};

export const InputPrefixAndSuffix = Template.bind({});
InputPrefixAndSuffix.args = {
  placeholder: 'Cost',
  prefix: <Icon name="wallet" />,
  suffix: <Icon name="wallet" />,
};

export const InputPrefixAndSuffixText = Template.bind({});
InputPrefixAndSuffixText.args = {
  placeholder: 'Cost',
  prefix: 'Prefix',
  suffix: 'Suffix',
};

export const InputPrefixAndSuffixBorder = Template.bind({});
InputPrefixAndSuffixBorder.args = {
  placeholder: 'Cost',
  prefix: <Icon name="wallet" />,
  suffix: <Icon name="wallet" />,
  prefixStyle: 'border',
  suffixStyle: 'border',
};

export const InputPrefixAndSuffixBorderText = Template.bind({});
InputPrefixAndSuffixBorderText.args = {
  placeholder: 'Cost',
  prefix: 'https://',
  suffix: 'kr',
  prefixStyle: 'border',
  suffixStyle: 'border',
};

export const InputPrefixAndSuffixDisabled = Template.bind({});
InputPrefixAndSuffixDisabled.args = {
  placeholder: 'Cost',
  prefix: <Icon name="wallet" />,
  suffix: <Icon name="wallet" />,
  disabled: true,
};

export const InputLoading = Template.bind({});
InputLoading.args = {
  placeholder: 'Search',
  prefix: <Icon name="spinner" />,
};

export const InputCustomWidth = Template.bind({});
InputCustomWidth.args = {
  placeholder: 'Search',
  width: '$160',
};

export const InputError = Template.bind({});
InputError.args = {
  placeholder: 'Search',
  prefix: <Icon name="search" />,
  suffix: <Icon name="search" />,
  error: true,
};

export const InputErrorBorder = Template.bind({});
InputErrorBorder.args = {
  placeholder: 'Search',
  prefix: <Icon name="search" />,
  suffix: <Icon name="search" />,
  prefixStyle: 'border',
  suffixStyle: 'border',
  error: true,
};

export const InputInteger = () => {
  return (
    <form action="">
      <label htmlFor="nin">ID number:</label>
      <Input
        id="nin"
        name="nina"
        type="integer"
        title="Only integers allowed"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

interface ExampleInputs {
  firstName: string;
  lastName: string;
}

export const WithReactHookForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExampleInputs>();

  const onSubmit: SubmitHandler<ExampleInputs> = (data) => {
    console.log(JSON.stringify(data)); // eslint-disable-line no-console
  };

  console.log(watch('firstName')); // eslint-disable-line no-console

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Div css={{ display: 'flex', flexDirection: 'column' }}>
        <Input
          {...register('firstName', {
            required: 'You gotta enter your name, yo!',
          })}
          error={!!errors.firstName}
          placeholder="First name"
          css={{
            my: '$3',
          }}
        />
        <ErrorMessage show={!!errors.firstName}>
          {errors.firstName?.message}
        </ErrorMessage>
        <Input
          {...register('lastName', { required: true })}
          error={!!errors.lastName}
          placeholder="Last name"
          css={{
            my: '$3',
          }}
        />
        <p>{errors.lastName?.message}</p>
        <Button type="submit" align="center" color="green">
          Submit
        </Button>
      </Div>
    </form>
  );
};

export const WithLargeSize = Template.bind({});
WithLargeSize.args = {
  size: 'large',
  placeholder: 'Search',
  prefix: <Icon name="search" />,
};

export const ButtonAddon = () => {
  return (
    <Div css={{ display: 'flex', gap: '$4' }}>
      <Input
        id="email-input"
        prefix={
          <Button type="submit" align="center" withBorder color="green">
            Submit
          </Button>
        }
        prefixStyle="button"
      />
      <Input
        id="email-input"
        suffix={
          <Button type="submit" align="center">
            Submit
          </Button>
        }
        suffixStyle="button"
      />
    </Div>
  );
};

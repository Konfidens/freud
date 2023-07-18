import { Meta } from '@storybook/react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { styled } from '~/stitches';
import { Button } from '../button/Button';

import { TextAreaField } from './TextAreaField';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: TextAreaField,
} as Meta;

const Template = (props: React.ComponentProps<typeof TextAreaField>) => (
  <TextAreaField {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof TextAreaField>;

export const Basic = Template.bind({});
Basic.args = {
  id: 'note',
  label: 'Notat',
  placeholder: 'Hvordan går det om dagen?',
  error: true,
  errorMessage: 'Noe feiler deg',
  css: {
    width: '$96',
  },
};

interface ExampleTextArea {
  note: string;
}

const Form = styled('form', {
  width: '$96',
});

export const WithReactHookForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExampleTextArea>();

  const onSubmit: SubmitHandler<ExampleTextArea> = (data) => {
    console.log(JSON.stringify(data)); // eslint-disable-line no-console
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextAreaField
        {...register('note', {
          required: 'Altså, du er nødt til å skrive noe...',
        })}
        id="note"
        label="Notat"
        error={!!errors.note}
        errorMessage={errors.note?.message}
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
  id: 'labelSuffix',
  label: 'Notat',
  labelSuffix: '(Valgfritt)',
  css: {
    width: '$96',
  },
};

export const HelpPopover = Template.bind({});
HelpPopover.args = {
  id: 'helpPopover',
  label: 'Notat',
  helpPopover: 'Bare synlig for deg',
  css: {
    width: '$96',
  },
};

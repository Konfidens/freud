import { Meta } from '@storybook/react';
import { useState } from 'react';

import { Div } from '../basic/Div';
import { Button } from '../button/Button';

import { ErrorBox } from './ErrorBox';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: ErrorBox,
} as Meta;

const Template = (props: React.ComponentProps<typeof ErrorBox>) => (
  <ErrorBox {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof ErrorBox>;

export const Default = Template.bind({});
Default.args = {
  children: 'User does not exist',
  show: true,
};

export const WithTriggerButton = () => {
  const [showError, setShowError] = useState(true);

  return (
    <Div
      css={{
        bg: '$gray50',
        borderRadius: '$lg',
        p: '$6',
        boxShadow: '$border',
      }}
    >
      <Button
        color="gray"
        onClick={() => {
          setShowError(!showError);
        }}
        css={{ mb: '$4' }}
      >
        {showError ? 'Skjul feilmelding' : 'Vis feilmelding'}
      </Button>
      <ErrorBox show={showError}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, quae
        blanditiis dolore a distinctio nisi laboriosam quod asperiores eveniet,
        impedit voluptatem! Ullam doloribus hic maxime expedita vel facere
        adipisci atque!
      </ErrorBox>
    </Div>
  );
};

export const WithOverflowingContent = Template.bind({});
WithOverflowingContent.args = {
  children: (
    <>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, quae
        blanditiis dolore a distinctio nisi laboriosam quod asperiores eveniet,
        impedit voluptatem! Ullam doloribus hic maxime expedita vel facere
        adipisci atque!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, quae
        blanditiis dolore a distinctio nisi laboriosam quod asperiores eveniet,
        impedit voluptatem! Ullam doloribus hic maxime expedita vel facere
        adipisci atque!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, quae
        blanditiis dolore a distinctio nisi laboriosam quod asperiores eveniet,
        impedit voluptatem! Ullam doloribus hic maxime expedita vel facere
        adipisci atque!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, quae
        blanditiis dolore a distinctio nisi laboriosam quod asperiores eveniet,
        impedit voluptatem! Ullam doloribus hic maxime expedita vel facere
        adipisci atque!
      </p>
    </>
  ),
  show: true,
};

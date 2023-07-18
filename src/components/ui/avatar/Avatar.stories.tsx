import { Meta } from '@storybook/react';

import { styled } from '../../../stitches';
import { Div } from '../basic/Div';
import { H6 } from '../typography/H6';
import { P } from '../typography/P';

import {
  Avatar,
  AVATAR_PARENT_CLASSNAME,
  AVATAR_PARENT_SELECTED_CLASSNAME,
} from './Avatar';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Avatar,
} as Meta;

const Template = (props: React.ComponentProps<typeof Avatar>) => (
  <Avatar {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Avatar>;

export const Fallback = Template.bind({});
Fallback.args = {};

const avatarUrl =
  'https://github.com/mortnod/dotfiles/assets/3471625/65a84c3e-321b-43ec-933f-65955d64bde1';
const avatarUrl2 =
  'https://github.com/mortnod/dotfiles/assets/3471625/bdf88e4b-b2dd-4aa7-acbb-fe93107cfcd4';

export const Image = Template.bind({});
Image.args = {
  src: avatarUrl,
};

// The
export const Border = () => {
  return (
    <>
      <Div
        css={{
          display: 'flex',
          gap: '$4',
        }}
      >
        <Avatar src={avatarUrl} size="$16" />
        <Avatar src={avatarUrl2} size="$16" />
      </Div>
      <P css={{ mt: '$4', maxWidth: '$measureNarrow' }}>
        To avoid the avatar blending with the background, all avatars have a
        semitransparent border. It&apos;s clearly visible when the image
        background is light, but fades away on darker backgrounds.
      </P>
    </>
  );
};

export const Size = () => {
  return (
    <Div
      css={{
        display: 'flex',
        gap: '$4',
      }}
    >
      <Avatar src={avatarUrl} size="$6" />
      <Avatar src={avatarUrl} size="28px" />
      <Avatar src={avatarUrl} size="$10" /* The default */ />
      <Avatar src={avatarUrl} size="$16" />
    </Div>
  );
};

export const BorderRadius = () => {
  return (
    <Div
      css={{
        display: 'flex',
        gap: '$4',
      }}
    >
      <Avatar src={avatarUrl} size="$16" />
      <Avatar src={avatarUrl} size="$16" borderRadius="$3xl" />
      <Avatar src={avatarUrl} size="$16" borderRadius="$full" />
    </Div>
  );
};

const ExampleButton = styled('button', {
  border: 'none',
  fontFamily: '$sansSerif',
  fontWeight: 500,
  fontSize: '$m',
  height: '$10',
  borderRadius: '$lg',
  display: 'flex',
  alignItems: 'center',
  p: '$2',
  cursor: 'pointer',

  variants: {
    selected: {
      false: {
        bg: 'white',
        color: '$gray700',

        '&:hover': {
          bg: '$gray100',
        },
      },
      true: {
        bg: '$green50',
        color: '$gray900',

        '&:hover': {
          bg: '$green50',
        },
      },
    },
  },

  defaultVariants: {
    selected: 'false',
  },
});

export const FallbackHoverAndSelectStyling = () => {
  return (
    <>
      <H6 css={{ mb: '$2' }}>Select coworker</H6>
      <Div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '$2',
          maxWidth: '$64',
        }}
      >
        <ExampleButton
          color="lightGreen"
          className={`${AVATAR_PARENT_CLASSNAME} ${AVATAR_PARENT_SELECTED_CLASSNAME}`}
          selected
        >
          <Avatar size="$6" css={{ mr: '$2' }} />
          Aleksander
        </ExampleButton>
        <ExampleButton
          color="transparent"
          className={`${AVATAR_PARENT_CLASSNAME}`}
        >
          <Avatar size="$6" css={{ mr: '$2' }} />
          Aslak
        </ExampleButton>
        <ExampleButton
          color="transparent"
          className={`${AVATAR_PARENT_CLASSNAME}`}
        >
          <Avatar size="$6" css={{ mr: '$2' }} />
          Henrik
        </ExampleButton>
        <ExampleButton
          color="transparent"
          className={`${AVATAR_PARENT_CLASSNAME}`}
        >
          <Avatar size="$6" css={{ mr: '$2' }} />
          Morten
        </ExampleButton>
        <ExampleButton
          color="transparent"
          className={`${AVATAR_PARENT_CLASSNAME}`}
        >
          <Avatar size="$6" css={{ mr: '$2' }} />
          Tomas
        </ExampleButton>
      </Div>
    </>
  );
};

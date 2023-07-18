import { Meta } from '@storybook/react';

import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';
import { Logo } from '../logo/Logo';
import { P } from '../typography/P';

import { Link } from './Link';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Link,
} as Meta;

const Template = (props: React.ComponentProps<typeof Link>) => (
  <Link {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Link>;

export const Variants = () => (
  <Div css={{ width: '$80' }}>
    <P>
      <Link href="#hei">Green Underline (default)</Link>
    </P>

    <P>
      <Link href="#hei" variant="green">
        Green
      </Link>
    </P>

    <P>
      <Link href="#hei" variant="blue">
        Blue
      </Link>
    </P>

    <P>
      <Link href="#hei" variant="lightBlue">
        Light Blue
      </Link>
    </P>

    <P>
      <Link href="#hei" variant="black">
        Black
      </Link>
    </P>

    <P>
      <Link href="#hei" variant="block">
        <Logo css={{ width: '$40' }} />
      </Link>
    </P>
  </Div>
);

export const MultipleLines = () => (
  <Div
    css={{ display: 'flex', flexDirection: 'column', gap: '$4', width: '$80' }}
  >
    <P size="l">
      We&apos;re no strangers to love.
      <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        You know the rules and so do I. A full commitment&apos;s what I&apos;m
        thinking of.
      </Link>{' '}
      You wouldn&apos;t get this from any other guy.
    </P>
    <P>
      We&apos;re no strangers to love.
      <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        You know the rules and so do I. A full commitment&apos;s what I&apos;m
        thinking of.
      </Link>{' '}
      You wouldn&apos;t get this from any other guy.
    </P>
    <P size="s">
      We&apos;re no strangers to love.
      <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        You know the rules and so do I. A full commitment&apos;s what I&apos;m
        thinking of.
      </Link>{' '}
      You wouldn&apos;t get this from any other guy.
    </P>
    <P size="xs">
      We&apos;re no strangers to love.
      <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        You know the rules and so do I. A full commitment&apos;s what I&apos;m
        thinking of.
      </Link>{' '}
      You wouldn&apos;t get this from any other guy.
    </P>
  </Div>
);

export const AsButton = () => (
  <Div css={{ width: '$80' }}>
    <P>
      <Link
        variant="blue"
        as="button"
        onClick={() => {
          alert('Never gonna give you up! 😘'); // eslint-disable-line no-alert
        }}
      >
        You know the rules and so do I
      </Link>
    </P>

    <P>
      <Link
        variant="greenUnderline"
        as="button"
        onClick={() => {
          alert('Never gonna give you up! 😘'); // eslint-disable-line no-alert
        }}
      >
        You know the rules and so do I
      </Link>
    </P>
  </Div>
);

export const PrefixAndSuffix = () => (
  <Div css={{ width: '$80' }}>
    <P>
      <Link variant="blue" href="#hei" prefix={<Icon name="copy" />}>
        Kopier til alle dager
      </Link>
    </P>

    <P>
      <Link
        variant="greenUnderline"
        href="#hei"
        suffix={<Icon name="arrowNarrowRight" />}
      >
        You know the rules and so do I
      </Link>
    </P>
  </Div>
);

import { keyframes, styled } from '~/stitches';

const Svg = styled('svg');

const check = keyframes({
  '100%': { strokeDashoffset: '0' },
});

export const AnimatedCheckmark = () => {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="-2 -2 17 17"
      css={{
        position: 'absolute',
        top: '3px',
        left: '2px',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeDasharray: '$sizes$4',
        strokeDashoffset: '$sizes$4',

        '[data-state="checked"] &': {
          animation: `${check} 300ms ease forwards`,
        },
      }}
    >
      <polyline points="1.5 6 4.5 9 10.5 1" />
    </Svg>
  );
};

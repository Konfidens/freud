import { keyframes, styled } from "~/stitches";


const spin = keyframes({
  '100%': {
    transform: 'rotate(1turn)',
  },
});

const Svg = styled('svg');
const Circle = styled('path');
const Quadrant = styled('path');

export const Spinner = ({
  color = 'currentColor',
  size = '1em',
  strokeWidth = 1.8,
  speed = '1s',
  className = '',
  ariaHidden = true,
}) => (
  <Svg
    aria-hidden={ariaHidden}
    className={className}
    css={{
      animation: `${spin} ${speed} linear infinite`,
    }}
    width={size}
    height={size}
    stroke={color}
    strokeWidth={strokeWidth}
    fill="none"
    viewBox="0 0 24 24"
  >
    <Circle
      css={{
        opacity: 0.25,
      }}
      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
    />
    <Quadrant d="M12 3C7.02944 3 3 7.02944 3 12C3 14.2825 3.84968 16.3666 5.25 17.9531" />
  </Svg>
);

export const Magnet = ({
  color = 'currentColor',
  size = '1em',
  strokeWidth = 1.8,
  className = '',
  ariaHidden = true,
}) => (
  <svg
    aria-hidden={ariaHidden}
    className={className}
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth={strokeWidth}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 8.5V12C20 17 17 21 12 21C7 21 4 17 4 12V8.5M20 8.5V4C20 3.44772 19.5523 3 19 3H16C15.4477 3 15 3.44772 15 4V8.5M20 8.5H15M15 8.5V12C15 14 14.5 16 12 16C9.5 16 9 14 9 12V8.5M9 8.5V4C9 3.44772 8.55228 3 8 3H5C4.44772 3 4 3.44772 4 4V8.5M9 8.5H4"
    />
  </svg>
);

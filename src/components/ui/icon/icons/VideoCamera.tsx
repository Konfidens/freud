export const VideoCamera = ({
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
      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

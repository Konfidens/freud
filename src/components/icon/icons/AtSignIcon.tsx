export const AtSign = ({
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
      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
    />
  </svg>
);
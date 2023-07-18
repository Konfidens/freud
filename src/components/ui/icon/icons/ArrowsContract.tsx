export const ArrowsContract = ({
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
      d="M9 19.2727L12 16M12 16L15 19.2727M12 16V22"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 4.72727L12 8M12 8L9 4.72727M12 8V2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 12H4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

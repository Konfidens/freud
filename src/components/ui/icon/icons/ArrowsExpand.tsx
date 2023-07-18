export const ArrowsExpand = ({
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
      d="M15 18.7273L12 22M12 22L9 18.7273M12 22V16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 5.27273L12 2M12 2L15 5.27273M12 2V8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 12H4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

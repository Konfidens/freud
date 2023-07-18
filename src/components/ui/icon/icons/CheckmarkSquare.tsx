export const CheckmarkSquare = ({
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
      d="M8.625 12L10.875 14.25L15.375 9.75M5.25 3C4.00736 3 3 4.00736 3 5.25V18.75C3 19.9927 4.00736 21 5.25 21H18.75C19.9927 21 21 19.9927 21 18.75V5.25C21 4.00736 19.9927 3 18.75 3H5.25Z"
    />
  </svg>
);

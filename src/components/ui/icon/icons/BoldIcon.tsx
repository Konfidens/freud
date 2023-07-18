export const Bold = ({
  color = 'currentColor',
  size = '1em',
  strokeWidth = 3,
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
      d="M6.00354 4.00073H14.0035C15.0644 4.00073 16.0818 4.42216 16.832 5.1723C17.5821 5.92245 18.0035 6.93987 18.0035 8.00073C18.0035 9.0616 17.5821 10.079 16.832 10.8292C16.0818 11.5793 15.0644 12.0007 14.0035 12.0007H6.00354V4.00073Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.00354 11.9988H15.0035C16.0644 11.9988 17.0818 12.4202 17.832 13.1704C18.5821 13.9205 19.0035 14.9379 19.0035 15.9988C19.0035 17.0596 18.5821 18.0771 17.832 18.8272C17.0818 19.5774 16.0644 19.9988 15.0035 19.9988H6.00354V11.9988Z"
    />
  </svg>
);

export const LogIn = ({
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
      d="M11.75 15L14.75 12M14.75 12L11.75 9M14.75 12H2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 15L6 18.75C6 19.3467 6.29349 19.919 6.81592 20.341C7.33834 20.7629 8.0469 21 8.78571 21L16.2143 21C16.9531 21 17.6617 20.7629 18.1841 20.341C18.7065 19.919 19 19.3467 19 18.75L19 5.25C19 4.65326 18.7065 4.08097 18.1841 3.65901C17.6617 3.23706 16.9531 3 16.2143 3L8.78571 3C8.0469 3 7.33834 3.23705 6.81592 3.65901C6.29349 4.08097 6 4.65326 6 5.25L6 9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

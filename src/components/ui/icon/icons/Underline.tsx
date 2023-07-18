export const Underline = ({
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
      d="M6.00356 3.00049V11.2906C6.00356 13.1752 6.6357 14.9826 7.76092 16.3152C8.88614 17.6478 10.4123 18.3965 12.0036 18.3965C13.5949 18.3965 15.121 17.6478 16.2462 16.3152C17.3714 14.9826 18.0036 13.1752 18.0036 11.2906V3.00049M4.00238 22.1983H20.0024"
    />
  </svg>
);

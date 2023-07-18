export const Unarchive = ({
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
      d="M20.25 7.5L19.625 18.132C19.5913 18.705 19.3399 19.2436 18.9222 19.6373C18.5045 20.031 17.952 20.2502 17.378 20.25H6.622C6.04796 20.2502 5.49555 20.031 5.07783 19.6373C4.66011 19.2436 4.40868 18.705 4.375 18.132L3.75 7.5M3.375 7.5H20.625C21.246 7.5 21.75 6.996 21.75 6.375V4.875C21.75 4.254 21.246 3.75 20.625 3.75H3.375C2.754 3.75 2.25 4.254 2.25 4.875V6.375C2.25 6.996 2.754 7.5 3.375 7.5Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 14.2727L12 11M12 11L15 14.2727M12 11V17"
    />
  </svg>
);

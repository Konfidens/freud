export const Filter = ({
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
      d="M4.01038 7.04064H13.7937M4.01038 16.958C4.01038 18.6012 5.32438 19.9332 6.94538 19.9332C8.56638 19.9332 9.88038 18.6012 9.88038 16.958C9.88038 15.3148 8.56638 13.9828 6.94538 13.9828C5.32438 13.9828 4.01038 15.3148 4.01038 16.958ZM19.6637 16.958H9.88038H19.6637ZM19.6637 7.04064C19.6637 8.68384 18.3497 10.0158 16.7287 10.0158C15.1077 10.0158 13.7937 8.68384 13.7937 7.04064C13.7937 5.39743 15.1077 4.06543 16.7287 4.06543C18.3497 4.06543 19.6637 5.39743 19.6637 7.04064Z"
    />
  </svg>
);

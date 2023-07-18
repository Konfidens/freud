export const PlusThick = ({
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
    fill={color}
    viewBox="0 0 24 24"
    stroke="none"
    strokeWidth={strokeWidth}
  >
    <path d="M18.1786 9.89286H13.3571V5.07143C13.3571 4.4798 12.8773 4 12.2857 4H11.2143C10.6227 4 10.1429 4.4798 10.1429 5.07143V9.89286H5.32143C4.7298 9.89286 4.25 10.3727 4.25 10.9643V12.0357C4.25 12.6273 4.7298 13.1071 5.32143 13.1071H10.1429V17.9286C10.1429 18.5202 10.6227 19 11.2143 19H12.2857C12.8773 19 13.3571 18.5202 13.3571 17.9286V13.1071H18.1786C18.7702 13.1071 19.25 12.6273 19.25 12.0357V10.9643C19.25 10.3727 18.7702 9.89286 18.1786 9.89286Z" />
  </svg>
);

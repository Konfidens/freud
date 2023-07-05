export const Stethoscope = ({
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
    viewBox="0 0 24 24"
    fill={color}
    stroke="none"
    strokeWidth={strokeWidth}
  >
    <path d="M6.68748 15.0466V15.7497C6.68748 19.1952 9.63278 22 13.25 22C16.8671 22 19.8124 19.1952 19.8124 15.7497V11.8551C21.0741 11.4605 21.9882 10.2847 21.9999 8.8979C22.0116 7.20252 20.6484 5.78839 18.9492 5.74933C17.1913 5.71027 15.7499 7.12439 15.7499 8.87446C15.7499 10.273 16.6679 11.4566 17.9374 11.8551V15.7497C17.9374 18.1639 15.8359 20.1249 13.25 20.1249C10.664 20.1249 8.56248 18.1639 8.56248 15.7497V15.0466C11.2187 14.5974 13.25 12.2809 13.25 9.49949V3.07344C13.25 2.85468 13.0976 2.66327 12.8828 2.61639L10.1601 2.01089C9.90622 1.9562 9.65622 2.11246 9.60153 2.36638L9.39841 3.28048C9.34372 3.5344 9.49997 3.78441 9.75388 3.8391L11.375 4.19849V9.4487C11.375 11.5152 9.72653 13.2262 7.66013 13.2457C5.57811 13.2692 3.87499 11.5816 3.87499 9.49949V4.20239L5.49608 3.843C5.74999 3.78831 5.90624 3.5383 5.85155 3.28438L5.64842 2.36638C5.59374 2.11246 5.33983 1.9562 5.08983 2.01089L2.36719 2.61639C2.15234 2.66327 2 2.85468 2 3.07344V9.49949C2 12.2809 4.03124 14.5974 6.68748 15.0466ZM18.8749 7.62441C19.5624 7.62441 20.1249 8.18693 20.1249 8.87446C20.1249 9.56199 19.5624 10.1245 18.8749 10.1245C18.1874 10.1245 17.6249 9.56199 17.6249 8.87446C17.6249 8.18693 18.1874 7.62441 18.8749 7.62441Z" />
  </svg>
);

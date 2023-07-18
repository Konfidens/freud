import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';

type Props = {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
};

/**
 * If certain conditions are met, this component will
 * hide `children` and show a spinner instead
 */
export const ButtonContentWrap = ({
  children,
  prefix,
  suffix,
  loading,
}: Props) => {
  if (!loading) {
    return <>{children}</>;
  }

  if (!prefix && !suffix) {
    return (
      <>
        <Div css={{ visibleFor: 'screenreaders-only-reserve-space' }}>
          {children}
        </Div>
        <Div
          className="buttonIcon"
          css={{
            position: 'absolute',

            // Center horizontally
            left: '50%',
            transform: 'translate(-50%, 0)',
          }}
        >
          <Icon name="spinner" />
        </Div>
      </>
    );
  }

  return <>{children}</>;
};

import { CSS } from '~/stitches';
import { Div } from '../basic/Div';

type Props = {
  children: React.ReactNode;
  css?: CSS;
  overlayCss?: CSS;
  borderRadius?: CSS['borderRadius'];
};

export const ImageBorder = ({
  children,
  borderRadius = '$md',
  css,
  overlayCss,
}: Props) => {
  return (
    <Div css={{ position: 'relative', borderRadius, ...css }}>
      {children}
      <Div
        css={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / .1)',
          borderRadius,
          ...overlayCss,
        }}
      />
    </Div>
  );
};

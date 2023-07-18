import { Div } from '../basic/Div';
import { ButtonMinimal } from '../buttonMinimal/ButtonMinimal';
import { Icon } from '../icon/Icon';
import { Popover, PopoverProps } from '../popover/Popover';

export type HelpPopoverProps = Omit<PopoverProps, 'content' | 'children'>;

type Props = HelpPopoverProps & {
  children: React.ReactNode;
};

export const HelpPopover = ({ css, children, ...rest }: Props) => {
  return (
    <Div css={{ display: 'flex', flexShrink: 0 }}>
      <Popover
        content={children}
        align="end"
        hideArrow
        backgroundColor="$gray800"
        css={{
          zIndex: 100, // Avoid input icons showing up on top of popover
          maxWidth: '$64',
          color: 'white',
          boxShadow: 'none',
          ...css,
        }}
        {...rest}
      >
        <ButtonMinimal css={{ borderRadius: '$full' }}>
          <Icon
            name="questionMarkMini"
            size="5"
            color="gray700"
            aria-label="Mer informasjon"
          />
        </ButtonMinimal>
      </Popover>
    </Div>
  );
};

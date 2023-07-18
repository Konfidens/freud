import Image, { StaticImageData } from 'next/image';

import { CSS, styled } from '../../../stitches';
import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';
import { ImageBorder } from '../imageBorder/ImageBorder';

type Props = {
  src?: string | StaticImageData;
  alt?: string;
  borderRadius?: CSS['borderRadius'];
  size?: CSS['size'];
  css?: CSS;
  fallbackCss?: CSS;
};

export const Avatar = ({
  src,
  alt = 'User photo',
  size = '$10',
  borderRadius = '$md',
  css,
  fallbackCss,
}: Props) => {
  return (
    <Div
      css={{
        size,
        borderRadius,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        ...css,
      }}
    >
      {src && (
        <ImageBorder css={{ size }} borderRadius={borderRadius}>
          <Image src={src} alt={alt} layout="fill" objectFit="cover" />
        </ImageBorder>
      )}

      {/* Fallback image */}
      {!src && (
        <FallbackAvatar css={fallbackCss}>
          <Icon name="user" size="66.667%" />
        </FallbackAvatar>
      )}
    </Div>
  );
};

export const AVATAR_PARENT_CLASSNAME = 'avatar-parent';
export const AVATAR_PARENT_SELECTED_CLASSNAME = 'avatar-parent-selected';

const FallbackAvatar = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  bg: '$gray150',
  color: '$gray500',

  // HOVER
  [`.${AVATAR_PARENT_CLASSNAME}:hover &`]: {
    bg: '$gray200',
  },

  // SELECTED
  [`.${AVATAR_PARENT_SELECTED_CLASSNAME} &`]: {
    bg: '$green150',
    color: '$green700',
  },

  // HOVER AND SELECTED
  [`.${AVATAR_PARENT_CLASSNAME}:hover.${AVATAR_PARENT_SELECTED_CLASSNAME} &`]: {
    bg: '$green150',
    color: '$green700',
  },
});

import { styled } from '~/stitches';
import { buttonClassName } from '../button/constants';
import { InputWrap } from '../input/InputWrap';
import { StyledInput } from '../input/StyledInput';

export const FormGroup = styled('div', {
  display: 'flex',

  [`& .${buttonClassName.button},
    & ${StyledInput}`]: {
    borderLeftRadius: 0,
    borderRightRadius: 0,
  },

  [`& .${buttonClassName.button}:first-child,
    & ${InputWrap}:first-child input`]: {
    borderLeftRadius: '$lg',
  },

  [`& .${buttonClassName.button}:last-child,
    & ${InputWrap}:last-child input`]: {
    borderRightRadius: '$lg',
  },
});

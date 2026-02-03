import React from 'react';
import Button from './button';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  backgroundColor: SharedStyle.PRIMARY_COLOR.surface,
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  boxShadow: 'none'
};

const STYLE_HOVER = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.hover,
  borderColor: 'rgba(255, 255, 255, 0.15)',
  color: SharedStyle.PRIMARY_COLOR.text_main,
  boxShadow: 'none'
};

export default function CancelButton({children, ...rest}) {
  return <Button style={STYLE} styleHover={STYLE_HOVER} {...rest}>{children}</Button>
}

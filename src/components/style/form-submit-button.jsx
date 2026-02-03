import React from 'react';
import Button from './button';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  borderColor: SharedStyle.SECONDARY_COLOR.main,
  backgroundColor: SharedStyle.SECONDARY_COLOR.main,
  color: SharedStyle.COLORS.white,
  boxShadow: '0 1px 3px rgba(59, 130, 246, 0.3)'
};

const STYLE_HOVER = {
  borderColor: SharedStyle.SECONDARY_COLOR.alt,
  backgroundColor: SharedStyle.SECONDARY_COLOR.alt,
  color: SharedStyle.COLORS.white,
  boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)'
};

export default function FormSubmitButton({children, ...rest}) {
  return <Button type="submit" style={STYLE} styleHover={STYLE_HOVER} {...rest}>{children}</Button>
}

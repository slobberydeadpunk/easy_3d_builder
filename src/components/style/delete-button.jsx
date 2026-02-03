import React from 'react';
import Button from './button';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  borderColor: SharedStyle.STATUS_COLORS.error,
  backgroundColor: SharedStyle.STATUS_COLORS.error,
  color: SharedStyle.COLORS.white,
  boxShadow: '0 1px 3px rgba(239, 68, 68, 0.3)'
};

const STYLE_HOVER = {
  backgroundColor: '#DC2626',
  borderColor: '#DC2626',
  color: SharedStyle.COLORS.white,
  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
};

export default function FormDeleteButton({children, ...rest}) {
  return <Button style={STYLE} styleHover={STYLE_HOVER} {...rest}>{children}</Button>
}

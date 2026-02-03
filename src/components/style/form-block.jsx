import React from 'react';
import * as SharedStyle from '../../shared-style';

const BASE_STYLE = {
  marginBottom: SharedStyle.SPACING.lg,
  padding: `0 ${SharedStyle.SPACING.lg}`
};

export default function FormBlock({children, style, ...rest}) {
  return <div style={{...BASE_STYLE, ...style}} {...rest}>{children}</div>
}

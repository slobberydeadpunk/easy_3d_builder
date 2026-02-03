import React from 'react';
import * as SharedStyle from '../../shared-style';

const BASE_STYLE = {
  display: "block",
  marginBottom: "6px",
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.xs,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  color: SharedStyle.PRIMARY_COLOR.text_muted,
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

export default function FormLabel({children, style, ...rest}) {
  return <label style={{...BASE_STYLE, ...style}} {...rest}>{children}</label>
}

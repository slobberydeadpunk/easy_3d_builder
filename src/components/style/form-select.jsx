import React from 'react';
import * as SharedStyle from '../../shared-style';

const BASE_STYLE = {
  display: "block",
  width: "100%",
  padding: "8px 32px 8px 12px",
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  color: SharedStyle.PRIMARY_COLOR.text_main,
  backgroundColor: SharedStyle.PRIMARY_COLOR.input,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  outline: "none",
  borderRadius: SharedStyle.RADIUS.md,
  height: "36px",
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
  cursor: "pointer",
  transition: SharedStyle.TRANSITIONS.fast,
  background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>") ${SharedStyle.PRIMARY_COLOR.input}`,
  backgroundPosition: "calc(100% - 10px) 50%",
  backgroundRepeat: "no-repeat",
  boxSizing: "border-box"
};

export default function FormSelect({children, style, ...rest}) {
  return <select style={{...BASE_STYLE, ...style}} {...rest}>{children}</select>;
}

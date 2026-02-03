var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import * as SharedStyle from '../../shared-style';

var BASE_STYLE = {
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
  background: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23A1A1AA\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'></polyline></svg>") ' + SharedStyle.PRIMARY_COLOR.input,
  backgroundPosition: "calc(100% - 10px) 50%",
  backgroundRepeat: "no-repeat",
  boxSizing: "border-box"
};

export default function FormSelect(_ref) {
  var children = _ref.children,
      style = _ref.style,
      rest = _objectWithoutProperties(_ref, ['children', 'style']);

  return React.createElement(
    'select',
    _extends({ style: _extends({}, BASE_STYLE, style) }, rest),
    children
  );
}
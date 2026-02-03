var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import Button from './button';
import * as SharedStyle from '../../shared-style';

var STYLE = {
  borderColor: SharedStyle.STATUS_COLORS.error,
  backgroundColor: SharedStyle.STATUS_COLORS.error,
  color: SharedStyle.COLORS.white,
  boxShadow: '0 1px 3px rgba(239, 68, 68, 0.3)'
};

var STYLE_HOVER = {
  backgroundColor: '#DC2626',
  borderColor: '#DC2626',
  color: SharedStyle.COLORS.white,
  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
};

export default function FormDeleteButton(_ref) {
  var children = _ref.children,
      rest = _objectWithoutProperties(_ref, ['children']);

  return React.createElement(
    Button,
    _extends({ style: STYLE, styleHover: STYLE_HOVER }, rest),
    children
  );
}
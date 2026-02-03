var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import Button from './button';
import * as SharedStyle from '../../shared-style';

var STYLE = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  backgroundColor: SharedStyle.PRIMARY_COLOR.surface,
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  boxShadow: 'none'
};

var STYLE_HOVER = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.hover,
  borderColor: 'rgba(255, 255, 255, 0.15)',
  color: SharedStyle.PRIMARY_COLOR.text_main,
  boxShadow: 'none'
};

export default function CancelButton(_ref) {
  var children = _ref.children,
      rest = _objectWithoutProperties(_ref, ['children']);

  return React.createElement(
    Button,
    _extends({ style: STYLE, styleHover: STYLE_HOVER }, rest),
    children
  );
}
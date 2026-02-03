var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import * as SharedStyle from '../../shared-style';

var STYLE = {
  padding: '4px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: SharedStyle.RADIUS.md,
  backgroundColor: SharedStyle.PRIMARY_COLOR.input,
  cursor: 'pointer',
  height: '36px',
  width: '100%',
  transition: SharedStyle.TRANSITIONS.fast
};

var EREG_NUMBER = /^.*$/;

export default function FormColorInput(_ref) {
  var onChange = _ref.onChange,
      rest = _objectWithoutProperties(_ref, ['onChange']);

  var onChangeCustom = function onChangeCustom(event) {
    var value = event.target.value;
    if (EREG_NUMBER.test(value)) {
      onChange(event);
    }
  };

  return React.createElement('input', _extends({ type: 'color', style: STYLE, onChange: onChangeCustom, autoComplete: 'off' }, rest));
}
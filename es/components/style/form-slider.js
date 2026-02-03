var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import ReactRange from '@mapbox/react-range';
import FormTextInput from './form-text-input';
import * as SharedStyle from '../../shared-style';

var containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: SharedStyle.SPACING.md
};

var sliderContainerStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center'
};

var sliderStyle = {
  display: 'block',
  width: '100%',
  height: '36px',
  cursor: 'pointer'
};

var textContainerStyle = {
  width: '70px',
  flexShrink: 0
};

var textStyle = {
  height: '36px',
  textAlign: 'center',
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamilyMono
};

export default function FormNumberInput(_ref) {
  var value = _ref.value,
      onChange = _ref.onChange,
      rest = _objectWithoutProperties(_ref, ['value', 'onChange']);

  return React.createElement(
    'div',
    { style: containerStyle },
    React.createElement(
      'div',
      { style: sliderContainerStyle },
      React.createElement(ReactRange, _extends({ type: 'range', style: sliderStyle, onChange: onChange, value: value }, rest))
    ),
    React.createElement(
      'div',
      { style: textContainerStyle },
      React.createElement(FormTextInput, { value: value, onChange: onChange, style: textStyle })
    )
  );
}
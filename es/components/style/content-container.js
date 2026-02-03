var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

var STYLE = {
  padding: SharedStyle.SPACING.xl,
  overflowY: 'auto',
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  scrollbarWidth: 'thin',
  scrollbarColor: SharedStyle.PRIMARY_COLOR.hover + ' transparent'
};

export default function ContentContainer(_ref) {
  var children = _ref.children,
      width = _ref.width,
      height = _ref.height,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style;

  return React.createElement(
    'div',
    { style: _extends({ width: width, height: height }, STYLE, style), onWheel: function onWheel(event) {
        return event.stopPropagation();
      } },
    children
  );
}

ContentContainer.propsType = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object
};
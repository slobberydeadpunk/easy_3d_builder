var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

var STYLE = {
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
  fontSize: '20px',
  position: 'relative',
  cursor: 'pointer',
  borderRadius: SharedStyle.RADIUS.lg,
  transition: SharedStyle.TRANSITIONS.normal,
  backgroundColor: 'transparent'
};

var STYLE_HOVER = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.hover
};

var STYLE_ACTIVE = {
  backgroundColor: 'rgba(59, 130, 246, 0.15)',
  boxShadow: SharedStyle.SHADOWS.glow
};

var STYLE_TOOLTIP = {
  position: 'absolute',
  minWidth: '120px',
  maxWidth: '180px',
  color: SharedStyle.COLORS.white,
  background: SharedStyle.PRIMARY_COLOR.surface,
  padding: '8px 12px',
  textAlign: 'center',
  visibility: 'visible',
  borderRadius: SharedStyle.RADIUS.md,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: SharedStyle.SHADOWS.lg,
  left: '100%',
  top: '50%',
  transform: 'translateY(-50%)',
  marginLeft: '12px',
  zIndex: SharedStyle.Z_INDEX.tooltip,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  whiteSpace: 'nowrap',
  backdropFilter: 'blur(8px)'
};

var STYLE_TOOLTIP_PIN = {
  position: 'absolute',
  top: '50%',
  right: '100%',
  marginTop: '-6px',
  width: '0',
  height: '0',
  borderRight: '6px solid ' + SharedStyle.PRIMARY_COLOR.surface,
  borderTop: '6px solid transparent',
  borderBottom: '6px solid transparent'
};

var ToolbarButton = function (_Component) {
  _inherits(ToolbarButton, _Component);

  function ToolbarButton(props, context) {
    _classCallCheck(this, ToolbarButton);

    var _this = _possibleConstructorReturn(this, (ToolbarButton.__proto__ || Object.getPrototypeOf(ToolbarButton)).call(this, props, context));

    _this.state = { active: false };
    return _this;
  }

  _createClass(ToolbarButton, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var state = this.state,
          props = this.props;

      var isHovered = state.active;
      var isActive = props.active;

      var color = isActive ? SharedStyle.SECONDARY_COLOR.main : isHovered ? SharedStyle.SECONDARY_COLOR.light : SharedStyle.PRIMARY_COLOR.icon;

      var buttonStyle = _extends({}, STYLE, isHovered && !isActive ? STYLE_HOVER : {}, isActive ? STYLE_ACTIVE : {});

      return React.createElement(
        'div',
        {
          style: buttonStyle,
          onMouseOver: function onMouseOver(event) {
            return _this2.setState({ active: true });
          },
          onMouseOut: function onMouseOut(event) {
            return _this2.setState({ active: false });
          },
          onClick: props.onClick
        },
        React.createElement(
          'div',
          { style: {
              color: color,
              transition: SharedStyle.TRANSITIONS.fast,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            } },
          props.children
        ),
        isHovered && React.createElement(
          'div',
          { style: STYLE_TOOLTIP },
          React.createElement('span', { style: STYLE_TOOLTIP_PIN }),
          props.tooltip
        )
      );
    }
  }]);

  return ToolbarButton;
}(Component);

export default ToolbarButton;


ToolbarButton.propTypes = {
  active: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
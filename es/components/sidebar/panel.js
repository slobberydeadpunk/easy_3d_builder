var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

var STYLE = {
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  userSelect: 'none'
};

var STYLE_TITLE = {
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  padding: '12px 16px',
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  margin: '0px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: SharedStyle.TRANSITIONS.fast,
  letterSpacing: '0.3px',
  textTransform: 'uppercase'
};

var STYLE_TITLE_HOVER = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.hover
};

var STYLE_CONTENT = {
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  padding: '0px',
  backgroundColor: SharedStyle.PRIMARY_COLOR.surface,
  overflow: 'hidden',
  transition: 'max-height 200ms ease-out, opacity 200ms ease-out'
};

var STYLE_ARROW = {
  transition: SharedStyle.TRANSITIONS.fast,
  opacity: 0.6
};

var Panel = function (_Component) {
  _inherits(Panel, _Component);

  function Panel(props, context) {
    _classCallCheck(this, Panel);

    var _this = _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this, props, context));

    _this.state = {
      opened: props.hasOwnProperty('opened') ? props.opened : false,
      hover: false
    };
    return _this;
  }

  _createClass(Panel, [{
    key: 'toggleOpen',
    value: function toggleOpen() {
      this.setState({ opened: !this.state.opened });
    }
  }, {
    key: 'toggleHover',
    value: function toggleHover() {
      this.setState({ hover: !this.state.hover });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          name = _props.name,
          headComponents = _props.headComponents,
          children = _props.children;
      var _state = this.state,
          opened = _state.opened,
          hover = _state.hover;


      var titleStyle = _extends({}, STYLE_TITLE, hover ? STYLE_TITLE_HOVER : {}, {
        color: hover ? SharedStyle.SECONDARY_COLOR.light : SharedStyle.PRIMARY_COLOR.text_alt
      });

      var arrowStyle = _extends({}, STYLE_ARROW, {
        transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
        opacity: hover ? 1 : 0.6
      });

      return React.createElement(
        'div',
        { style: STYLE },
        React.createElement(
          'h3',
          {
            style: titleStyle,
            onMouseEnter: function onMouseEnter() {
              return _this2.toggleHover();
            },
            onMouseLeave: function onMouseLeave() {
              return _this2.toggleHover();
            },
            onClick: function onClick() {
              return _this2.toggleOpen();
            }
          },
          React.createElement(
            'span',
            { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            name,
            headComponents
          ),
          React.createElement(FaAngleDown, { style: arrowStyle })
        ),
        React.createElement(
          'div',
          { style: _extends({}, STYLE_CONTENT, {
              maxHeight: opened ? '2000px' : '0px',
              opacity: opened ? 1 : 0
            }) },
          children
        )
      );
    }
  }]);

  return Panel;
}(Component);

export default Panel;


Panel.propTypes = {
  name: PropTypes.string.isRequired,
  headComponents: PropTypes.array,
  opened: PropTypes.bool
};
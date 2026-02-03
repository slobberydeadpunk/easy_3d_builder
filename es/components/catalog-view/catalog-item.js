var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlusCircle as IconAdd } from 'react-icons/fa';
import * as SharedStyle from '../../shared-style';

var STYLE_BOX = {
  width: '100%',
  minHeight: '200px',
  padding: SharedStyle.SPACING.md,
  background: SharedStyle.PRIMARY_COLOR.surface,
  border: '1px solid rgba(255, 255, 255, 0.06)',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: SharedStyle.SHADOWS.sm,
  borderRadius: SharedStyle.RADIUS.lg,
  transition: SharedStyle.TRANSITIONS.normal,
  alignSelf: 'stretch',
  justifySelf: 'stretch',
  display: 'flex',
  flexDirection: 'column'
};

var STYLE_BOX_HOVER = _extends({}, STYLE_BOX, {
  background: SharedStyle.PRIMARY_COLOR.hover,
  borderColor: SharedStyle.SECONDARY_COLOR.main,
  boxShadow: SharedStyle.SHADOWS.glow,
  transform: 'translateY(-2px)'
});

var STYLE_TITLE = {
  width: '100%',
  textAlign: 'center',
  display: 'block',
  marginBottom: SharedStyle.SPACING.sm,
  textTransform: 'capitalize',
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  color: SharedStyle.PRIMARY_COLOR.text_main
};

var STYLE_TITLE_HOVER = _extends({}, STYLE_TITLE, {
  color: SharedStyle.SECONDARY_COLOR.light
});

var STYLE_IMAGE_CONTAINER = {
  width: '100%',
  height: '120px',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: SharedStyle.RADIUS.md,
  padding: 0,
  margin: 0,
  marginBottom: SharedStyle.SPACING.sm,
  backgroundColor: SharedStyle.PRIMARY_COLOR.input
};

var STYLE_IMAGE = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundSize: 'contain',
  backgroundPosition: '50% 50%',
  backgroundColor: SharedStyle.PRIMARY_COLOR.input,
  backgroundRepeat: 'no-repeat',
  transition: SharedStyle.TRANSITIONS.normal
};

var STYLE_IMAGE_HOVER = _extends({}, STYLE_IMAGE, {
  transform: 'scale(1.1)'
});

var STYLE_PLUS_HOVER = {
  marginTop: '2em',
  color: SharedStyle.SECONDARY_COLOR.main,
  fontSize: '2em',
  opacity: '0.9',
  width: '100%',
  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
};

var STYLE_DESCRIPTION = {
  display: '-webkit-box',
  height: '2.5em',
  margin: '0 auto',
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.xs,
  fontStyle: 'normal',
  lineHeight: '1.25em',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: SharedStyle.PRIMARY_COLOR.text_muted,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  marginTop: 'auto'
};

var STYLE_TAGS = {
  listStyle: 'none',
  margin: '0px',
  padding: '0px',
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.xs,
  marginBottom: SharedStyle.SPACING.xs,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px'
};

var STYLE_TAG = {
  display: 'inline-block',
  background: 'rgba(59, 130, 246, 0.15)',
  color: SharedStyle.SECONDARY_COLOR.light,
  padding: '2px 8px',
  borderRadius: SharedStyle.RADIUS.full,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium
};

var CatalogItem = function (_Component) {
  _inherits(CatalogItem, _Component);

  function CatalogItem(props) {
    _classCallCheck(this, CatalogItem);

    var _this = _possibleConstructorReturn(this, (CatalogItem.__proto__ || Object.getPrototypeOf(CatalogItem)).call(this, props));

    _this.state = { hover: false };
    return _this;
  }

  _createClass(CatalogItem, [{
    key: 'select',
    value: function select() {
      var element = this.props.element;

      switch (element.prototype) {
        case 'lines':
          this.context.linesActions.selectToolDrawingLine(element.name);
          break;
        case 'items':
          this.context.itemsActions.selectToolDrawingItem(element.name);
          break;
        case 'holes':
          this.context.holesActions.selectToolDrawingHole(element.name);
          break;
      }

      this.context.projectActions.pushLastSelectedCatalogElementToHistory(element);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var element = this.props.element;
      var hover = this.state.hover;

      return React.createElement(
        'div',
        {
          style: hover ? STYLE_BOX_HOVER : STYLE_BOX,
          onClick: function onClick(e) {
            return _this2.select();
          },
          onMouseEnter: function onMouseEnter(e) {
            return _this2.setState({ hover: true });
          },
          onMouseLeave: function onMouseLeave(e) {
            return _this2.setState({ hover: false });
          }
        },
        React.createElement(
          'b',
          { style: !hover ? STYLE_TITLE : STYLE_TITLE_HOVER },
          element.info.title
        ),
        React.createElement(
          'div',
          { style: STYLE_IMAGE_CONTAINER },
          React.createElement(
            'div',
            { style: _extends({}, !hover ? STYLE_IMAGE : STYLE_IMAGE_HOVER, { backgroundImage: 'url(' + element.info.image + ')' }) },
            hover ? React.createElement(IconAdd, { style: STYLE_PLUS_HOVER }) : null
          )
        ),
        React.createElement(
          'ul',
          { style: STYLE_TAGS },
          element.info.tag.map(function (tag, index) {
            return React.createElement(
              'li',
              { style: STYLE_TAG, key: index },
              tag
            );
          })
        ),
        React.createElement(
          'div',
          { style: STYLE_DESCRIPTION },
          element.info.description
        )
      );
    }
  }]);

  return CatalogItem;
}(Component);

export default CatalogItem;


CatalogItem.propTypes = {
  element: PropTypes.object.isRequired
};

CatalogItem.contextTypes = {
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdNavigateNext } from 'react-icons/md';
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
  justifySelf: 'stretch'
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
  padding: SharedStyle.SPACING.md,
  textTransform: 'capitalize',
  transition: SharedStyle.TRANSITIONS.normal,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.base,
  color: SharedStyle.PRIMARY_COLOR.text_main
};

var STYLE_TITLE_HOVERED = _extends({}, STYLE_TITLE, {
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.lg,
  color: SharedStyle.SECONDARY_COLOR.light
});

var STYLE_NEXT_HOVER = {
  color: SharedStyle.SECONDARY_COLOR.main,
  fontSize: '4em',
  opacity: 0.8,
  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
};

var CONTAINER_DIV = {
  background: SharedStyle.PRIMARY_COLOR.input,
  borderRadius: SharedStyle.RADIUS.md,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SharedStyle.SPACING.sm
};

var CatalogPageItem = function (_Component) {
  _inherits(CatalogPageItem, _Component);

  function CatalogPageItem(props) {
    _classCallCheck(this, CatalogPageItem);

    var _this = _possibleConstructorReturn(this, (CatalogPageItem.__proto__ || Object.getPrototypeOf(CatalogPageItem)).call(this, props));

    _this.state = { hover: false };
    return _this;
  }

  _createClass(CatalogPageItem, [{
    key: 'changePage',
    value: function changePage(newPage) {
      this.context.projectActions.changeCatalogPage(newPage, this.props.oldPage.name);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var page = this.props.page;
      var hover = this.state.hover;

      return React.createElement(
        'div',
        {
          style: hover ? STYLE_BOX_HOVER : STYLE_BOX,
          onClick: function onClick(e) {
            return _this2.changePage(page.name);
          },
          onMouseEnter: function onMouseEnter(e) {
            return _this2.setState({ hover: true });
          },
          onMouseLeave: function onMouseLeave(e) {
            return _this2.setState({ hover: false });
          }
        },
        hover ? React.createElement(
          'div',
          { style: CONTAINER_DIV },
          React.createElement(
            'b',
            { style: STYLE_TITLE_HOVERED },
            page.label
          ),
          React.createElement(MdNavigateNext, { style: STYLE_NEXT_HOVER })
        ) : React.createElement(
          'div',
          { style: CONTAINER_DIV },
          React.createElement(
            'b',
            { style: STYLE_TITLE },
            page.label
          )
        )
      );
    }
  }]);

  return CatalogPageItem;
}(Component);

export default CatalogPageItem;


CatalogPageItem.propTypes = {
  page: PropTypes.object.isRequired,
  oldPage: PropTypes.object.isRequired
};

CatalogPageItem.contextTypes = {
  projectActions: PropTypes.object.isRequired
};
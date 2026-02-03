var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import PropTypes from 'prop-types';
import { MdArrowBack as Arrow } from 'react-icons/md';
import * as SharedStyle from '../../shared-style';

var breadcrumbStyle = {
  margin: '0 0 ' + SharedStyle.SPACING.lg,
  display: 'flex',
  alignItems: 'center',
  gap: SharedStyle.SPACING.sm
};

var breadcrumbTextStyle = {
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  color: SharedStyle.PRIMARY_COLOR.text_muted,
  cursor: 'pointer',
  padding: '6px 12px',
  borderRadius: SharedStyle.RADIUS.md,
  transition: SharedStyle.TRANSITIONS.fast,
  backgroundColor: 'transparent'
};

var breadcrumbLastTextStyle = _extends({}, breadcrumbTextStyle, {
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.semibold,
  color: SharedStyle.SECONDARY_COLOR.light,
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  cursor: 'default'
});

var breadcrumbTabStyle = {
  fill: SharedStyle.PRIMARY_COLOR.text_muted,
  fontSize: '16px',
  opacity: 0.5
};

var CatalogBreadcrumb = function CatalogBreadcrumb(_ref) {
  var names = _ref.names;


  var labelNames = names.map(function (name, ind) {

    var lastElement = ind === names.length - 1;

    return React.createElement(
      'div',
      { key: ind, style: { display: 'flex' } },
      React.createElement(
        'div',
        { style: !lastElement ? breadcrumbTextStyle : breadcrumbLastTextStyle, onClick: name.action || null },
        name.name
      ),
      !lastElement ? React.createElement(Arrow, { style: breadcrumbTabStyle }) : null
    );
  });

  return React.createElement(
    'div',
    { style: breadcrumbStyle },
    labelNames
  );
};

CatalogBreadcrumb.propTypes = {
  names: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default CatalogBreadcrumb;
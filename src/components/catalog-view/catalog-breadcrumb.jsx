import React from 'react';
import PropTypes from 'prop-types';
import {MdArrowBack as Arrow} from 'react-icons/md';
import * as SharedStyle from '../../shared-style';

const breadcrumbStyle = {
  margin: `0 0 ${SharedStyle.SPACING.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: SharedStyle.SPACING.sm
};

const breadcrumbTextStyle = {
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

const breadcrumbLastTextStyle = {
  ...breadcrumbTextStyle,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.semibold,
  color: SharedStyle.SECONDARY_COLOR.light,
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  cursor: 'default'
};

const breadcrumbTabStyle = {
  fill: SharedStyle.PRIMARY_COLOR.text_muted,
  fontSize: '16px',
  opacity: 0.5
};

const CatalogBreadcrumb = ({ names }) => {

  let labelNames = names.map((name, ind) => {

    let lastElement = ind === names.length - 1;

    return <div key={ind} style={{ display: 'flex' }}>
        <div style={ !lastElement ? breadcrumbTextStyle : breadcrumbLastTextStyle } onClick={name.action || null}>{name.name}</div>
        { !lastElement ? <Arrow style={breadcrumbTabStyle} /> : null }
    </div>
  });

  return <div style={breadcrumbStyle}>{labelNames}</div>;
};

CatalogBreadcrumb.propTypes = {
  names: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default CatalogBreadcrumb;
